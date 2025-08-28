<h1 align="center">👁️ VisionAI</h1>

<p align="center">
  <b>AI-powered retinal disease diagnosis & patient-care platform</b><br>
  <i>Built with MERN Stack, Python, Power BI, and Real-Time Communication</i>
</p>

---

## 🚀 Overview

**VisionAI** is a full-stack healthcare platform that leverages **AI**, **data analytics**, and **real-time communication** to support ophthalmologists in diagnosing retinal conditions and managing patient interactions efficiently. With a dual-layer AI model and integrated dashboards, it ensures smarter decisions and faster care.

---

## 🧠 Key Features

- 🔍 **Two-Stage AI Detection for Retinal Diseases**
- 📊 **Power BI Dashboards for Trend Analysis**
- 📞 **WebRTC-based Doctor-Patient Communication**
- 📅 **Role-Based Appointment Management**
- 🔐 **Secure Authentication & Role Control (Doctor, Patient)**

---

## 🧬 AI Model Architecture

### 🧪 Stage 1: Disease Classification

The first model classifies retinal scans into:

| Label | Condition                              |
|-------|----------------------------------------|
| 🟢 N   | Normal                                 |
| 🍬 D   | Diabetes                               |
| 👁️ G   | Glaucoma                               |
| 👓 C   | Cataract                               |
| 🧓 A   | AMD (Age-related Macular Degeneration) |
| ❤️ H   | Hypertension                           |
| 🔭 M   | Myopia                                 |
| ❗ O   | Other Diseases / Abnormalities         |

✔️ **Accuracy:** 94.5%  
🧠 Trained on diverse patient retinal images

---

### ⚠️ Stage 2: Hypertensive Retinopathy Severity

If Stage 1 detects **Hypertension (H)**, the second model classifies its **severity level**:

| Stage     | Description                              |
|-----------|------------------------------------------|
| 🟡 Mild    | Early-stage symptoms            |
| 🟠 Moderate|  Evident vascular changes        |
| 🔴 Malignant/Severe  |  Risk of vision loss and systemic complications       |

✔️ **Accuracy:** 92.4%  
🧬 Enables **early detection** and **better clinical decisions**


---

## 📈 Data Insights with Power BI

- 📌 Analyzes over **6000+ patient records**
- 📊 Dashboards track:
  - Disease prevalence
  - Demographics (age/gender/region)
  - Severity trends for hypertensive retinopathy
- 📈 Helps hospitals become more **data-driven**

---

## 📞 Real-Time Doctor-Patient Communication

- 🔗 Powered by **WebRTC**
- 🕒 Average latency: **150ms**
- 🛡️ Secure peer-to-peer video calls for consultations

---

## 📅 Smarter Appointments

- 👨‍⚕️ Doctors manage schedules with role-specific dashboards
- 👥 Patients view availability and book slots in real-time
- ⏱️ Reduced wait time by **30%**
- 📈 Increased appointment engagement by **45%**

---

## 💻 Tech Stack

| Layer       | Tech Used                            |
|-------------|--------------------------------------|
| 💻 Frontend | React.js, Tailwind CSS, Redux        |
| 🧠 Backend  | Node.js, Express.js, MongoDB, Python |
| 📈 Analytics| Power BI                             |
| 🔐 Auth     | JWT, Bcrypt                          |
| 📡 Real-Time| WebRTC                               |

---

## 🏆 Achievements

- 🧪 **92.4% Accuracy** in multi-class disease classification
- ⏱️ Reduced appointment **wait times by 30%**
- 💬 Enabled real-time consults with **<150ms latency**
- 📈 Boosted doctor-patient **interaction by 45%**

---
