import { Router } from "express";
import {
  getCompanyCount,
  getCompanyStats,
} from "../controllers/company/stats.controller.js";
import { requireCompany } from "../middlewares/auth.middleware.js";

const statsRouter = Router();

// Platform-level stats
statsRouter.route("/company-count").get(getCompanyCount);

// Company-specific stats (protected)
statsRouter.route("/:companyId").get(requireCompany, getCompanyStats);

export default statsRouter;
