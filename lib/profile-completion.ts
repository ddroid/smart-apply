type WorkExperienceEntry = {
  company?: string | null;
  title?: string | null;
};

type EducationEntry = {
  institution?: string | null;
  degree?: string | null;
};

export type ProfileCompletionInput = {
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  current_title?: string | null;
  experience_level?: string | null;
  years_experience?: number | null;
  skills?: string[] | null;
  work_experience?: WorkExperienceEntry[] | null;
  education?: EducationEntry[] | null;
  job_titles_seeking?: string[] | null;
  remote_preference?: string | null;
  work_authorization?: string | null;
};

export type ProfileCompletionResult = {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
};

function isFilled(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyArray(values: string[] | null | undefined): boolean {
  return Array.isArray(values) && values.some((value) => value.trim().length > 0);
}

function hasValidWorkExperience(
  experiences: WorkExperienceEntry[] | null | undefined
): boolean {
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return false;
  }

  return experiences.some(
    (experience) =>
      isFilled(experience.company) && isFilled(experience.title)
  );
}

function hasValidEducation(education: EducationEntry[] | null | undefined): boolean {
  if (!Array.isArray(education) || education.length === 0) {
    return false;
  }

  return education.some(
    (entry) => isFilled(entry.institution) && isFilled(entry.degree)
  );
}

const REQUIRED_FIELD_CHECKS: Array<{
  label: string;
  isComplete: (data: ProfileCompletionInput) => boolean;
}> = [
  { label: "Full Name", isComplete: (data) => isFilled(data.full_name) },
  { label: "Phone", isComplete: (data) => isFilled(data.phone) },
  { label: "Location", isComplete: (data) => isFilled(data.location) },
  { label: "Current Title", isComplete: (data) => isFilled(data.current_title) },
  {
    label: "Experience Level",
    isComplete: (data) => isFilled(data.experience_level),
  },
  {
    label: "Years of Experience",
    isComplete: (data) =>
      typeof data.years_experience === "number" && data.years_experience >= 0,
  },
  { label: "Skills", isComplete: (data) => hasNonEmptyArray(data.skills) },
  {
    label: "Work Experience",
    isComplete: (data) => hasValidWorkExperience(data.work_experience),
  },
  { label: "Education", isComplete: (data) => hasValidEducation(data.education) },
  {
    label: "Job Titles Seeking",
    isComplete: (data) => hasNonEmptyArray(data.job_titles_seeking),
  },
  {
    label: "Remote Preference",
    isComplete: (data) => isFilled(data.remote_preference),
  },
  {
    label: "Work Authorization",
    isComplete: (data) => isFilled(data.work_authorization),
  },
];

export function computeProfileCompletion(
  data: ProfileCompletionInput
): ProfileCompletionResult {
  const missingFields = REQUIRED_FIELD_CHECKS.filter(
    (field) => !field.isComplete(data)
  ).map((field) => field.label);

  const completedCount = REQUIRED_FIELD_CHECKS.length - missingFields.length;
  const percentage = Math.round(
    (completedCount / REQUIRED_FIELD_CHECKS.length) * 100
  );

  return {
    percentage,
    missingFields,
    isComplete: missingFields.length === 0,
  };
}
