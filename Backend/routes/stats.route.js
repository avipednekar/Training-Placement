import { Router } from "express";
import {
  getCompanyCount,
  getCompanyStats,
} from "../controllers/company/stats.controller.js";

const statsRouter = Router();

statsRouter.route("/company-count").get(getCompanyCount);
statsRouter.route("/:companyId").get(getCompanyStats);

export default statsRouter;
