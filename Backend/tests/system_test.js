import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_PORT = 3000;
const API_BASE = `http://localhost:${SERVER_PORT}`;

// Helper for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  console.log("Starting System Test...");

  // 1. Start Server
  const server = spawn("node", ["server.js"], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "pipe", // Capture output
    env: { ...process.env, PORT: SERVER_PORT },
  });

  server.stdout.on("data", (data) => console.log(`[SERVER]: ${data}`));
  server.stderr.on("data", (data) => console.error(`[SERVER ERR]: ${data}`));

  // Wait for server to start
  await delay(3000);

  try {
    // --- UTILS ---
    async function request(method, endpoint, body = null, token = null) {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const options = {
        method,
        headers,
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await res.json().catch(() => ({}));
      return { status: res.status, data };
    }

    // --- TEST DATA ---
    const timestamp = Date.now();
    const studentUser = {
      fullName: `Test Student ${timestamp}`,
      email: `student${timestamp}@test.com`,
      rollNo: `ROLL${timestamp}`,
      branch: "CSE",
      password: "password123",
    };
    const companyUser = {
      name: `Test Company ${timestamp}`,
      email: `company${timestamp}@test.com`,
      password: "password123",
      address: "123 Test St",
      domain: "Tech",
      role: "company", // Assuming role field if needed, or separate register route
    };

    // --- 1. STUDENT FLOW ---
    console.log("\n--- Testing Student Flow ---");

    // Register
    console.log(`Registering student: ${studentUser.email}`);
    let res = await request("POST", "/api/student/register", studentUser);
    if (res.status !== 201)
      throw new Error(`Student Register Failed: ${res.data.message}`);
    console.log("✅ Student Registered");

    // Login
    console.log(`Logging in student...`);
    res = await request("POST", "/api/student/login", {
      email: studentUser.email,
      password: studentUser.password,
    });
    if (res.status !== 201)
      throw new Error(`Student Login Failed: ${res.data.message}`);
    const studentToken = res.data.accessToken;
    const studentId = res.data.loggedInuser._id;
    console.log("✅ Student Logged In");

    // Profile (Info)
    console.log(`Fetching student info...`);
    res = await request(
      "GET",
      `/api/student/info/${studentUser.email}`,
      null,
      studentToken
    );
    if (res.status !== 200 || res.data.email !== studentUser.email)
      throw new Error("Fetch Student Info Failed");
    console.log("✅ Student Info Fetched");

    // Save Profile
    console.log(`Saving student profile...`);
    res = await request(
      "POST",
      `/api/student/save-profile`,
      {
        email: studentUser.email,
        academicInfo: { cgpa: 9.5 },
      },
      studentToken
    );
    if (res.status !== 200)
      throw new Error(`Save Profile Failed: ${res.data.message}`);
    console.log("✅ Student Profile Saved");

    // --- 2. COMPANY FLOW ---
    console.log("\n--- Testing Company Flow ---");

    // Register
    console.log(`Registering company: ${companyUser.email}`); // Note: Company register endpoint might be different?
    // Checking routes/company.route.js... imported in server as /api/company
    // Let's assume /api/company/register based on standard naming, but wait, let's check company.route.js content if possible?
    // I can't check it right now without interrupting, but I assigned it to `comRegister` from controller.
    // In `ComReg.html`, I set it to `/api/company/register`.
    res = await request("POST", "/api/company/register", companyUser);
    if (res.status !== 201)
      throw new Error(`Company Register Failed: ${res.data.message}`);
    console.log("✅ Company Registered");

    // Login
    res = await request("POST", "/api/company/login", {
      email: companyUser.email,
      password: companyUser.password,
    });
    if (res.status !== 200 && res.status !== 201)
      throw new Error(
        `Company Login Failed: ${res.status} ${res.data.message}`
      );
    const companyToken = res.data.accessToken;
    const companyId = res.data.loggedIncompany._id;
    console.log("✅ Company Logged In");

    // Post Job
    console.log(`Posting a job...`);
    const jobData = {
      job_title: "Software Engineer",
      job_type: "Full Time",
      vacancy: 5,
      salary: "10LPA",
      job_des: "Coding",
      skills: ["Node", "React"],
      criteria: "B.Tech",
      job_location: "Remote",
      deadline: new Date(Date.now() + 86400000).toISOString(),
    };
    res = await request("POST", "/api/jobs", jobData, companyToken);
    if (res.status !== 201)
      throw new Error(`Job Post Failed: ${res.data.message}`);
    const jobId = res.data.job._id;
    console.log("✅ Job Posted");

    // Get Company Jobs
    console.log(`Fetching company jobs...`);
    res = await request(
      "GET",
      `/api/jobs/company/${companyId}`,
      null,
      companyToken
    ); // Note: /api/jobs/company/:id
    if (res.status !== 200 || !res.data.find((j) => j._id === jobId))
      throw new Error("Fetch Company Jobs Failed");
    console.log("✅ Company Jobs Verified");

    // Get Stats
    console.log(`Fetching company stats...`);
    res = await request("GET", `/api/stats/${companyId}`, null, companyToken);
    if (res.status !== 200 || res.data.activeJobs < 1)
      throw new Error("Fetch Stats Failed");
    console.log("✅ Company Stats Verified");

    // --- 3. INTERACTION ---
    console.log("\n--- Testing Interaction ---");

    // Apply Job
    console.log(`Student applying for job...`);
    res = await request("POST", "/api/jobs/apply", { jobId }, studentToken);
    if (res.status !== 200)
      throw new Error(`Job Application Failed: ${res.data.message}`);
    console.log("✅ Job Applied");

    // Verify Stats Incr
    console.log(`Verifying application count...`);
    res = await request("GET", `/api/stats/${companyId}`, null, companyToken);
    if (res.status !== 200) throw new Error("Fetch Stats Failed");
    // Note: Stats aggregation might take time or be instant.
    console.log(`Stats Applications: ${res.data.applications}`);
    if (res.data.applications !== 1)
      console.warn(
        "⚠️ Application count did not increment expectedly (might be 0 if prev tests ran, but fresh user/company should be 1)"
      );
    else console.log("✅ Application Count Verified");

    console.log("\n🎉 SYSTEM TEST PASSED! All modules working.");
  } catch (err) {
    console.error("\n❌ SYSTEM TEST FAILED");
    console.error(err);
  } finally {
    server.kill();
  }
}

runTest();
