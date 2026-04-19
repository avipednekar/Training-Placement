import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getEligibilityOverviewForAdmin } from "../../services/job.service.js";

// Require environment variables - fail startup if missing
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_EMAIL) {
  throw new Error("ADMIN_EMAIL environment variable is required");
}
if (!ADMIN_PASSWORD_HASH) {
  throw new Error("ADMIN_PASSWORD_HASH environment variable is required (bcrypt hash)");
}

const ADMIN_EMAIL_LOWER = ADMIN_EMAIL.toLowerCase();

export const adminLogin = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email !== ADMIN_EMAIL_LOWER) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const accessToken = jwt.sign(
      {
        email: ADMIN_EMAIL_LOWER,
        role: "admin",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );

    return res.json({
      message: "Admin login successful",
      accessToken,
      adminUser: {
        email: ADMIN_EMAIL_LOWER,
        role: "admin",
        name: "Admin",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in as admin" });
  }
};

export const getEligibilityOverview = async (req, res) => {
  try {
    const overview = await getEligibilityOverviewForAdmin();
    res.json(overview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admin eligibility overview" });
  }
};
