<div align="center">

<img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/Real--Time-Socket.IO-black?style=for-the-badge&logo=socket.io&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Live-green?style=for-the-badge&logo=vercel&logoColor=white" />

# 🎓 Placement Tracker

### An AI-Powered Campus Placement Management Platform

**[🚀 Live Demo](https://placement-tracker-flame.vercel.app)** · **[📦 Backend API](https://placement-tracker-api-jokf.onrender.com)**

> Built with MERN Stack · AI Resume Matching · Real-Time Notifications · Analytics Dashboard

</div>

---

## ✨ What Makes This Different

Most placement management systems are just spreadsheets in disguise. This one isn't.

- **AI analyzes your resume** against job descriptions and tells you exactly what's missing
- **Status updates arrive in real-time** — no refreshing, no waiting
- **Server-side eligibility engine** that can't be bypassed from the frontend
- **Three completely separate role dashboards** — Student, TPO, and Company HR
- **Production deployed** with live demo you can use right now

---

## 🖥️ Screenshots

| Login | Student Dashboard | AI Resume Match |
|-------|------------------|-----------------|
| Split-panel auth with demo credentials | Browse drives with eligibility check | Upload PDF → Get AI analysis |

| TPO Dashboard | Analytics | Real-time Toast |
|--------------|-----------|-----------------|
| Manage all placement drives | Charts.js placement stats | Live Socket.IO notifications |

---

## 🧠 Core Features

### 🤖 AI Resume Matching (Powered by Groq + Llama 3.3 70B)
Upload your resume PDF against any job drive and get:
- **Match Score** (0–100%)
- **Matched Skills** — what you already have
- **Missing Skills** — what to add before applying
- **Strengths** — what stands out in your profile
- **Actionable Suggestions** — specific improvements

> Resume text is extracted server-side using `pdf-parse`, then analyzed by Llama 3.3 70B via Groq API. Zero cost, sub-2-second response.

### ⚡ Real-Time Notifications (Socket.IO)
When a TPO updates a student's application status:
- Student receives a **live toast notification** instantly
- No page refresh required
- Color-coded by status (green = selected, yellow = shortlisted, purple = interview)
- Auto-dismisses after 5 seconds with a progress bar

> Each student joins a private Socket.IO room using their user ID on login. The server emits directly to that room on status change.

### 🔐 Server-Side Eligibility Engine
Students can't bypass eligibility requirements — the check happens on the backend:
- **CGPA threshold** — rejected if below minimum
- **Branch filter** — rejected if branch not in allowed list
- **Backlog limit** — rejected if backlogs exceed maximum
- Returns specific rejection reasons (`"Minimum CGPA required: 7.5"`)

### 👥 Role-Based Access Control
Three completely isolated user experiences:

| Role | Capabilities |
|------|-------------|
| **Student** | Browse drives, AI resume match, apply, track application status |
| **TPO Admin** | Create/manage drives, view all applicants, update round status, analytics |
| **Company HR** | Post drives, shortlist candidates, issue offer letters |

Single JWT auth system with Express middleware that gates every protected route by role.

### 📊 Analytics Dashboard
TPO gets a real-time analytics view with:
- Placement rate percentage
- Application status breakdown (Doughnut chart)
- Applications by branch (Bar chart)
- Company-wise recruitment stats with conversion rate progress bars

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React 18 + Vite | UI framework with fast HMR |
| React Router v6 | Client-side routing with protected routes |
| Axios | HTTP client with auth interceptors |
| Socket.IO Client | Real-time bidirectional communication |
| Charts.js + react-chartjs-2 | Analytics visualizations |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database with schema validation |
| Socket.IO | WebSocket server for real-time events |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| Multer | PDF file upload handling |
| pdf-parse | Server-side PDF text extraction |
| Groq SDK | AI inference (Llama 3.3 70B) |
| Nodemailer | Email notifications |

### Infrastructure
| Service | Usage |
|---------|-------|
| MongoDB Atlas | Cloud database |
| Render | Backend hosting (Node.js) |
| Vercel | Frontend hosting (React/Vite) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│         (Vercel — placement-tracker.vercel.app)      │
└─────────────────┬───────────────────────────────────┘
                  │ REST API + WebSocket
┌─────────────────▼───────────────────────────────────┐
│              Express REST API                        │
│         (Render — placement-tracker-api.onrender.com)│
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ JWT Auth │  │ Role     │  │ Eligibility Engine │ │
│  │ Middleware│  │ Middleware│  │ (Server-side)      │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │Socket.IO │  │pdf-parse │  │ Groq AI API        │ │
│  │(Real-time)│  │(PDF→Text)│  │ (Llama 3.3 70B)   │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              MongoDB Atlas                           │
│   Users · Drives · Applications · OfferLetters      │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
placement-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Register, login
│   │   ├── drive.controller.js      # CRUD for placement drives
│   │   ├── application.controller.js # Apply, status update, analytics
│   │   └── match.controller.js      # AI resume matching
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verify + role guard
│   │   └── upload.middleware.js     # Multer PDF upload
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Drive.model.js
│   │   ├── Application.model.js
│   │   └── OfferLetter.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── drive.routes.js
│   │   ├── application.routes.js
│   │   └── match.routes.js
│   └── server.js                    # Express + Socket.IO setup
│
└── frontend/
    └── src/
        ├── api/                     # Axios API functions
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ResumeMatch.jsx      # AI match modal
        │   └── Toast.jsx            # Real-time notifications
        ├── context/
        │   └── auth.context.jsx
        └── pages/
            ├── auth/                # Login, Register
            ├── student/             # DriveList, MyApplications
            └── tpo/                 # Dashboard, Analytics, DriveApplicants
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)

### Backend Setup
```bash
git clone https://github.com/akshatsahay21/placement-tracker.git
cd placement-tracker/backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE=http://localhost:5000
```

```bash
npm run dev
```

Open `http://localhost:5173`

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Student | akshat@test.com | 123456 |
| TPO Admin | tpo@test.com | 123456 |

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Drives
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/drives` | All roles |
| POST | `/api/drives` | TPO only |
| PUT | `/api/drives/:id` | TPO only |
| DELETE | `/api/drives/:id` | TPO only |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications/apply/:driveId` | Student |
| GET | `/api/applications/my` | Student |
| GET | `/api/applications/drive/:driveId` | TPO, Company |
| PUT | `/api/applications/:id/status` | TPO, Company |
| GET | `/api/applications/analytics` | TPO |

### AI Resume Match
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/match/:driveId` | Student |

---

## 💡 Key Engineering Decisions

**Why server-side eligibility check?**
Frontend validation can be bypassed with direct API calls. The eligibility engine runs exclusively on the backend, making it impossible to circumvent regardless of how the request is made.

**Why Groq instead of OpenAI?**
Groq's free tier provides access to Llama 3.3 70B with no credit card required and sub-2-second inference times — better performance than GPT-3.5 for structured JSON extraction tasks, at zero cost.

**Why Socket.IO rooms instead of broadcasting?**
Each student joins a private room keyed to their MongoDB `_id`. Status update events are emitted only to the relevant room, preventing data leakage between users.

**Why separate Render + Vercel instead of one service?**
Render is optimized for persistent Node.js servers (required for Socket.IO). Vercel is optimized for static React builds with global CDN. Using each for what it's built for gives better performance than a single service.

---

## 👨‍💻 Author

**Akshat Sahay**
BTech CSE · 6th Semester

[![GitHub](https://img.shields.io/badge/GitHub-akshatsahay21-black?style=flat&logo=github)](https://github.com/akshatsahay21)

---

<div align="center">

**If this project helped you or impressed you, drop a ⭐**

*Built from scratch in one sitting — no tutorials, no boilerplate*

</div>
