# 🎓 CampusLife OS

> **The Operating System for Campus Life.**  
> A modern, student-first platform to organize events, clubs, and complaints—replacing WhatsApp chaos with a unified digital experience.

![Status](https://img.shields.io/badge/Status-MVP%20Phase%201-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Supabase%20%7C%20Tailwind-blueviolet)

---

## 🚀 The Problem
Indian colleges run on "Shadow IT"—a chaotic mix of WhatsApp groups, lost Google Forms, and physical notices.
*   **Students** miss events because details get buried in chats.
*   **Clubs** struggle to manage registrations and member data.
*   **Admins** lack visibility into student engagement and safety issues.

**CampusLife OS** solves this by acting as a single layer of truth for the entire campus ecosystem.

---

## ✨ Key Features (Phase 1)

### 🔐 Authentication & Security
*   **Supabase Auth:** Secure Sign-up/Login with Email & Password.
*   **Role-Based Access:** Database schemas designed for Students, Club Admins, and College Admins.
*   **Row Level Security (RLS):** Data privacy enforced at the database level.

### 📅 Event Management
*   **Dynamic Feed:** Real-time event fetching from Supabase.
*   **Smart Filters:** Filter by Category (Tech, Cultural, Sports) and Search.
*   **Rich UI:** "Linear-style" design with Framer Motion animations and skeleton loading states.

### 🎨 Modern UI/UX
*   **Dashboard Layout:** Responsive sidebar navigation with collapsible states.
*   **Micro-interactions:** Smooth hover effects and transitions.
*   **Club Discovery:** Browse active clubs and committees (UI).
*   **Anonymous Complaints:** UI for safe, anonymous reporting (Privacy-first design).

---

## 🛠️ Tech Stack

**Frontend:**
*   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)

**Backend:**
*   **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Auth:** Supabase Auth
*   **Storage:** Supabase Storage (Planned for images)

---

## ⚡ Getting Started locally

Follow these steps to set up the project on your local machine.

### Prerequisites
*   Node.js (v18+)
*   npm or bun

