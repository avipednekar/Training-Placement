import { Student } from "../models/student/register.model.js";

export const findStudentByEmail = async (email) => {
  return Student.findOne({ email }).select("-password");
};

