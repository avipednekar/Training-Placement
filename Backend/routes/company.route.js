import { Router } from "express";
import { comLogin, comRegister } from "../controllers/company/company.controller.js";

const comRouter = Router()

comRouter.route("/register").post(comRegister)
comRouter.route('/login').post(comLogin)

export default comRouter