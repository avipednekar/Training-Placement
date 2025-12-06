import { CompanyStats } from "../../models/company/stats.js";
import { JobPost } from "../../models/company/job.js";
import { Company } from "../../models/company/register.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const getCompanyStats = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const companyId = req.params.companyId;

    const activeJobs = await JobPost.countDocuments({
      companyId,
      status: { $ne: "closed" },
    });
    const totalApplications = await JobPost.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
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
};

export const getCompanyCount = async (req, res) => {
  try {
    const count = await Company.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching company count" });
  }
};
