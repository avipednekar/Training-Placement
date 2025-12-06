import mongoose from "mongoose";

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
    job_location: {
      type: String,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const JobPost = mongoose.model("JobPost", jobSchema);
