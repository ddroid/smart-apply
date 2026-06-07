import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import pdf from "pdf-parse";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const extractionSchema = z.object({
  full_name: z.string().nullable().describe("The candidate's full name, or null if not found"),
  phone: z.string().nullable().describe("The candidate's phone number, or null if not found"),
  location: z.string().nullable().describe("The candidate's city and state/country, or null if not found"),
  linkedin_url: z.string().nullable().describe("URL to LinkedIn profile if found, starting with https://. Null if not found"),
  portfolio_url: z.string().nullable().describe("URL to portfolio or GitHub if found, starting with https://. Null if not found"),
  current_title: z.string().nullable().describe("Their most recent or current job title, or null if not found"),
  experience_level: z.enum(["junior", "mid", "senior", "lead"]).nullable().describe("Estimate this strictly based on their years of experience and job titles (e.g. 0-2=junior, 3-5=mid, 5-8=senior, 8+=lead)"),
  years_experience: z.number().nullable().describe("Strictly calculate total years of professional experience by adding up the durations of all their work experiences. Round to nearest whole number."),
  skills: z.array(z.string()).describe("List of technical and professional skills, empty array if none"),
  industries: z.array(z.string()).describe("Infer the industries they have worked in based on their past companies and projects (e.g., Software, AI, FinTech, Healthcare), empty array if none"),
  job_titles_seeking: z.array(z.string()).describe("Job titles they seem suited for or are seeking based on their experience, empty array if none"),
  work_experience: z.array(z.object({
    company: z.string(),
    title: z.string(),
    start_date: z.string(),
    end_date: z.string().nullable().describe("End date, or 'Present' if current"),
    description: z.string()
  })).describe("All work experience entries found in the resume. Must extract ALL jobs listed."),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field_of_study: z.string().nullable(),
    graduation_year: z.string().nullable()
  })).describe("Highest education degrees or all education entries found"),
});

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the current resume URL from the database
    const { data: profile } = await insforge.database
      .from("profiles")
      .select("resume_pdf_url")
      .eq("id", user.id)
      .single();

    if (!profile?.resume_pdf_url) {
      return NextResponse.json({ error: "No resume found in profile." }, { status: 404 });
    }

    // Extract the storage path from the URL (everything after /resumes/objects/)
    const urlParts = profile.resume_pdf_url.split('/resumes/objects/');
    if (urlParts.length < 2) {
      return NextResponse.json({ error: "Invalid resume URL format in profile." }, { status: 400 });
    }
    const filePath = decodeURIComponent(urlParts[1]);

    // Download the resume from storage securely using the authenticated SDK
    const { data: fileData, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return NextResponse.json({ error: "Could not find resume in storage." }, { status: 404 });
    }

    // 2. Parse PDF to text
    const buffer = Buffer.from(await fileData.arrayBuffer());
    let pdfText = "";
    try {
      const parsed = await pdf(buffer);
      pdfText = parsed.text;
    } catch (parseErr) {
      console.error("PDF parse error:", parseErr);
      return NextResponse.json({ error: "Could not extract text from this PDF. Please try a different file." }, { status: 400 });
    }

    if (!pdfText || pdfText.trim().length < 50) {
      return NextResponse.json({ error: "PDF appears to be empty or unreadable." }, { status: 400 });
    }

    // 3. Extract structured data using Groq
    const { object } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: extractionSchema,
      prompt: `Extract the following information from this resume text. Be as accurate as possible. If a field is not found, omit it rather than guessing. 
      
      RESUME TEXT:
      ${pdfText}`,
      temperature: 0.1, // Keep it deterministic
    });

    return NextResponse.json({ data: object });
  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: error.message || "Failed to process resume." }, { status: 500 });
  }
}
