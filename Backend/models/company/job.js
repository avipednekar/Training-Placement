import mongoose from "mongoose";

const eligibilitySchema = new mongoose.Schema(
  {
    minCgpa: {
      type: Number,
      default: 7,
    },
    maxBacklogs: {
      type: Number,
      default: 0,
    },
    branches: {
      type: [String],
      default: [],
    },
    graduationYears: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job_title: {
      type: String,
    },
    job_type: {
      type: String,
    },
    vacancy: {
      type: Number,
    },
    salary: {
      type: String,
    },
    job_des: {
      type: String,
    },
    skills: {
      type: Array,
    },
    criteria: {
      type: String,
    },
    eligibility: {
      type: eligibilitySchema,
      default: () => ({}),
    },
    job_location: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Closed", "Expired"],
    },
    applications: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const JobPost = mongoose.model("JobPost", jobSchema);
