import { Router } from "express";
import {
  applyJob,
  createOrUpdateJob,
  deleteJob,
  getCompanyJobs,
  getJobById,
  getJobCount,
  getPublicJobs,
  getMyJobs,
  getPublicJobById,
  getEligibleStudentsForJob,
} from "../controllers/company/job.controller.js";
import {
  requireCompany,
  requireStudent,
} from "../middlewares/auth.middleware.js";

const jobRouter = Router();

// Public job endpoints
jobRouter.route("/count").get(getJobCount);
jobRouter.route("/public").get(getPublicJobs);
jobRouter.route("/public/:id").get(getPublicJobById);
jobRouter.route("/:id").get(getJobById);

// Student-protected endpoint
jobRouter.route("/apply").post(requireStudent, applyJob);

// Company-protected endpoints
jobRouter.route("/my-jobs").get(requireCompany, getMyJobs);
jobRouter
  .route("/:jobId/eligible-students")
  .get(requireCompany, getEligibleStudentsForJob);
jobRouter
  .route("/company/:companyId")
  .get(requireCompany, getCompanyJobs); // Corresponds to /company-jobs/:companyId
jobRouter.route("/").post(requireCompany, createOrUpdateJob);
jobRouter.route("/:jobId").delete(requireCompany, deleteJob);

export default jobRouter;
