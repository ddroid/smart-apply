import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ResumeDocument, ResumeData } from "@/components/pdf/ResumeDocument";

export const runtime = 'nodejs';

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const generationSchema = z.object({
  fullName: z.string(),
  contactInfo: z.string().describe("E.g. City, State | Phone | Email | LinkedIn"),
  professionalSummary: z.string().describe("A concise, highly professional summary paragraph emphasizing their strengths and experience."),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    dateRange: z.string(),
    bullets: z.array(z.string()).describe("3-5 highly polished, action-oriented bullet points highlighting achievements and impact."),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  })),
  skills: z.string().describe("A single comma-separated string of top skills grouped logically."),
});

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the current profile data
    const { data: profile } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    // 2. Format data for Groq
    const rawProfile = {
      fullName: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      linkedin: profile.linkedin_url,
      portfolio: profile.portfolio_url,
      title: profile.current_title,
      skills: profile.skills,
      experience: profile.work_experience,
      education: profile.education,
    };

    // 3. Extract polished data using Groq
    const { object } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: generationSchema,
      prompt: `You are an expert resume writer. Please take the following raw profile data and rewrite it into a highly polished, professional resume format.
      
      RAW PROFILE DATA:
      ${JSON.stringify(rawProfile, null, 2)}
      
      Instructions:
      - Clean up contact info into a single line string.
      - Write a strong professional summary if one is missing or weak, using their skills and experience.
      - Tighten and polish work experience descriptions into strong, action-verb bullet points.
      - Present skills cleanly.
      `,
      temperature: 0.3, 
    });

    // 4. Render to PDF
    const resumeData: ResumeData = object;
    const pdfBuffer = await renderToBuffer(React.createElement(ResumeDocument, { data: resumeData }) as any);

    // 5. Delete old file if exists
    if (profile.resume_pdf_url) {
      const urlParts = profile.resume_pdf_url.split('/resumes/objects/');
      if (urlParts.length >= 2) {
        const oldFilePath = decodeURIComponent(urlParts[1]);
        await insforge.storage.from("resumes").remove(oldFilePath as any);
      }
    }

    // 6. Upload to Storage
    const fileName = `generated-resume-${Date.now()}.pdf`;
    const filePath = `${user.id}/${fileName}`;
    
    const file = new File([pdfBuffer as any], fileName, { type: 'application/pdf' });

    const { error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload generated resume." }, { status: 500 });
    }

    // 6. Get public URL
    const publicUrlResult = insforge.storage
      .from("resumes")
      .getPublicUrl(filePath);
      
    // Handle different possible SDK return formats
    const resumeUrl = typeof publicUrlResult === 'string' 
      ? publicUrlResult 
      : (publicUrlResult as any)?.data?.publicUrl 
        || (publicUrlResult as any)?.publicURL 
        || (publicUrlResult as any)?.publicUrl;

    if (!resumeUrl) {
      throw new Error("Could not extract public URL from storage response");
    }

    // 7. Update profile
    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: resumeUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile with new resume." }, { status: 500 });
    }

    return NextResponse.json({ resume_pdf_url: resumeUrl });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate resume." }, { status: 500 });
  }
}
