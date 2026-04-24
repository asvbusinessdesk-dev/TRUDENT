const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const doctorForm = document.getElementById("doctorForm");
const doctorList = document.getElementById("doctorList");
const leadList = document.getElementById("leadList");
const doctorCount = document.getElementById("doctorCount");
const leadCount = document.getElementById("leadCount");
const latestLead = document.getElementById("latestLead");
const dashboardStatus = document.getElementById("dashboardStatus");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginStatus.textContent = "Checking credentials...";
    loginStatus.className = "form-note";

    const payload = {
      username: document.getElementById("user").value.trim(),
      password: document.getElementById("pass").value
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("Invalid admin credentials.");
      }

      window.location.href = "/dashboard.html";
    } catch (error) {
      loginStatus.textContent = error.message;
      loginStatus.className = "error-message";
    }
  });
}

async function loadDoctors() {
  const response = await fetch("/api/doctors");
  const doctors = await response.json();

  doctorCount.textContent = String(doctors.length);

  doctorList.innerHTML = doctors.length
    ? doctors
        .map(
          (doctor) => `
            <div class="stack-item">
              <strong>${doctor.name}</strong>
              <div>${doctor.specialization}</div>
              <div class="muted">${doctor.experience || "Experience not added yet"}</div>
              <div class="muted">${doctor.availability || "Availability not added yet"}</div>
            </div>
          `
        )
        .join("")
    : '<div class="empty-state">No doctors added yet. Add your first specialist using the form.</div>';
}

async function loadLeads() {
  const response = await fetch("/api/leads");
  const leads = await response.json();

  leadCount.textContent = String(leads.length);
  latestLead.textContent = leads.length ? leads[leads.length - 1].name : "No leads yet";

  leadList.innerHTML = leads.length
    ? leads
        .slice()
        .reverse()
        .map(
          (lead) => `
            <div class="lead-row">
              <div class="lead-name">${lead.name}</div>
              <div class="lead-meta">
                <span>${lead.phone}</span>
                <span>${lead.service || "General consultation"}</span>
                <span>${lead.preferredTime || "Flexible timing"}</span>
              </div>
              <div class="muted">${lead.message || "No message added."}</div>
            </div>
          `
        )
        .join("")
    : '<div class="empty-state">Patient inquiries submitted from the website will appear here.</div>';
}

if (doctorForm) {
  doctorForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    dashboardStatus.textContent = "Saving doctor profile...";
    dashboardStatus.className = "form-note";

    const payload = {
      name: document.getElementById("doctorName").value.trim(),
      specialization: document.getElementById("doctorSpecialization").value.trim(),
      experience: document.getElementById("doctorExperience").value.trim(),
      availability: document.getElementById("doctorAvailability").value.trim()
    };

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save doctor.");
      }

      doctorForm.reset();
      dashboardStatus.textContent = "Doctor profile added successfully.";
      dashboardStatus.className = "success-message";
      await Promise.all([loadDoctors(), loadLeads()]);
    } catch (error) {
      dashboardStatus.textContent = error.message || "Unable to save doctor.";
      dashboardStatus.className = "error-message";
    }
  });
}

if (doctorList && leadList) {
  Promise.all([loadDoctors(), loadLeads()]).catch(() => {
    dashboardStatus.textContent = "Unable to load dashboard data.";
    dashboardStatus.className = "error-message";
  });
}
