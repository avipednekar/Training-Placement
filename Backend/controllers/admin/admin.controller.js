import jwt from "jsonwebtoken";
import { getEligibilityOverviewForAdmin } from "../../services/job.service.js";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@tpo.local").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export const adminLogin = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const accessToken = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: "admin",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );

    return res.json({
      message: "Admin login successful",
      accessToken,
      adminUser: {
        email: ADMIN_EMAIL,
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
