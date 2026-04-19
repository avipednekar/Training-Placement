import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getEligibilityOverviewForAdmin } from "../../services/job.service.js";

const getAdminCredentials = () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail) {
    return null;
  }

  if (!adminPasswordHash) {
    return null;
  }

  return {
    adminEmailLower: adminEmail.toLowerCase(),
    adminPasswordHash,
  };
};

export const adminLogin = async (req, res) => {
  try {
    const adminCredentials = getAdminCredentials();

    if (!adminCredentials) {
      return res.status(503).json({
        message: "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.",
      });
    }

    const { adminEmailLower, adminPasswordHash } = adminCredentials;
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email !== adminEmailLower) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const accessToken = jwt.sign(
      {
        email: adminEmailLower,
        role: "admin",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10h" }
    );

    return res.json({
      message: "Admin login successful",
      accessToken,
      adminUser: {
        email: adminEmailLower,
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
