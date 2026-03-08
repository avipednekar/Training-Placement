import { JobPost } from "../../models/company/job.js";
import mongoose from "mongoose";
import { getCompanyCount as getCompanyCountService } from "../../services/company.service.js";

export const getCompanyStats = async (req, res) => {
  try {
    const companyId = req.params.companyId || req.company?._id;

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
    const count = await getCompanyCountService();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching company count" });
  }
};
