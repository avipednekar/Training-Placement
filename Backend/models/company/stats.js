import mongoose from "mongoose";

const companyStatsSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  totalJobsPosted: {
    type: Number,
    default: 0
  },
  totalApplications: {
    type: Number,
    default: 0
  },
  activeJobs: {
    type: Number,
    default: 0
  },
  interviewsScheduled: {
    type: Number,
    default: 0
  },
  hiresMade: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const CompanyStats = mongoose.model("CompanyStats", companyStatsSchema);
