document.addEventListener("DOMContentLoaded", async function () {
  try {
    // 1. Check authentication and get user data
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token || !user.email) {
      console.warn("User not authenticated, redirecting to login");
      // window.location.href = "/Frontend/Studlogin.html";
      return;
    }

    // 2. Load student data
    console.log("Loading student data for:", user.email);
    const studentResponse = await fetch(
      `http://localhost:3000/student-profile/${user.email}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (!studentResponse.ok) {
      throw new Error(
        `Failed to fetch student data: ${studentResponse.status}`
      );
    }

    const studentData = await studentResponse.json();
    console.log("Student data loaded:", studentData);

    // 3. Load profile data
    console.log("Loading profile data for:", user.email);
    const profileResponse = await fetch(
      `http://localhost:3000/profile/${user.email}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    let profileData;
    if (profileResponse.status === 404) {
      console.log("No profile found, creating blank profile");
      profileData = createBlankProfile();
    } else if (!profileResponse.ok) {
      throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
    } else {
      profileData = await profileResponse.json();
      if (profileData.message === "Please make profile first") {
        console.log("Blank profile detected, creating structure");
        profileData = createBlankProfile();
      }
    }

    console.log("Profile data loaded:", profileData);

    // 4. Populate the form with data
    populateForm(studentData, profileData);

    // 5. Set up form submission handler
    setupFormSubmissionHandler();

    // 6. Set up skill management
    setupSkillManagement();

    // 7. Set up other UI interactions
    setupUIInteractions();
  } catch (error) {
    console.error("Error initializing profile page:", error);
    // alert("Failed to load profile data. Please try again.");
    // window.location.href = "/Frontend/Studlogin.html";
  }
});

function createBlankProfile() {
  return {
    personalInfo: {
      imageUrl: "",
    },
    academicInfo: {
      department: "",
      cgpa: 0,
      backlogs: 0,
      projects: "",
      currentSemester: "",
    },
    skills: {
      programmingLanguages: [],
      webTechnologies: [],
      databases: [],
      otherSkills: [],
    },
    contactInfo: {
      phone: "",
      address: "",
      linkedin: "",
      github: "",
    },
    resumes: [],
  };
}

function populateForm(student, profile) {
  // Personal Information
  document.getElementById("fullName").value = student.name || "";
  document.getElementById("studentId").value = student.rollNo || "";
  document.getElementById("email").value = student.email || "";
  document.getElementById("phone").value = profile.contactInfo.phone || "";

  // Academic Information
  document.getElementById("program").value =
    profile.academicInfo.department || "Computer Science";
  document.getElementById("graduationYear").value =
    profile.academicInfo.graduationYear || "2025";
  document.getElementById("cgpa").value = profile.academicInfo.cgpa || "";
  document.getElementById("currentSemester").value =
    profile.academicInfo.currentSemester || "1st Semester, 3rd Year";

  // Skills
  populateSkills(profile.skills);

  // Sidebar Info
  updateSidebarInfo(student, profile);

  // Profile Photo
  if (profile.personalInfo.imageUrl) {
    document.querySelector(
      ".custom-file-upload > div"
    ).style.backgroundImage = `url(${profile.personalInfo.imageUrl})`;
  } else {
    // Set initials if no photo
    const initials = (student.name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    document.querySelector(".custom-file-upload > div").textContent = initials;
  }
}

function populateSkills(skills) {
  // Clear existing skills
  document.getElementById("technicalSkillsContainer").innerHTML = "";
  document.getElementById("softSkillsContainer").innerHTML = "";
  document.getElementById("certificationsContainer").innerHTML = "";

  // Add technical skills
  (skills.programmingLanguages || []).forEach((skill) => {
    addSkillTag(skill, "technicalSkillsContainer");
  });

  // Add soft skills (assuming they're in otherSkills)
  (skills.otherSkills || []).forEach((skill) => {
    if (
      [
        "Communication",
        "Team Work",
        "Problem Solving",
        "Time Management",
      ].includes(skill)
    ) {
      addSkillTag(skill, "softSkillsContainer");
    }
  });

  // Add certifications (example)
  if (skills.certifications) {
    skills.certifications.forEach((cert) => {
      addSkillTag(cert, "certificationsContainer");
    });
  }
}

function addSkillTag(skillText, containerId) {
  const container = document.getElementById(containerId);
  const skillTag = document.createElement("div");
  skillTag.className = "skill-tag";
  skillTag.innerHTML = `
      <span>${skillText}</span>
      <button type="button" class="remove-btn">×</button>
  `;
  container.appendChild(skillTag);

  // Add remove functionality
  skillTag.querySelector(".remove-btn").addEventListener("click", () => {
    container.removeChild(skillTag);
  });
}

function updateSidebarInfo(student, profile) {
  document.getElementById("sidebarName").textContent =
    student.name || "Student";
  document.getElementById("sidebarDepartment").textContent =
    (profile.academicInfo.department || "No Department") +
    (student.branch ? `, ${student.branch}` : "");
}

function setupFormSubmissionHandler() {
  const form = document.getElementById("profileUpdateForm");
  const saveBtn = document.getElementById("saveProfileBtn");
  const toast = document.getElementById("toastNotification");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.innerHTML =
      '<i class="ri-loader-4-line animate-spin"></i> Saving...';

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not authenticated");

      // Collect form data
      // Modify the form submission handler to ensure proper data structure
      const formData = {
        personalInfo: {
          imageUrl:
            document.querySelector(".custom-file-upload > div").style
              .backgroundImage || "",
          department: document.getElementById("program").value,
        },
        academicInfo: {
          department: document.getElementById("program").value,
          cgpa: parseFloat(document.getElementById("cgpa").value) || 0,
          graduationYear: document.getElementById("graduationYear").value,
          currentSemester: document.getElementById("currentSemester").value,
        },
        contactInfo: {
          phone: document.getElementById("phone").value,
        },
        skills: {
          programmingLanguages: getSkillsFromContainer(
            "technicalSkillsContainer"
          ),
          otherSkills: getSkillsFromContainer("softSkillsContainer"),
          certifications: getSkillsFromContainer("certificationsContainer"),
        },
      };

      // Send to server
      const response = await fetch("http://localhost:3000/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          email: user.email,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      // Show success
      toast.classList.remove("translate-x-full");
      setTimeout(() => {
        toast.classList.add("translate-x-full");
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="ri-save-line"></i> Save Changes';
    }
  });
}

function getSkillsFromContainer(containerId) {
  return Array.from(
    document.querySelectorAll(`#${containerId} .skill-tag span`)
  ).map((el) => el.textContent.trim());
}

function setupSkillManagement() {
  // Technical Skills
  const techSkillInput = document.getElementById("technicalSkillInput");
  const addTechSkillBtn = document.getElementById("addTechnicalSkill");

  addTechSkillBtn.addEventListener("click", () => {
    if (techSkillInput.value.trim()) {
      addSkillTag(techSkillInput.value.trim(), "technicalSkillsContainer");
      techSkillInput.value = "";
    }
  });

  techSkillInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && techSkillInput.value.trim()) {
      addSkillTag(techSkillInput.value.trim(), "technicalSkillsContainer");
      techSkillInput.value = "";
    }
  });

  // Soft Skills
  const softSkillInput = document.getElementById("softSkillInput");
  const addSoftSkillBtn = document.getElementById("addSoftSkill");

  addSoftSkillBtn.addEventListener("click", () => {
    if (softSkillInput.value.trim()) {
      addSkillTag(softSkillInput.value.trim(), "softSkillsContainer");
      softSkillInput.value = "";
    }
  });

  softSkillInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && softSkillInput.value.trim()) {
      addSkillTag(softSkillInput.value.trim(), "softSkillsContainer");
      softSkillInput.value = "";
    }
  });

  // Certifications
  const certInput = document.getElementById("certificationInput");
  const addCertBtn = document.getElementById("addCertification");

  addCertBtn.addEventListener("click", () => {
    if (certInput.value.trim()) {
      addSkillTag(certInput.value.trim(), "certificationsContainer");
      certInput.value = "";
    }
  });

  certInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && certInput.value.trim()) {
      addSkillTag(certInput.value.trim(), "certificationsContainer");
      certInput.value = "";
    }
  });
}

function setupUIInteractions() {
  // Profile photo upload
  const profilePhotoInput = document.getElementById("profilePhoto");
  profilePhotoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const profilePhotoDiv = document.querySelector(
          ".custom-file-upload > div"
        );
        profilePhotoDiv.style.backgroundImage = `url(${event.target.result})`;
        profilePhotoDiv.textContent = "";
      };
      reader.readAsDataURL(file);
    }
  });

  // Resume upload
  const resumeUpload = document.getElementById("resumeUpload");
  resumeUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document");
        return;
      }

      if (file.size > maxSize) {
        alert("File size exceeds 5MB limit");
        return;
      }

      // Create preview
      const filePreview = document.createElement("div");
      filePreview.className = "file-preview";
      filePreview.innerHTML = `
              <div class="file-icon">
                  <i class="${
                    file.type.includes("pdf")
                      ? "ri-file-pdf-line"
                      : "ri-file-word-line"
                  }"></i>
              </div>
              <div class="file-info">
                  <p>${file.name}</p>
                  <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
              </div>
              <div class="file-actions">
                  <button type="button"><i class="ri-delete-bin-line"></i></button>
              </div>
          `;

      // Add delete handler
      filePreview.querySelector("button").addEventListener("click", () => {
        filePreview.remove();
        resumeUpload.value = "";
      });

      // Add to DOM
      resumeUpload.parentNode.insertBefore(
        filePreview,
        resumeUpload.nextSibling
      );
    }
  });

  // Toast close button
  document.getElementById("closeToast").addEventListener("click", () => {
    document
      .getElementById("toastNotification")
      .classList.add("translate-x-full");
  });

  // Unsaved changes detection
  let formChanged = false;
  document
    .querySelectorAll(
      "#profileUpdateForm input, #profileUpdateForm select, #profileUpdateForm textarea"
    )
    .forEach((input) => {
      input.addEventListener("change", () => {
        formChanged = true;
      });
    });

  window.addEventListener("beforeunload", (e) => {
    if (formChanged) {
      e.preventDefault();
      return (e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?");
    }
  });
}
document.querySelectorAll('#profileUpdateForm input, #profileUpdateFormSelect')