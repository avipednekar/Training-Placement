import { Router } from "express";
import {
  adminLogin,
  getEligibilityOverview,
} from "../controllers/admin/admin.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.route("/login").post(adminLogin);
adminRouter.route("/eligibility-overview").get(requireAdmin, getEligibilityOverview);

export default adminRouter;
