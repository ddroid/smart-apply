"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { saveProfileInfo } from "@/actions/profile";

interface WorkExperience {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  graduation_year: string | null;
}

export function ProfileInformationForm({ initialData }: { initialData?: any }) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills?.length ? initialData.skills : []);
  const [newSkill, setNewSkill] = useState("");

  const [industries, setIndustries] = useState<string[]>(initialData?.industries || []);
  const [newIndustry, setNewIndustry] = useState("");

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    (initialData?.work_experience || []).map((exp: any) => ({ ...exp, id: crypto.randomUUID() }))
  );
  const [educations, setEducations] = useState<Education[]>(
    (initialData?.education || []).map((edu: any) => ({ ...edu, id: crypto.randomUUID() }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | null; text: string }>({ type: null, text: "" });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addIndustry = () => {
    if (newIndustry.trim() && !industries.includes(newIndustry.trim())) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (industryToRemove: string) => {
    setIndustries(industries.filter((ind) => ind !== industryToRemove));
  };

  const mapEnum = (val: string, options: string[], defaultOpt = "") => {
    return options.includes(val) ? val : defaultOpt;
  };

  const updateWorkExperience = (index: number, field: string, value: string | boolean) => {
    const updated = [...workExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperiences(updated);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ type: null, text: "" });

    const form = e.currentTarget;
    
    // Convert comma-separated string to array
    const jobTitlesVal = (form.elements.namedItem("job_titles_seeking") as HTMLInputElement)?.value;
    const jobTitlesArr = jobTitlesVal ? jobTitlesVal.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const prefLocationsVal = (form.elements.namedItem("preferred_locations") as HTMLInputElement)?.value;
    const prefLocationsArr = prefLocationsVal ? prefLocationsVal.split(",").map(t => t.trim()).filter(Boolean) : [];

    // Map UI dropdowns to schema enums
    const workAuthMap: Record<string, string> = {
        "Citizen": "citizen",
        "Permanent Resident": "permanent_resident",
        "Visa": "visa_required",
        "Requires Sponsorship": "visa_required"
    };

    const expMap: Record<string, string> = {
        "Junior": "junior",
        "Mid-Level": "mid",
        "Senior": "senior",
        "Lead": "lead",
        "Principal": "lead"
    };
    
    const remoteMap: Record<string, string> = {
        "Any": "any",
        "Remote Only": "remote",
        "Hybrid": "hybrid",
        "On-site Only": "onsite"
    };

    const expLevelVal = (form.elements.namedItem("experience_level") as HTMLSelectElement)?.value || "";
    const workAuthVal = (form.elements.namedItem("work_authorization") as HTMLSelectElement)?.value || "";
    const remotePrefVal = (form.elements.namedItem("remote_preference") as HTMLSelectElement)?.value || "";
    
    const payload = {
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement)?.value || "",
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value || "",
      location: (form.elements.namedItem("location") as HTMLInputElement)?.value || "",
      linkedin_url: (form.elements.namedItem("linkedin_url") as HTMLInputElement)?.value || "",
      portfolio_url: (form.elements.namedItem("portfolio_url") as HTMLInputElement)?.value || "",
      work_authorization: mapEnum(workAuthMap[workAuthVal], ["citizen", "permanent_resident", "visa_required"]) as "" | "citizen" | "permanent_resident" | "visa_required",
      
      current_title: (form.elements.namedItem("current_title") as HTMLInputElement)?.value || "",
      experience_level: mapEnum(expMap[expLevelVal], ["junior", "mid", "senior", "lead"]) as "" | "junior" | "mid" | "senior" | "lead",
      years_experience: parseInt((form.elements.namedItem("years_experience") as HTMLInputElement)?.value || "0", 10),
      skills: skills,
      industries: industries,
      
      // Strip out the client-only 'id' field before saving
      work_experience: workExperiences.map(({ id, ...rest }) => rest),
      education: educations.map(({ id, ...rest }) => rest),
      
      job_titles_seeking: jobTitlesArr,
      remote_preference: mapEnum(remoteMap[remotePrefVal], ["remote", "onsite", "hybrid", "any"]) as "" | "remote" | "onsite" | "hybrid" | "any",
      salary_expectation: (form.elements.namedItem("salary_expectation") as HTMLInputElement)?.value || "",
      preferred_locations: prefLocationsArr,
    };

    const response = await saveProfileInfo(payload);
    
    if (response.success) {
      setStatusMessage({ type: "success", text: "Profile saved successfully!" });
    } else {
      setStatusMessage({ type: "error", text: response.error || "Failed to save profile." });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full max-w-3xl mx-auto mb-12">
      <div className="mb-8 border-b border-border-light pb-4">
        <h2 className="text-xl font-bold text-text-primary mb-1">Profile Information</h2>
        <p className="text-sm text-text-secondary">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      {statusMessage.type && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center ${
          statusMessage.type === "success" 
            ? "bg-green-500/10 text-green-500 border border-green-500/20" 
            : "bg-error/10 text-error border border-error/20"
        }`}>
          {statusMessage.text}
        </div>
      )}

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Personal Info */}
        <div>
          <h3 className="text-base font-bold text-text-primary mb-4">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="full_name" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
              <input id="full_name" name="full_name" type="text" defaultValue={initialData?.full_name || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email</label>
              <input id="email" name="email" type="email" defaultValue={initialData?.email || ""} disabled className="bg-surface-secondary border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary cursor-not-allowed opacity-70 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Phone Number</label>
              <input id="phone" name="phone" type="tel" defaultValue={initialData?.phone || ""} placeholder="+1 (555) 000-0000" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Location</label>
              <input id="location" name="location" type="text" defaultValue={initialData?.location || ""} placeholder="City, Country" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="linkedin_url" className="text-xs font-bold text-text-secondary uppercase tracking-wider">LinkedIn URL</label>
              <input id="linkedin_url" name="linkedin_url" type="url" defaultValue={initialData?.linkedin_url || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="portfolio_url" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Portfolio / GitHub</label>
              <input id="portfolio_url" name="portfolio_url" type="url" defaultValue={initialData?.portfolio_url || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="work_authorization" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Work Authorization</label>
              <select id="work_authorization" name="work_authorization" defaultValue={initialData?.work_authorization || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none">
                <option value="">Select Option</option>
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Requires Sponsorship/Visa</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-border-light" />

        {/* Professional Info */}
        <div>
          <h3 className="text-base font-bold text-text-primary mb-4">Professional Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="current_title" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current/Recent Job Title</label>
              <input id="current_title" name="current_title" type="text" defaultValue={initialData?.current_title || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="experience_level" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Experience Level</label>
              <select id="experience_level" name="experience_level" defaultValue={initialData?.experience_level || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none">
                <option value="">Select Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead/Principal</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="years_experience" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Years of Experience</label>
              <input id="years_experience" name="years_experience" type="number" defaultValue={initialData?.years_experience || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 block">Skills</label>
            <div className="flex items-center gap-2 mb-3">
              <input 
                type="text" 
                placeholder="Add a skill" 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 flex-1" 
              />
              <button 
                type="button"
                onClick={addSkill}
                className="bg-surface-secondary text-text-primary border border-border rounded-xl px-4 py-2 text-sm font-medium hover:bg-border-light transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 bg-surface-secondary border border-border-light text-text-primary px-3 py-1 rounded-full text-xs font-medium">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-text-muted hover:text-error transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 block">Industries Worked In (Optional)</label>
            <div className="flex items-center gap-2 mb-3">
              <input 
                type="text" 
                placeholder="E.g. FinTech, Healthcare" 
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                className="bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 flex-1" 
              />
              <button 
                type="button"
                onClick={addIndustry}
                className="bg-surface-secondary text-text-primary border border-border rounded-xl px-4 py-2 text-sm font-medium hover:bg-border-light transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <span key={industry} className="flex items-center gap-1 bg-surface-secondary border border-border-light text-text-primary px-3 py-1 rounded-full text-xs font-medium">
                  {industry}
                  <button type="button" onClick={() => removeIndustry(industry)} className="text-text-muted hover:text-error transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-border-light" />

        {/* Work Experience */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary">Work Experience</h3>
            <button 
              type="button" 
              onClick={() => setWorkExperiences([{ id: crypto.randomUUID(), company: "", title: "", start_date: "", end_date: "", description: "" }, ...workExperiences])}
              className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Add role
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {workExperiences.map((exp, index) => (
              <div key={exp.id} className="border border-border-light rounded-xl p-5 bg-surface-secondary/20 relative">
                <button type="button" onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-text-muted hover:text-error transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Company Name</label>
                    <input type="text" value={exp.company || ""} onChange={(e) => updateWorkExperience(index, "company", e.target.value)} placeholder="E.g. Vercel" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Job Title</label>
                    <input type="text" value={exp.title || ""} onChange={(e) => updateWorkExperience(index, "title", e.target.value)} placeholder="E.g. Frontend Engineer" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Start Date</label>
                    <input type="text" value={exp.start_date || ""} onChange={(e) => updateWorkExperience(index, "start_date", e.target.value)} placeholder="E.g. Jan 2022" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">End Date</label>
                    </div>
                    <input type="text" value={exp.end_date || ""} onChange={(e) => updateWorkExperience(index, "end_date", e.target.value)} placeholder="E.g. Present" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Key Responsibilities</label>
                  <textarea 
                    rows={3} 
                    value={exp.description || ""}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                    placeholder="E.g. Built Next.js features and optimized web vitals."
                    className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y" 
                  />
                </div>
              </div>
            ))}
            {workExperiences.length === 0 && (
              <p className="text-sm text-text-muted italic text-center py-4">No work experience added yet.</p>
            )}
          </div>
        </div>

        <hr className="border-border-light" />

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary">Education</h3>
            <button 
              type="button" 
              onClick={() => setEducations([{ id: crypto.randomUUID(), institution: "", degree: "", field_of_study: "", graduation_year: "" }, ...educations])}
              className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Add education
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {educations.map((edu, index) => (
              <div key={edu.id} className="border border-border-light rounded-xl p-5 bg-surface-secondary/20 relative">
                <button type="button" onClick={() => setEducations(educations.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-text-muted hover:text-error transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Highest Degree</label>
                    <input type="text" value={edu.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} placeholder="E.g. Bachelor's Degree" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Field of Study</label>
                    <input type="text" value={edu.field_of_study || ""} onChange={(e) => updateEducation(index, "field_of_study", e.target.value)} placeholder="E.g. Computer Science" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Institution Name</label>
                    <input type="text" value={edu.institution || ""} onChange={(e) => updateEducation(index, "institution", e.target.value)} placeholder="E.g. State University" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Graduation Year</label>
                    <input type="text" value={edu.graduation_year || ""} onChange={(e) => updateEducation(index, "graduation_year", e.target.value)} placeholder="YYYY" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
                  </div>
                </div>
              </div>
            ))}
            {educations.length === 0 && (
              <p className="text-sm text-text-muted italic text-center py-4">No education added yet.</p>
            )}
          </div>
        </div>

        <hr className="border-border-light" />

        {/* Job Preferences */}
        <div>
          <h3 className="text-base font-bold text-text-primary mb-4">Job Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="job_titles_seeking" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Job Titles Seeking</label>
              <input id="job_titles_seeking" name="job_titles_seeking" type="text" defaultValue={initialData?.job_titles_seeking?.join(", ") || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="remote_preference" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Remote Preference</label>
              <select id="remote_preference" name="remote_preference" defaultValue={initialData?.remote_preference || ""} className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none">
                <option value="">Any</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site Only</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="salary_expectation" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Salary Expectation (Optional)</label>
              <input id="salary_expectation" name="salary_expectation" type="text" defaultValue={initialData?.salary_expectation || ""} placeholder="E.g. $120k+" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="preferred_locations" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Preferred Locations (Optional)</label>
              <input id="preferred_locations" name="preferred_locations" type="text" defaultValue={initialData?.preferred_locations?.join(", ") || ""} placeholder="E.g. New York, London" className="bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className={`w-full bg-accent text-accent-foreground rounded-xl px-6 py-3.5 font-bold text-base transition-colors ${
              isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-accent-dark"
            }`}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
