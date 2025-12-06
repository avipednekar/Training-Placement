import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import Routes
import comRouter from "./routes/company.route.js";
import studRouter from "./routes/student.route.js";
import jobRouter from "./routes/job.route.js";
import statsRouter from "./routes/stats.route.js";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("My webpage");
});

// API Routes
app.use("/api/company", comRouter);
app.use("/api/student", studRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/stats", statsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
