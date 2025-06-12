document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) {
    window.location.href = "/Frontend/ComLogin.html";
    return;
  }

  // Update user info in header
  updateUserInfo(userData);

  // Fetch and display company stats
  fetchCompanyStats(userData.id);

  // Setup job post form
  setupJobPostForm(userData.id);

  // Load recent job posts
  fetchRecentJobs(userData.id);

  // Add profile link to navbar
  addProfileLink();

  // Add logout functionality
  setupLogout();

  const editForm = document.getElementById("editJobForm");
  if (editForm) {
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(editForm);
      const jobData = {
        _id: formData.get("_id"),
        job_title: formData.get("jobTitle"),
        job_type: formData.get("jobType"),
        vacancy: parseInt(formData.get("vacancies")),
        salary: formData.get("salary"),
        job_des: formData.get("jobDescription"),
        skills: formData
          .get("skillsRequired")
          .split(",")
          .map((skill) => skill.trim()),
        criteria: formData.get("eligibility"),
        job_location: formData.get("location"),
        deadline: formData.get("deadline"),
      };

      console.log(jobData.job_location);

      try {
        const response = await fetch("http://localhost:3000/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
          body: JSON.stringify(jobData),
        });

        if (!response.ok) throw new Error("Failed to update job");

        const result = await response.json();
        alert(result.message);
        closeEditModal();
        fetchRecentJobs(JSON.parse(localStorage.getItem("user")).id);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }
});

function updateUserInfo(userData) {
  // const userInfoElement = document.querySelector(".user-info");
  // if (userInfoElement) {
  //   userInfoElement.innerHTML = `
  //           <img src="https://via.placeholder.com/40" alt="User">
  //           <span>${userData.name}</span>
  //       `;
  // }

  const userInfoElement = document.querySelector(".p-4.border-t.border-white\\/10 .ml-3 p:first-child");
  if (userInfoElement) {
    userInfoElement.textContent = userData.name; // This will display the company name
  }
}

function addProfileLink() {
  const navMenu = document.querySelector(".nav-menu");
  if (navMenu) {
    const profileItem = document.createElement("li");
    profileItem.className = "nav-item";
    profileItem.innerHTML = `
            <a href="/Frontend/CompanyProfile.html" class="nav-link">
                <i class="fas fa-user"></i> Profile
            </a>
        `;
    navMenu.appendChild(profileItem);
  }
}

async function fetchCompanyStats(companyId) {
  try {
    const response = await fetch(
      `http://localhost:3000/company-stats/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch stats");

    const stats = await response.json();

    // Update stats cards
    document.querySelector(".stat-card:nth-child(1) .stat-number").textContent =
      stats.activeJobs || 0;
    document.querySelector(".stat-card:nth-child(2) .stat-number").textContent =
      stats.applications || 0;
    document.querySelector(".stat-card:nth-child(3) .stat-number").textContent =
      stats.interviews || 0;
  } catch (error) {
    console.error("Error fetching company stats:", error);
  }
}

function setupJobPostForm(companyId) {
  const form = document.getElementById("jobPostForm");
  const postBtn = document.getElementById("postJobBtn");
  const updateBtn = document.getElementById("updateJobBtn");

  if (!form) return;

  // Handle form submission for both create and update
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const jobData = {
      job_title: formData.get("jobTitle"),
      job_type: formData.get("jobType"),
      vacancy: parseInt(formData.get("vacancies")),
      salary: formData.get("salary"),
      job_des: formData.get("jobDescription"),
      skills: formData
        .get("skillsRequired")
        .split(",")
        .map((skill) => skill.trim()),
      criteria: formData.get("eligibility"),
      job_location: formData.get("location"),
      deadline: formData.get("deadline"),
      companyId: companyId,
    };

    // If we're in update mode, include the _id
    if (updateBtn.dataset.jobId) {
      jobData._id = updateBtn.dataset.jobId;
    }

    const activeBtn = updateBtn.dataset.jobId ? updateBtn : postBtn;
    const originalText = activeBtn.textContent;
    activeBtn.disabled = true;
    activeBtn.textContent = updateBtn.dataset.jobId
      ? "Updating..."
      : "Posting...";

    try {
      const response = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process job");
      }

      const result = await response.json();
      alert(result.message);
      form.reset();
      fetchRecentJobs(companyId);

      // Reset to create mode
      if (updateBtn.dataset.jobId) {
        updateBtn.style.display = "none";
        postBtn.style.display = "block";
        delete updateBtn.dataset.jobId;
      }
    } catch (error) {
      console.error("Error processing job:", error);
      alert(error.message);
    } finally {
      activeBtn.disabled = false;
      activeBtn.textContent = originalText;
    }
  });

  // Setup update button click handler
  updateBtn.addEventListener("click", () => {
    document.getElementById("jobPostForm").dispatchEvent(new Event("submit"));
  });
}

async function fetchRecentJobs(companyId) {
  try {
    const response = await fetch(
      `http://localhost:3000/company-jobs/${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch jobs");

    const jobs = await response.json();
    console.log("Fetched jobs:", jobs);
    renderJobsTable(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

function renderJobsTable(jobs) {
  const table = document.querySelector("table");
  if (!table) return;

  // Create tbody if it doesn't exist
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  tbody.innerHTML = jobs
    .map(
      (job) => `
        <tr>
            <td style="padding: 12px 15px;">${job.job_title}</td>
            <td style="padding: 12px 15px;">${job.applications || 0}</td>
            <td style="padding: 12px 15px;">${new Date(
              job.deadline
            ).toLocaleDateString()}</td>
            <td style="padding: 12px 15px;">
                <span style="color: ${
                  new Date(job.deadline) > new Date() ? "green" : "orange"
                }">
                    ${new Date(job.deadline) > new Date() ? "Active" : "Closed"}
                </span>
            </td>
            <td style="padding: 12px 15px;">
                <a href="#" class="view-job" data-id="${
                  job._id
                }" style="color: var(--primary-color); margin-right: 10px;">View</a>
                <a href="#" class="delete-job" data-id="${
                  job._id
                }" style="color: #ff4757;">Delete</a>
            </td>
        </tr>
    `
    )
    .join("");

  // Add event listeners for actions
  document.querySelectorAll(".view-job").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      viewJobDetails(e.target.dataset.id);
    });
  });

  document.querySelectorAll(".delete-job").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteJob(e.target.dataset.id);
    });
  });
}

async function viewJobDetails(jobId) {
  try {
    const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user")).token
        }`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch job details");

    const job = await response.json();
    showJobModal(job);
  } catch (error) {
    console.error(error);
    alert("Could not load job details");
  }
}

async function deleteJob(jobId) {
  if (!confirm("Are you sure you want to delete this job?")) return;

  try {
    const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user")).token
        }`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete job");

    alert("Job deleted successfully");
    fetchRecentJobs(JSON.parse(localStorage.getItem("user")).id);
  } catch (error) {
    console.error("Error deleting job:", error);
    alert(error.message);
  }
}

function setupLogout() {
  const navMenu = document.querySelector(".nav-menu");
  if (navMenu) {
    const logoutItem = document.createElement("li");
    logoutItem.className = "nav-item";
    logoutItem.innerHTML = `
            <a href="#" class="nav-link" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        `;
    navMenu.appendChild(logoutItem);

    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "/Frontend/ComLogin.html";
    });
  }
}

function showJobModal(job) {
  document.getElementById("detailTitle").textContent = job.job_title;
  document.getElementById("detailType").textContent = job.job_type;
  document.getElementById("detailVacancies").textContent = job.vacancy;
  document.getElementById("detailSalary").textContent = job.salary;
  document.getElementById("detailLocation").textContent = job.job_location;
  document.getElementById("detailEligibility").textContent = job.criteria;
  document.getElementById("detailSkills").textContent = job.skills.join(", ");
  document.getElementById("detailDescription").textContent = job.job_des;
  document.getElementById("detailDeadline").textContent = new Date(job.deadline).toLocaleDateString();

  document.getElementById("jobDetailModal").classList.remove("hidden");
}

document.getElementById("closeJobModalBtn").addEventListener("click", () => {
  document.getElementById("jobDetailModal").classList.add("hidden");
});