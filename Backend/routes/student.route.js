import { Router } from "express";
import { studLogin, studProfile, studRegister } from "../controllers/student/student.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const studRouter = Router();

studRouter.route('/login').post(studLogin)
studRouter.route('/register').post(studRegister)
studRouter.route('/profile').post(verifyJWT,studProfile)

export default studRouter