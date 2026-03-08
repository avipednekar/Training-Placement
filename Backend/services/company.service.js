import { Company } from "../models/company/register.js";

export const getCompanyCount = async () => {
  return Company.countDocuments();
};

