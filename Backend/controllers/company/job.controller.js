import {
  getCompanyJobsForId,
  createOrUpdateCompanyJob,
  deleteCompanyJob,
  findJobById,
  findPublicJobById,
  getPublicJobsList,
  getActiveJobCount,
  applyForJob as applyForJobService,
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
