import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import { JobPost } from "./models/company/job.js";
import { CompanyStats } from "./models/company/stats.js";
import { Student } from "./models/student/register.model.js";
import { Company } from "./models/company/register.js";
import { Profile } from "./models/student/profile.model.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("My webpage");
});

import comRouter from "./routes/company.route.js";
import studRouter from "./routes/student.route.js";

app.use("/api/company", comRouter);
app.use("/api/student", studRouter);

// app.post("/save-profile", async (req, res) => {
//   try {
//     const { email, ...updateData } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Find existing profile or create if doesn't exist
//     let profile = await Profile.findOne({ student: student._id });

//     if (!profile) {
//       profile = new Profile({
//         student: student._id,
//         ...updateData
//       });
//     } else {
//       // Update existing profile
//       profile = await Profile.findOneAndUpdate(
//         { student: student._id },
//         { $set: updateData },
//         { new: true, runValidators: true }
//       );
//     }

//     await profile.save();

//     res.json({
//       message: "Profile saved successfully",
//       profile
//     });
//   } catch (error) {
//     console.error("Error saving profile:", error);
//     res.status(500).json({
//       message: "Error saving profile",
//       error: error.message
//     });
//   }
// });

app.get("/profile/:email", async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const profile = await Profile.findOne({ student: student._id });

    if (!profile) {
      return res.status(200).json({ message: "Please make profile first" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/student-profile/:email", async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email }).select(
      "-password"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

app.get("/company-stats/:companyId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET);

    const companyId = req.params.companyId;

    const activeJobs = await JobPost.countDocuments({
      companyId,
      status: { $ne: "closed" },
    });
    const totalApplications = await JobPost.aggregate([
      { $match: { companyId } },
      { $group: { _id: null, total: { $sum: "$applications" } } },
    ]);
    const interviews = await JobPost.countDocuments({
      companyId,
      status: "interviewsScheduled",
    });

    res.json({
      activeJobs,
      applications: totalApplications[0]?.total || 0,
      interviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

app.get("/company-jobs/:companyId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET);

    const jobs = await JobPost.find({ companyId: req.params.companyId }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.post("/jobs", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const companyId = decoded.id;

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
});

app.delete("/jobs/:jobId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await JobPost.findByIdAndDelete(req.params.jobId);

    await CompanyStats.findOneAndUpdate(
      { companyId: decoded.id },
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
});

app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching job" });
  }
});

app.get("/public-jobs", async (req, res) => {
  try {
    const jobs = await JobPost.find({ status: { $ne: "closed" } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("companyId", "name");
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// Get total count of jobs
app.get("/job-count", async (req, res) => {
  try {
    const count = await JobPost.countDocuments({ status: { $ne: "closed" } });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job count" });
  }
});

// Get total count of companies
app.get("/company-count", async (req, res) => {
  try {
    const count = await Company.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching company count" });
  }
});

// Apply for a job
app.post("/apply-job", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

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
    const updatedJob = await JobPost.findByIdAndUpdate(
      jobId,
      { $inc: { applications: 1 } },
      { new: true }
    );

    // Here you would typically:
    // 1. Store the application in a separate collection
    // 2. Send notification to the company
    // 3. Send confirmation to the student

    res.json({
      message: "Application submitted successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error applying for job" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
