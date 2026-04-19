import { getCompanyLogo } from "./companyBranding";

/**
 * Formats raw job data from backend snake_case to frontend camelCase
 * Handles null/undefined values and provides defaults
 * @param {Object} job - Raw job object from API
 * @returns {Object} Formatted job object for UI components
 */
export const formatJobData = (job) => {
  if (!job) return null;

  return {
    _id: job._id,
    id: job._id,
    title: job.job_title || job.title || "Untitled Position",
    companyName: job.companyId?.name || job.companyName || "Company Confidential",
    companyLogo: getCompanyLogo(
      job.companyId?.name || job.companyName,
      job.companyId?.logoUrl || job.companyLogo || null
    ),
    location: job.job_location || job.location || "Remote",
    type: job.job_type || job.jobType || "Full Time",
    salary: job.salary || "Not Disclosed",
    description:
      job.job_des ??
      job.description ??
      "No description available.",
    postedAt: job.createdAt || new Date().toISOString(),
    experience: job.experience || "Fresher", // Assuming field might exist
    skills: job.skills || [],
    // Add visual tag color logic helper if needed separately, or handle in component
  };
};
