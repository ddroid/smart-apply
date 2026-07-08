import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { detectAdzunaCountry, searchJobs } from "@/lib/adzuna";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { getPostHogClient } from "@/lib/posthog-server";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, location } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const insforge = await createInsforgeServer();
    const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const posthog = getPostHogClient();

    // Track search started
    posthog.capture({
      distinctId: user.id,
      event: "job_search_started",
      properties: {
        jobTitle,
        location,
      },
    });

    // Fetch from Adzuna
    const country = detectAdzunaCountry(location || "");
    console.log(`Searching Adzuna for: title=${jobTitle}, location=${location}, country=${country}`);
    const adzunaJobs = await searchJobs(jobTitle, location, country);
    console.log(`Adzuna returned ${adzunaJobs.length} jobs.`);

    if (adzunaJobs.length === 0) {
      // Empty stream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          await posthog.shutdown();
        }
      });
      return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
    }

    // Create agent run
    const { data: run, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([
        {
          user_id: user.id,
          job_title_searched: jobTitle,
          location_searched: location || null,
          status: "running",
        },
      ])
      .select("id")
      .single();

    if (runError || !run) {
      return NextResponse.json({ error: "Failed to start run" }, { status: 500 });
    }

    const runId = run.id;

    // Create ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let savedJobsCount = 0;

        for (const job of adzunaJobs) {
          try {
            // Score with AI
            const { object: scoredJob } = await generateObject({
              model: groq("openai/gpt-oss-120b"),
              schema: z.object({
                matchScore: z.number().min(0).max(100),
                matchReason: z.string(),
                matchedSkills: z.array(z.string()),
                missingSkills: z.array(z.string()),
              }),
              system: "You are an expert career counselor. Score the candidate's profile against the job description. Return ONLY valid JSON.",
              prompt: `
              CANDIDATE PROFILE:
              Title: ${profile.current_title || "Unknown"}
              Experience Level: ${profile.experience_level || "Unknown"}
              Years of Experience: ${profile.years_experience || "Unknown"}
              Skills: ${profile.skills?.join(", ") || "None"}
              Job Preferences: ${profile.job_titles_seeking?.join(", ") || "None"}

              JOB POSTING:
              Title: ${job.title}
              Company: ${job.company.display_name}
              Description: ${job.description}

              Evaluate the match and provide a score from 0 to 100. Be realistic and objective. Extract matching skills and missing skills based on the job description. Provide a brief reason for the match score.
              `,
            });

            // Map and Save to DB
            const jobRecord = {
              user_id: user.id,
              run_id: runId,
              source: "search",
              source_url: job.redirect_url,
              external_apply_url: job.redirect_url,
              title: job.title,
              company: job.company.display_name,
              location: job.location.display_name,
              salary: job.salary_min
                ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max! / 1000)}k`
                : null,
              job_type: job.contract_type || "fulltime",
              about_role: job.description,
              match_score: scoredJob.matchScore,
              match_reason: scoredJob.matchReason,
              matched_skills: scoredJob.matchedSkills,
              missing_skills: scoredJob.missingSkills,
              posted_at: job.created,
            };

            const { data: savedJob, error: saveError } = await insforge.database
              .from("jobs")
              .insert([jobRecord])
              .select("*")
              .single();

            if (saveError) {
              console.error("Failed to save job:", saveError);
              await insforge.database.from("agent_logs").insert([{
                run_id: runId,
                user_id: user.id,
                message: `Failed to save job "${job.title}": ${saveError.message}`,
                level: "error",
              }]);
              continue;
            }

            savedJobsCount++;

            // PostHog event
            posthog.capture({
              distinctId: user.id,
              event: "job_found",
              properties: {
                jobId: savedJob.id,
                runId: runId,
                source: "search",
                matchScore: scoredJob.matchScore,
              },
            });

            // Stream to client as SSE
            const sseChunk = `data: ${JSON.stringify(savedJob)}\n\n`;
            controller.enqueue(encoder.encode(sseChunk));
            console.log(`Job streamed successfully: ${savedJob.id}`);
            
            // Add a tiny delay (e.g. 500ms) between sequential calls to further help with rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (err) {
            console.error(`Error processing job ${job.title}:`, err);
            await insforge.database.from("agent_logs").insert([{
              run_id: runId,
              user_id: user.id,
              message: `Error processing job "${job.title}": ${err instanceof Error ? err.message : String(err)}`,
              level: "error",
            }]);
          }
        }

        // Update run status
        await insforge.database
          .from("agent_runs")
          .update({
            status: "completed",
            jobs_found: savedJobsCount,
            completed_at: new Date().toISOString(),
          })
          .eq("id", runId);

        // Close stream
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        await posthog.shutdown();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Agent find error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
