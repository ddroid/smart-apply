import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Stagehand } from "@browserbasehq/stagehand";
import { browserbase } from "@/lib/browserbase";
import { z } from "zod";
import OpenAI from "openai";
import { createPostHogServer } from "@/lib/posthog-server";

// We use nodejs runtime since stagehand runs on Node
export const runtime = "nodejs";

// Configure OpenAI SDK to use groq's openai/gpt-oss-120b model as requested
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const posthog = createPostHogServer();
  let session;
  let stagehand: Stagehand | null = null;
  let runId: string | null = null;
  let userId: string | null = null;
  
  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    userId = user.id;

    // Load job and profile data
    const { data: job, error: jobError } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    runId = job.run_id ?? null;

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Derive company homepage URL
    let targetDomain = job.company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
    let companyUrl = `https://www.${targetDomain}`;

    if (job.source_url) {
      try {
        const response = await fetch(job.source_url, { redirect: "follow", method: "GET" });
        const finalUrl = new URL(response.url);
        // Exclude common job boards / ATS
        const atsDomains = ["adzuna", "greenhouse", "lever", "workable", "ashbyhq", "breezy", "myworkdayjobs"];
        const isAts = atsDomains.some(domain => finalUrl.hostname.includes(domain));
        
        if (!isAts) {
          // Strip subdomains
          const parts = finalUrl.hostname.split('.');
          if (parts.length > 2 && parts[parts.length - 2].length > 3) {
            targetDomain = parts.slice(-2).join('.');
          } else if (parts.length > 2) {
            targetDomain = parts.slice(-3).join('.');
          } else {
            targetDomain = finalUrl.hostname;
          }
          companyUrl = `https://${targetDomain}`;
        }
      } catch (e) {
        console.warn("Failed to derive URL from Adzuna redirect, falling back to guess:", e);
      }
    }

    // Initialize Browserbase session
    session = await browserbase.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      timeout: 180,
    });

    stagehand = new Stagehand({
      env: "BROWSERBASE",
      apiKey: process.env.BROWSERBASE_API_KEY!,
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      browserbaseSessionID: session.id,
      model: { 
        modelName: "openai/openai/gpt-oss-120b", 
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: "https://api.groq.com/openai/v1",
      },
      disablePino: true,
    });

    await stagehand.init();
    const page = stagehand.context.activePage();
    if (!page) throw new Error("No active page from Stagehand");

    console.log(`Navigating to ${companyUrl}`);
    let companyResearch: any = { homepage: null, subPages: [] };

    try {
      await page.goto(companyUrl, { waitUntil: "domcontentloaded", timeoutMs: 30000 });
      
      const homepageData = await stagehand.extract(
        "This is a company's homepage. Capture what the company actually does, who it's for, and any concrete signals. Then find 2-3 internal links most worth visiting as an employer (about, careers, team). You MUST return the actual href URL strings (e.g. '/about' or 'https://...'), NEVER return DOM node IDs like '[0-211]'.",
        z.object({
          oneLiner: z.string().describe("What the company does in one sentence").optional(),
          productSummary: z.string().describe("What they build/sell and who it's for").optional(),
          signals: z.array(z.string()).describe("Funding, notable customers, scale, mission, recent news").optional(),
          pageLinks: z.array(z.string()).describe("Internal links (URLs) worth visiting").optional(),
        })
      );

      if (homepageData.oneLiner || homepageData.productSummary) {
        companyResearch.homepage = homepageData;
        
        // Step 2: Navigate sub-pages safely
        if (homepageData.pageLinks && homepageData.pageLinks.length > 0) {
          const baseUrl = new URL(companyUrl);
          
          let validLinks = homepageData.pageLinks
            .map(url => {
              try {
                if (url.startsWith('[') && url.endsWith(']')) return null; // Reject raw DOM node IDs
                return new URL(url, baseUrl.href).href;
              } catch {
                return null;
              }
            })
            .filter((url): url is string => !!url)
            .filter(url => new URL(url).hostname === baseUrl.hostname);
          
          // Max 2 sub pages to save time
          validLinks = validLinks.slice(0, 2);
          
          for (const link of validLinks) {
            try {
              console.log(`Visiting subpage: ${link}`);
              await page.goto(link, { waitUntil: "domcontentloaded", timeoutMs: 20000 });
              
              const subPageData = await stagehand.extract(
                "Extract substance that helps a candidate understand this company before applying: what they do, their values and how they work, the specific technologies and tools they use, notable projects or customers, and how the team operates. Ignore nav, footers, cookie banners, and generic marketing copy.",
                z.object({
                  keyPoints: z.array(z.string()).optional(),
                  technologies: z.array(z.string()).describe("Specific languages, frameworks, tools, platforms").optional(),
                  valuesOrCulture: z.array(z.string()).describe("Stated values, working style, team norms").optional(),
                  notable: z.array(z.string()).describe("Customers, funding, scale, projects, awards").optional(),
                })
              );
              
              companyResearch.subPages.push({ url: link, data: subPageData });
            } catch (e) {
              console.warn(`Failed extracting subpage ${link}:`, e);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Stagehand extraction failed (likely parked domain or navigation timeout):", e);
    } finally {
      if (stagehand) {
        await stagehand.close();
      }
    }

    // Synthesis step using Groq
    const systemPrompt = `You are a sharp career strategist preparing a candidate to apply for a specific role. You are given (a) research collected from the company's own website, (b) the job posting, and (c) the candidate's profile. Produce a concise, concrete briefing that gives this specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.
- You MUST provide at least one item in 'yourEdge' and 'interviewPrep', even if you have to infer it broadly. NEVER return an empty array for these.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": "string",
  "techStack": ["string"],
  "culture": ["string"],
  "whyThisRole": "string",
  "yourEdge": ["string"],
  "gapsToAddress": ["string"],
  "smartQuestions": ["string"],
  "interviewPrep": ["string"],
  "sources": ["string"]
}`;

    const userPrompt = `COMPANY RESEARCH (from their website):
${JSON.stringify(companyResearch)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.about_role}
Matched skills: ${job.matched_skills?.join(", ") || "None"}
Missing skills: ${job.missing_skills?.join(", ") || "None"}

CANDIDATE PROFILE:
Current title: ${profile.current_title}
Experience: ${profile.years_experience} years, level ${profile.experience_level}
Skills: ${profile.skills?.join(", ") || "None"}
Work history: ${JSON.stringify(profile.work_experience)}`;

    let parsedContent: any = {};
    let retries = 0;
    const MAX_RETRIES = 2; // Reduced to prevent excessive waiting
    let valid = false;

    while (retries < MAX_RETRIES && !valid) {
      try {
        const response = await openai.chat.completions.create({
          model: "openai/gpt-oss-120b",
          response_format: { type: "json_object" },
          temperature: 0.4 + (retries * 0.1),
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        parsedContent = JSON.parse(response.choices[0].message.content || "{}");
        
        // As long as it returned an object with arrays, we accept it to prevent loop starvation
        if (Array.isArray(parsedContent.interviewPrep) && Array.isArray(parsedContent.yourEdge)) {
          valid = true;
        } else {
          console.warn(`LLM validation failed (missing arrays). Retry ${retries + 1}/${MAX_RETRIES}`);
          retries++;
        }
      } catch (err) {
        console.warn(`LLM generation error. Retry ${retries + 1}/${MAX_RETRIES}`, err);
        retries++;
      }
    }
    
    const actualSources = [companyUrl];
    if (job.source_url) {
      actualSources.push(job.source_url);
    }
    companyResearch.subPages?.forEach((page: any) => {
      if (page.url) actualSources.push(page.url);
    });

    // Fallback parsing just to ensure valid object
    const dossier = {
      companyOverview: parsedContent.companyOverview || "Research unavailable. Refer to job description.",
      techStack: Array.isArray(parsedContent.techStack) ? parsedContent.techStack : [],
      culture: Array.isArray(parsedContent.culture) ? parsedContent.culture : [],
      whyThisRole: parsedContent.whyThisRole || "",
      yourEdge: Array.isArray(parsedContent.yourEdge) ? parsedContent.yourEdge : [],
      gapsToAddress: Array.isArray(parsedContent.gapsToAddress) ? parsedContent.gapsToAddress : [],
      smartQuestions: Array.isArray(parsedContent.smartQuestions) ? parsedContent.smartQuestions : [],
      interviewPrep: Array.isArray(parsedContent.interviewPrep) ? parsedContent.interviewPrep : [],
      sources: Array.from(new Set(actualSources)), // Remove duplicates
    };

    // Update the DB
    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({
        company_research: dossier,
        researched_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to save dossier to DB:", updateError);
    }

    // PostHog Event
    posthog.capture({
      distinctId: user.id,
      event: "company_researched",
      properties: { userId: user.id, jobId, company: job.company },
    });
    
    return NextResponse.json({ dossier });
  } catch (error: any) {
    console.error("Research agent error:", error);
    if (runId && userId) {
      const insforge = await createInsforgeServer();
      await insforge.database.from("agent_logs").insert([{
        run_id: runId,
        user_id: userId,
        message: `Company research failed: ${error.message || String(error)}`,
        level: "error",
      }]);
    }
    return NextResponse.json({ error: error.message || "Failed to research company." }, { status: 500 });
  } finally {
    await posthog.shutdown();
  }
}
