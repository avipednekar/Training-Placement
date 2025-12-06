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
} from "../controllers/company/job.controller.js";

const jobRouter = Router();

jobRouter.route("/count").get(getJobCount);
jobRouter.route("/public").get(getPublicJobs);
jobRouter.route("/apply").post(applyJob);
jobRouter.route("/my-jobs").get(getMyJobs);
jobRouter.route("/company/:companyId").get(getCompanyJobs); // Corresponds to /company-jobs/:companyId
jobRouter.route("/:id").get(getJobById);
jobRouter.route("/").post(createOrUpdateJob);
jobRouter.route("/:jobId").delete(deleteJob);

export default jobRouter;
