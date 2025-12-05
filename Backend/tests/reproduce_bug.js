import { spawn } from "child_process";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverPath = path.join(__dirname, "../server.js");

const TEST_PORT = 3001;

console.log("Starting server for reproduction...");

const serverProcess = spawn("node", [serverPath], {
  cwd: path.dirname(serverPath),
  env: {
    ...process.env,
    PORT: TEST_PORT,
    MONGO_URL: "mongodb://localhost:27017/test_db",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
let serverError = "";

serverProcess.stdout.on("data", (data) => {
  const str = data.toString();
  serverOutput += str;
  console.log(`[Server]: ${str.trim()}`);
});

serverProcess.stderr.on("data", (data) => {
  const str = data.toString();
  serverError += str;
  // console.error(`[Server Error]: ${str.trim()}`); // Don't verify strictly here, wait for check
});

// Wait for server to start
setTimeout(() => {
  console.log("Sending request to trigger bug...");

  const options = {
    hostname: "localhost",
    port: TEST_PORT,
    path: "/company-stats/123",
    method: "GET",
    headers: {
      Authorization: "Bearer dummy_token", // This triggers the jwt.verify line
    },
  };

  const req = http.request(options, (res) => {
    console.log(`Response status: ${res.statusCode}`);
    res.on("data", () => {}); // Consume data
    res.on("end", () => {
      checkResult();
    });
  });

  req.on("error", (e) => {
    console.log(`Request error (expected if server crashed): ${e.message}`);
    checkResult();
  });

  req.end();
}, 3000); // Give server 3s to start

import fs from "fs";

function checkResult() {
  console.log("Checking server stderr for ReferenceError...");

  // Kill server
  serverProcess.kill();

  let result = "";
  if (serverError.includes("ReferenceError: jwt is not defined")) {
    result =
      'SUCCESS: Bug reproduced! Found "ReferenceError: jwt is not defined"';
    console.log(result);
  } else {
    result = "FAILED: Bug NOT reproduced.";
    console.log(result);
    console.log("Server Stderr:", serverError);
  }
  fs.writeFileSync("verification_result.txt", result + "\n" + serverError);
  process.exit(0);
}
