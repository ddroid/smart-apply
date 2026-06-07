"use client";

import { useState } from "react";
import { ResumeSection } from "./ResumeSection";
import { ProfileInformationForm } from "./ProfileInformationForm";

export function ProfileClient({ initialProfile }: { initialProfile: any }) {
  const [profileData, setProfileData] = useState(initialProfile);
  // Using formKey to force remount when new extraction data arrives
  const [formKey, setFormKey] = useState(0);

  const handleExtractionSuccess = (extractedData: any) => {
    // Merge extracted data with existing profile data
    setProfileData({ ...profileData, ...extractedData });
    // Force form remount to pick up new defaultValues
    setFormKey((prev) => prev + 1);
  };

  const handleResumeUploaded = (url: string) => {
    setProfileData({ ...profileData, resume_pdf_url: url });
  };

  return (
    <>
      <ResumeSection 
        hasResume={!!profileData.resume_pdf_url} 
        resumeUrl={profileData.resume_pdf_url}
        onUploadSuccess={handleResumeUploaded}
        onExtractSuccess={handleExtractionSuccess}
      />
      <ProfileInformationForm key={formKey} initialData={profileData} />
    </>
  );
}
