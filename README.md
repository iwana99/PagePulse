# 🚀 PagePulse

**PagePulse** is a full-stack MERN application for automated website monitoring.
It periodically checks web pages for content changes, stores historical snapshots, compares previous versions, and instantly notifies users by email when significant changes are detected.

---

# ✨ Why PagePulse?

✅ Automatically monitors any public website

✅ Detects text changes between page versions

✅ Stores historical snapshots for comparison

✅ Configurable monitoring intervals

✅ Email notifications when content changes exceed a custom threshold

✅ Secure URL validation to prevent SSRF attacks

✅ Background job processing using BullMQ

✅ Playwright-powered browser automation for reliable page capture

✅ REST API built with Express & MongoDB

✅ Modern React frontend with Zustand state management

---

# 📸 Features

- Create website monitors
- Configure monitoring interval
- Automatic background checks
- Website snapshot history
- Text comparison between snapshots
- Percentage change calculation
- Email notifications
- Secure URL validation
- Responsive React UI

---

# 🏗 Architecture

```
                React + Zustand
                      │
                      ▼
               Express REST API
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
    MongoDB                  BullMQ Queue
         │                         │
         ▼                         ▼
     Monitors               Background Workers
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
       Playwright Capture                     Email Notification
             │
             ▼
      Text Comparison
             │
             ▼
        Snapshot Storage
```

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- Zustand
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Background Processing

- BullMQ
- Redis

## Browser Automation

- Playwright

## Notifications

- Nodemailer

---

# 🔒 Security

PagePulse validates every submitted URL before monitoring.

Security includes:

- SSRF protection
- Public URL validation
- Safe redirect handling

---

# 📊 Monitoring Workflow

```
User creates monitor
        │
        ▼
Monitor stored in MongoDB
        │
        ▼
BullMQ schedules periodic checks
        │
        ▼
Playwright loads website
        │
        ▼
Extract page text
        │
        ▼
Compare with previous snapshot
        │
        ▼
Calculate percentage of change
        │
        ▼
Store new snapshot
        │
        ▼
Threshold exceeded?
      │         │
     No        Yes
      │         │
      ▼         ▼
 Continue   Send Email Notification
```

---

# 📂 Project Structure

```
client/
├── components/
├── pages/
├── hooks/
├── lib/
└── assets/

server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── workers/
├── services/
├── queues/
└── utils/
```

---

# 🚀 Installation

## Clone repository

```bash
git clone https://github.com/yourusername/pagepulse.git
```

## Install backend

```bash
cd server
npm install
```

## Install frontend

```bash
cd client
npm install
```

## Start Redis

```bash
redis-server
```

## Run backend

```bash
npm run dev
```

## Run frontend

```bash
npm run dev
```

---

# 📬 API Overview

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/monitor/createMonitor | Create monitor |
| GET | /api/monitor/getAll | Get all monitors |
| GET | /api/monitor/:id/snapShots | Get monitor snapshots |
| DELETE | /api/monitor/:id | Delete monitor |

---

# 🎯 Future Improvements

- Dashboard analytics
- WebSocket real-time updates
- Export snapshot history
- Monitoring statistics
