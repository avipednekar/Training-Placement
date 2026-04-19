import jwt from "jsonwebtoken";
import { Student } from "../models/student/register.model.js";
import { Company } from "../models/company/register.js";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@tpo.local").toLowerCase();

const getTokenFromRequest = (req) => {
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  // Fallback to cookie for legacy student login flow
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

const sendAuthError = (res, code, message, statusCode = 401) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      message,
    },
  });
};

const verifyAccessToken = (req, res) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw {
      statusCode: 401,
      code: "AUTH_REQUIRED",
      message: "Authentication token is missing",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw {
      statusCode: 401,
      code: "INVALID_TOKEN",
      message: "Invalid or expired authentication token",
    };
  }
};

// Student-specific auth guard (backwards-compatible name)
const verifyJWT = async (req, res, next) => {
  try {
    const decoded = verifyAccessToken(req, res);

    const student = await Student.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!student) {
      return sendAuthError(res, "STUDENT_NOT_FOUND", "Student not found");
    }

    req.student = student;
    req.auth = {
      userId: String(student._id),
      role: "student",
      email: student.email,
    };

    next();
  } catch (err) {
    return sendAuthError(
      res,
      err.code || "AUTH_ERROR",
      err.message || "Authentication failed",
      err.statusCode || 401
    );
  }
};

// Explicit student guard for clarity in new routes
const requireStudent = verifyJWT;

// Company-specific auth guard
const requireCompany = async (req, res, next) => {
  try {
    const decoded = verifyAccessToken(req, res);

    const company = await Company.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!company) {
      return sendAuthError(res, "COMPANY_NOT_FOUND", "Company not found");
    }

    req.company = company;
    req.auth = {
      userId: String(company._id),
      role: "company",
      email: company.email,
    };

    next();
  } catch (err) {
    return sendAuthError(
      res,
      err.code || "AUTH_ERROR",
      err.message || "Authentication failed",
      err.statusCode || 401
    );
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const decoded = verifyAccessToken(req, res);

    if (
      decoded?.role !== "admin" ||
      String(decoded?.email || "").toLowerCase() !== ADMIN_EMAIL
    ) {
      return sendAuthError(res, "ADMIN_ONLY", "Admin access is required", 403);
    }

    req.admin = {
      email: ADMIN_EMAIL,
      role: "admin",
      name: "Admin",
    };
    req.auth = {
      userId: ADMIN_EMAIL,
      role: "admin",
      email: ADMIN_EMAIL,
    };

    next();
  } catch (err) {
    return sendAuthError(
      res,
      err.code || "AUTH_ERROR",
      err.message || "Authentication failed",
      err.statusCode || 401
    );
  }
};

export { verifyJWT, requireStudent, requireCompany, requireAdmin };
