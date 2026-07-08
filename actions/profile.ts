"use server";

import { z } from "zod";
import { createInsforgeServer } from "@/lib/insforge-server";
import { computeProfileCompletion } from "@/lib/profile-completion";
import { createPostHogServer } from "@/lib/posthog-server";
import { revalidatePath } from "next/cache";

// Match the database schema constraints
const profileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  work_authorization: z.enum(["citizen", "permanent_resident", "visa_required"]).optional().or(z.literal("")),
  
  current_title: z.string().optional(),
  experience_level: z.enum(["junior", "mid", "senior", "lead"]).optional().or(z.literal("")),
  years_experience: z.number().int().min(0).optional(),
  skills: z.array(z.string()).default([]),
  industries: z.array(z.string()).default([]),
  
  // Basic arrays for complex types for now, full JSONB validation later if needed
  work_experience: z.array(z.any()).default([]),
  education: z.array(z.any()).default([]),
  
  job_titles_seeking: z.array(z.string()).default([]),
  remote_preference: z.enum(["remote", "onsite", "hybrid", "any"]).optional().or(z.literal("")),
  salary_expectation: z.string().optional(),
  preferred_locations: z.array(z.string()).default([]),
});

export type ProfilePayload = z.infer<typeof profileSchema>;

export async function saveProfileInfo(data: ProfilePayload) {
  try {
    const insforge = await createInsforgeServer();
    
    const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();
    
    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please log in again." };
    }

    // Clean up empty strings for enum fields to avoid constraint errors
    const cleanedData = { ...data };
    
    if (cleanedData.work_authorization === "") {
        delete cleanedData.work_authorization;
    }
    if (cleanedData.experience_level === "") {
        delete cleanedData.experience_level;
    }
    if (cleanedData.remote_preference === "") {
        delete cleanedData.remote_preference;
    }

    const validatedData = profileSchema.parse(cleanedData);

    const { data: existingProfile } = await insforge.database
      .from("profiles")
      .select("is_complete")
      .eq("id", user.id)
      .single();

    const completion = computeProfileCompletion(validatedData);
    const wasComplete = existingProfile?.is_complete ?? false;

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({
        ...validatedData,
        is_complete: completion.isComplete,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return { success: false, error: "Failed to update profile. Please try again." };
    }

    if (completion.isComplete && !wasComplete) {
      const posthog = createPostHogServer();
      posthog.capture({
        distinctId: user.id,
        event: "profile_completed",
        properties: { userId: user.id },
      });
      await posthog.shutdown();
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data provided." };
    }
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function saveResumeUrl(url: string) {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();
    
    if (authError || !user) {
      return { success: false, error: "Unauthorized." };
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: url })
      .eq("id", user.id);

    if (updateError) {
      console.error("Resume URL update error:", updateError);
      return { success: false, error: "Failed to update resume URL." };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
