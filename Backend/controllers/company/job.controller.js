import { JobPost } from "../../models/company/job.js";
import { CompanyStats } from "../../models/company/stats.js";
import { Student } from "../../models/student/register.model.js";
import jwt from "jsonwebtoken";

export const getCompanyJobs = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const jobs = await JobPost.find({ companyId: req.params.companyId }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const companyId = decoded._id;

    const jobs = await JobPost.find({ companyId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching company jobs" });
  }
};

export const createOrUpdateJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const companyId = decoded._id;

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
    } = req.body;

    const jobData = {
      job_title: job_title,
      job_type: job_type,
      vacancy: vacancy,
      salary: salary,
      job_des: job_des,
      skills: skills,
      criteria: criteria,
      job_location: job_location,
      deadline: deadline,
      companyId,
      updatedAt: new Date(),
    };

    if (_id) {
      const updatedJob = await JobPost.findOneAndUpdate(
        { _id, companyId },
        { $set: jobData },
        { new: true }
      );
      if (!updatedJob)
        return res.status(404).json({ message: "Job not found" });

      res.json({ message: "Job updated successfully", job: updatedJob });
    } else {
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

      res
        .status(201)
        .json({ message: "Job created successfully", job: newJob });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    await JobPost.findByIdAndDelete(req.params.jobId);

    await CompanyStats.findOneAndUpdate(
      { companyId: decoded._id },
      {
        $inc: { activeJobs: -1 },
        $set: { lastUpdated: new Date() },
      }
    );

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
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
    let query = JobPost.find({ status: { $ne: "closed" } })
      .sort({ createdAt: -1 })
      .populate("companyId", "name");

    if (limit > 0) {
      query = query.limit(limit);
    }

    const jobs = await query;
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const getJobCount = async (req, res) => {
  try {
    const count = await JobPost.countDocuments({ status: { $ne: "closed" } });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job count" });
  }
};

export const applyJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const studentId = decoded._id;

    const { jobId } = req.body;

    // Get student profile
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get job details
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job applications count
    const updatedJob = await JobPost.findOneAndUpdate(
      { _id: jobId },
      { $inc: { applications: 1 } },
      { new: true }
    );

    res.json({
      message: "Application submitted successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error applying for job" });
  }
};
