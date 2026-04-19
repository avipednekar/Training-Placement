import mongoose from "mongoose";
import {
  getCompanyJobsForId,
  createOrUpdateCompanyJob,
  deleteCompanyJob,
  findJobById,
  findPublicJobById,
  getPublicJobsList,
  getActiveJobCount,
  applyForJob as applyForJobService,
  getEligibleStudentsForJob as getEligibleStudentsForJobService,
  getEligibleJobsForStudent as getEligibleJobsForStudentService,
} from "../../services/job.service.js";

export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.params.companyId || req.company?._id;
    const jobs = await getCompanyJobsForId(companyId);

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const companyId = req.company?._id;
    const jobs = await getCompanyJobsForId(companyId);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching company jobs" });
  }
};

export const createOrUpdateJob = async (req, res) => {
  try {
    const companyId = req.company?._id;
    const { job, isUpdate } = await createOrUpdateCompanyJob(
      companyId,
      req.body
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (isUpdate) {
      return res.json({ message: "Job updated successfully", job });
    }

    return res
      .status(201)
      .json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const companyId = req.company?._id;
    await deleteCompanyJob(companyId, req.params.jobId);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job" });
  }
};

export const getJobById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching job" });
  }
};

export const getPublicJobById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await findPublicJobById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching job" });
  }
};

export const getPublicJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit in Mongoose
    const jobs = await getPublicJobsList(limit);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const getJobCount = async (req, res) => {
  try {
    const count = await getActiveJobCount();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job count" });
  }
};

export const applyJob = async (req, res) => {
  try {
    const studentId = req.student?._id;
    const { jobId } = req.body;
    const updatedJob = await applyForJobService(studentId, jobId);

    res.json({
      message: "Application submitted successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error applying for job" });
  }
};

export const getEligibleStudentsForJob = async (req, res) => {
  try {
    const companyId = req.company?._id;
    const { jobId } = req.params;

    if (!jobId || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const shortlist = await getEligibleStudentsForJobService(
      companyId,
      jobId
    );

    res.json(shortlist);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Error fetching eligible students",
    });
  }
};

export const getEligibleJobsForStudent = async (req, res) => {
  try {
    const studentId = req.student?._id;
    const result = await getEligibleJobsForStudentService(studentId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Error fetching eligible jobs",
    });
  }
};
