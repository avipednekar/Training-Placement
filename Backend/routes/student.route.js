import { Router } from "express";
import {
  studLogin,
  studProfile,
  studRegister,
  getProfileByEmail,
  getStudentByEmail,
  saveProfile, // This corresponds to POST /save-profile
} from "../controllers/student/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const studRouter = Router();

studRouter.route("/login").post(studLogin);
studRouter.route("/register").post(studRegister);
studRouter.route("/profile").post(verifyJWT, studProfile);

// New Routes moved from server.js //
// Note: Frontend uses /profile/:email so we can map it here.
// But wait, the frontend might be calling /api/student/profile/:email or /profile/:email directly?
// The task "Rearrange backend... in professional way" implies we should group them under /api/student.
// However, I need to check if frontend calls these via /api/student prefix or root prefix.
// The frontend previously used http://localhost:3000/profile/${user.email} (root path).
// Ideally, we move them to /api/student and I updated frontend in previous step to use what?
// Let's check previous frontend updates.
// I updated student.js: `http://localhost:3000/student-profile/${user.email}` (still root path in my thought, but waait, I should have put /api/student...)
// Actually, looking at my previous step 186 execution:
// I updated `student.js` to `http://localhost:3000/student-profile/${user.email}`.
// I did NOT update `server.js` routes for `student-profile` yet.
// Since the user wants "Professional way", these should be under `/api/student`.
// So routes should be:
// GET /api/student/profile/:email
// GET /api/student/details/:email (renaming student-profile to details or info might be better but let's stick to student-profile for now or alias)
// The frontend calls:
// 1. `http://localhost:3000/student-profile/${user.email}`
// 2. `http://localhost:3000/profile/${user.email}`
// 3. `http://localhost:3000/save-profile` (POST)
//
// If I move them to `studRouter`, they will become:
// `/api/student/student-profile/:email`
// `/api/student/profile/:email`
// `/api/student/save-profile`
//
// This breaks the frontend unless I:
// A) Update frontend AGAIN to point to `/api/student/...` (Preferred for "Professional")
// B) Mount these specific routes at root in `server.js` (Not professional).
//
// I will move them to `studRouter` AND I will need to add a task to update frontend paths again or just do it.
// The user asked to "Rearrange the backend...". I should probably do the backend correctly first.
// If I change the URL structure, I must update frontend.
//
// Let's define them here in studRouter:

studRouter.route("/profile/:email").get(getProfileByEmail);
studRouter.route("/details/:email").get(getStudentByEmail); // Mapping /student-profile to /details for cleaner API? Or keep names?
// Let's keep names aligned with frontend logic if possible, or mapping cleanly.
// /student-profile/:email -> /api/student/info/:email ?
// Let's use /info/:email for student-profile logic.
// /profile/:email -> /api/student/profile/:email
// /save-profile -> /api/student/save-profile

studRouter.route("/info/:email").get(getStudentByEmail);
studRouter.route("/save-profile").post(saveProfile);

export default studRouter;
