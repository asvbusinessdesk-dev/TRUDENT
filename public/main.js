const leadForm = document.getElementById("leadForm");
const leadStatus = document.getElementById("leadStatus");
const doctorGrid = document.getElementById("doctorGrid");

const fallbackDoctors = [
  {
    name: "Dr. Ayesha Khan",
    specialization: "Dental Implants & Smile Rehab",
    experience: "12+ years experience",
    availability: "Mon-Sat | 10 AM-7 PM"
  },
  {
    name: "Dr. Rohan Mehta",
    specialization: "Root Canal & Restorative Dentistry",
    experience: "10+ years experience",
    availability: "Mon-Fri | 11 AM-8 PM"
  },
  {
    name: "Dr. Naina Kapoor",
    specialization: "Cosmetic Dentistry & Aligners",
    experience: "9+ years experience",
    availability: "Tue-Sun | 9 AM-6 PM"
  }
];

function renderDoctors(doctors) {
  const list = doctors.length ? doctors : fallbackDoctors;

  doctorGrid.innerHTML = list
    .map(
      (doctor) => `
        <article class="doctor-card">
          <span class="doctor-badge">${doctor.specialization}</span>
          <h3>${doctor.name}</h3>
          <p class="muted">A patient-first approach focused on clarity, comfort, and long-term oral health.</p>
          <div class="doctor-meta">
            <span>${doctor.experience || "Experienced specialist"}</span>
            <span>${doctor.availability || "Appointments available this week"}</span>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadDoctors() {
  try {
    const response = await fetch("/api/doctors");
    if (!response.ok) {
      throw new Error("Unable to load doctors.");
    }

    const doctors = await response.json();
    renderDoctors(doctors);
  } catch (_error) {
    renderDoctors([]);
  }
}

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    leadStatus.textContent = "Submitting your request...";
    leadStatus.className = "form-note";

    const payload = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      service: document.getElementById("service").value,
      preferredTime: document.getElementById("preferredTime").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      leadForm.reset();
      leadStatus.textContent =
        "Thank you. Our care team will call you shortly to confirm your consultation.";
      leadStatus.className = "success-message";
    } catch (error) {
      leadStatus.textContent = error.message || "Unable to submit right now.";
      leadStatus.className = "error-message";
    }
  });
}

loadDoctors();
