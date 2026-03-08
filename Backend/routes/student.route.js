import { Router } from "express";
import {
  studLogin,
  studProfile,
  studRegister,
  getProfileByEmail,
  getStudentByEmail,
  saveProfile,
} from "../controllers/student/student.controller.js";
import { requireStudent } from "../middlewares/auth.middleware.js";

const studRouter = Router();

// Authentication
studRouter.route("/login").post(studLogin);
studRouter.route("/register").post(studRegister);

// Authenticated student self-service endpoints
studRouter.route("/me").get(requireStudent, getStudentByEmail);
studRouter.route("/me/profile").get(requireStudent, getProfileByEmail);
studRouter.route("/profile").post(requireStudent, studProfile);
studRouter.route("/save-profile").post(requireStudent, saveProfile);

// Legacy email-based endpoints (kept for backward compatibility)
studRouter.route("/profile/:email").get(getProfileByEmail);
studRouter.route("/details/:email").get(getStudentByEmail);
studRouter.route("/info/:email").get(getStudentByEmail);

export default studRouter;

