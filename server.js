const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const doctors = [];
const leads = [];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username === "admin" && password === "admin123") {
    return res.json({ success: true });
  }

  return res.json({ success: false });
});

app.post("/api/doctors", (req, res) => {
  const { name, specialization, experience, availability } = req.body || {};

  if (!name || !specialization) {
    return res.status(400).json({
      success: false,
      message: "Name and specialization are required."
    });
  }

  doctors.push({
    id: Date.now(),
    name,
    specialization,
    experience: experience || "",
    availability: availability || ""
  });

  return res.json({ success: true });
});

app.get("/api/doctors", (_req, res) => {
  res.json(doctors);
});

app.post("/api/leads", (req, res) => {
  const {
    name,
    phone,
    service,
    message,
    preferredTime
  } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone are required."
    });
  }

  leads.push({
    id: Date.now(),
    name,
    phone,
    service: service || "",
    message: message || "",
    preferredTime: preferredTime || "",
    createdAt: new Date().toISOString()
  });

  return res.json({ success: true });
});

app.get("/api/leads", (_req, res) => {
  res.json(leads);
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
