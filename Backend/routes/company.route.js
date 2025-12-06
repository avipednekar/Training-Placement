import { Router } from "express";
import {
  comLogin,
  comRegister,
  getAllCompanies,
} from "../controllers/company/company.controller.js";

const comRouter = Router();

comRouter.route("/register").post(comRegister);
comRouter.route("/login").post(comLogin);
comRouter.route("/all").get(getAllCompanies);

export default comRouter;
