import { JobPost } from "../models/company/job.js";
import { CompanyStats } from "../models/company/stats.js";
import { Student } from "../models/student/register.model.js";

export const getCompanyJobsForId = async (companyId) => {
  return JobPost.find({ companyId }).sort({ createdAt: -1 });
};

export const createOrUpdateCompanyJob = async (companyId, payload) => {
  const {
    _id,
    job_title,
    job_type,
    vacancy,
    salary,
    job_des,
    skills,
    criteria,
    job_location,
    deadline,
  } = payload;

  const jobData = {
    job_title,
    job_type,
    vacancy,
    salary,
    job_des,
    skills,
    criteria,
    job_location,
    deadline,
    companyId,
    updatedAt: new Date(),
  };

  if (_id) {
    const updatedJob = await JobPost.findOneAndUpdate(
      { _id, companyId },
      { $set: jobData },
      { new: true }
    );
    return { job: updatedJob, isUpdate: true };
  }

  const newJob = new JobPost({
    ...jobData,
    createdAt: new Date(),
    applications: 0,
  });

  await newJob.save();

  await CompanyStats.findOneAndUpdate(
    { companyId },
    {
      $inc: { totalJobsPosted: 1, activeJobs: 1 },
      $set: { lastUpdated: new Date() },
    },
    { upsert: true, new: true }
  );

  return { job: newJob, isUpdate: false };
};

export const deleteCompanyJob = async (companyId, jobId) => {
  await JobPost.findByIdAndDelete(jobId);

  await CompanyStats.findOneAndUpdate(
    { companyId },
    {
      $inc: { activeJobs: -1 },
      $set: { lastUpdated: new Date() },
    }
  );
};

export const findJobById = async (jobId) => {
  return JobPost.findById(jobId);
};

export const findPublicJobById = async (jobId) => {
  return JobPost.findById(jobId).populate("companyId", "name").lean();
};

export const getPublicJobsList = async (limit = 0) => {
  let query = JobPost.find({ status: { $ne: "closed" } })
    .sort({ createdAt: -1 })
    .populate("companyId", "name");

  if (limit > 0) {
    query = query.limit(limit);
  }

  return query;
};

export const getActiveJobCount = async () => {
  return JobPost.countDocuments({ status: { $ne: "closed" } });
};

export const applyForJob = async (studentId, jobId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const job = await JobPost.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedJob = await JobPost.findOneAndUpdate(
    { _id: jobId },
    { $inc: { applications: 1 } },
    { new: true }
  );

  return updatedJob;
};

