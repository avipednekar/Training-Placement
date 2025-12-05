let user;

document.addEventListener("DOMContentLoaded", async function () {
  const applicationChart = echarts.init(
    document.getElementById("applicationChart")
  );
  const option = {
    animation: false,
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#e8e9ec",
      borderWidth: 1,
      textStyle: {
        color: "#1f2937",
      },
    },
    legend: {
      data: ["Applications", "Interviews", "Offers"],
      bottom: 0,
      textStyle: {
        color: "#6b7280",
      },
    },
    grid: {
      left: "3%",
      right: "3%",
      top: "3%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May"],
      axisLine: {
        lineStyle: {
          color: "#e8e9ec",
        },
      },
      axisLabel: {
        color: "#6b7280",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#f5f6fa",
        },
      },
      axisLabel: {
        color: "#6b7280",
      },
    },
    series: [
      {
        name: "Applications",
        type: "line",
        smooth: true,
        data: [5, 8, 12, 6, 2],
        lineStyle: {
          width: 3,
          color: "rgba(87, 181, 231, 1)",
        },
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(87, 181, 231, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(87, 181, 231, 0.01)",
              },
            ],
          },
        },
      },
      {
        name: "Interviews",
        type: "line",
        smooth: true,
        data: [2, 5, 8, 4, 1],
        lineStyle: {
          width: 3,
          color: "rgba(141, 211, 199, 1)",
        },
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(141, 211, 199, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(141, 211, 199, 0.01)",
              },
            ],
          },
        },
      },
      {
        name: "Offers",
        type: "line",
        smooth: true,
        data: [0, 1, 2, 1, 1],
        lineStyle: {
          width: 3,
          color: "rgba(251, 191, 114, 1)",
        },
        symbol: "none",
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(251, 191, 114, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(251, 191, 114, 0.01)",
              },
            ],
          },
        },
      },
    ],
  };
  applicationChart.setOption(option);
  window.addEventListener("resize", function () {
    applicationChart.resize();
  });

  const notificationButton = document.getElementById("notificationButton");
  const notificationPanel = document.getElementById("notificationPanel");
  const markAllRead = document.getElementById("markAllRead");
  let isNotificationPanelOpen = false;
  notificationButton.addEventListener("click", function (e) {
    e.stopPropagation();
    isNotificationPanelOpen = !isNotificationPanelOpen;
    if (isNotificationPanelOpen) {
      notificationPanel.classList.remove("hidden");
    } else {
      notificationPanel.classList.add("hidden");
    }
  });
  document.addEventListener("click", function (e) {
    if (!notificationPanel.contains(e.target) && isNotificationPanelOpen) {
      notificationPanel.classList.add("hidden");
      isNotificationPanelOpen = false;
    }
  });
  markAllRead.addEventListener("click", function (e) {
    e.stopPropagation();
    const unreadDots = notificationPanel.querySelectorAll(
      ".bg-primary.rounded-full"
    );
    unreadDots.forEach((dot) => {
      dot.remove();
    });
  });
  const notificationItems = document.querySelectorAll(".notification-item");
  notificationItems.forEach((item) => {
    item.addEventListener("click", function () {
      const unreadDot = this.querySelector(".bg-primary.rounded-full");
      if (unreadDot) {
        unreadDot.remove();
      }
    });
  });
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const textElement =
        this.nextElementSibling.querySelector("p:first-child");
      if (this.checked) {
        textElement.classList.add("line-through", "text-gray-400");
      } else {
        textElement.classList.remove("line-through", "text-gray-400");
      }
    });
  });

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  if (!user || !user.token || !user.email) {
    console.warn("User not authenticated. Redirecting...");
    window.location.href = "/Frontend/Studlogin.html";
    return;
  }

  try {
    // Fetch student details using email
    const response = await fetch(
      `http://localhost:3000/student-profile/${user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch student profile");
    const studentData = await response.json();
    updateStudentInfo(studentData);

    const profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
      profileBtn.addEventListener("click", () => {
        localStorage.setItem("studentEmail", user.email);
        window.location.href = "./profile.html";
      });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "./Studlogin.html";
      });
    }

    // Update student info elements only if present
    function updateStudentInfo(data) {
      const nameEl = document.getElementById("userName");
      if (nameEl) nameEl.textContent = data.name;

      ["studentName", "studentEmail", "studentRollNo", "studentBranch"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (el)
            el.textContent =
              data[id.replace("student", "").toLowerCase()] || data[id];
        }
      );

      const sidebarName = document.getElementById("sidebarName");
      const sidebarEmail = document.getElementById("sidebarEmail");
      if (sidebarName) sidebarName.textContent = data.name;
      if (sidebarEmail) sidebarEmail.textContent = data.email;
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    showError("Failed to load student data. Please try again.");
  }
});

function updateStudentInfo(data) {
  // Update welcome message
  const userName = document.getElementById("userName");
  if (userName) userName.textContent = data.name;

  // Update student info card
  const studentName = document.getElementById("studentName");
  if (studentName) studentName.textContent = data.name;

  const studentEmail = document.getElementById("studentEmail");
  if (studentEmail) studentEmail.textContent = data.email;

  const studentRollNo = document.getElementById("studentRollNo");
  if (studentRollNo) studentRollNo.textContent = data.rollNo || "Not available";

  const studentBranch = document.getElementById("studentBranch");
  if (studentBranch) studentBranch.textContent = data.branch || "Not available";

  // Update sidebar
  const sidebarName = document.getElementById("sidebarName");
  if (sidebarName) sidebarName.textContent = data.name;

  const sidebarEmail = document.getElementById("sidebarEmail");
  if (sidebarEmail) sidebarEmail.textContent = data.email;

  // Update profile picture initials
  const profileInitials = document.querySelectorAll(".profile-initial");
  profileInitials.forEach((el) => {
    if (data.name) {
      const initials = data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      el.textContent = initials.substring(0, 2);
    }
  });
}

// Logout button
document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("user");
  window.location.href = "/Frontend/Studlogin.html";
});

function updateStudentInfo(data) {
  // Update sidebar
  document.getElementById("sidebarName").textContent = data.name;
  document.getElementById("sidebarEmail").textContent = data.email;

  // Update welcome message
  document.getElementById("userName").textContent = data.name;

  // Update student info
  document.getElementById("studentName").textContent = data.name;
  document.getElementById("studentEmail").textContent = data.email;
  document.getElementById("studentRollNo").textContent = data.rollNo;
  document.getElementById("studentBranch").textContent = data.branch;
}

function updatePlacementStatus(status) {
  const statusElement = document.getElementById("placementStatusIndicator");
  const statusText = document.getElementById("placementStatusText");
  const detailsElement = document.getElementById("placementDetails");

  statusElement.className = "status-indicator";

  if (status === "placed") {
    statusElement.classList.add("status-placed");
    statusText.textContent = "Congratulations! You have been placed.";
    detailsElement.innerHTML = `
        <p><strong>Company:</strong> ${status.company || "Not specified"}</p>
        <p><strong>Package:</strong> ${status.package || "Not disclosed"}</p>
        <p><strong>Date:</strong> ${status.date || "Not specified"}</p>
      `;
  } else if (status === "interview") {
    statusElement.classList.add("status-interview");
    statusText.textContent = "Upcoming interview scheduled";
    detailsElement.innerHTML = `
        <p><strong>Company:</strong> ${status.company || "Not specified"}</p>
        <p><strong>Date:</strong> ${status.date || "Not specified"}</p>
        <p><strong>Time:</strong> ${status.time || "Not specified"}</p>
        <p><strong>Location:</strong> ${status.location || "Virtual"}</p>
      `;
  } else {
    statusElement.classList.add("status-pending");
    statusText.textContent = "Placement process ongoing";
    detailsElement.innerHTML = `
        <p>You haven't been placed yet. Keep applying to opportunities!</p>
      `;
  }
}

function updateRecentActivity(activities) {
  const activityList = document.getElementById("recentActivity");

  if (!activities || activities.length === 0) {
    activityList.innerHTML =
      '<li class="activity-item">No recent activity</li>';
    return;
  }

  activityList.innerHTML = activities
    .map(
      (activity) => `
      <li class="activity-item">
        <i class="fas ${getActivityIcon(activity.type)} activity-icon"></i>
        <div class="activity-content">
          <div>${activity.message}</div>
          <div class="activity-time">${new Date(
            activity.timestamp
          ).toLocaleString()}</div>
        </div>
      </li>
    `
    )
    .join("");
}

function getActivityIcon(type) {
  const icons = {
    application: "fa-file-alt",
    interview: "fa-calendar-alt",
    result: "fa-check-circle",
    notification: "fa-bell",
    profile: "fa-user-edit",
  };
  return icons[type] || "fa-info-circle";
}

function showError(message) {
  alert(message);
}
