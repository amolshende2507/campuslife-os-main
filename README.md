# 🎓 CampusLife OS

**The Operating System for Modern Campus Life.**

CampusLife OS is a full-stack, multi-tenant SaaS platform designed to digitize the chaotic administrative processes of college campuses. It replaces fragmented WhatsApp groups and Google Forms with a unified, role-based dashboard for Students, Club Leaders, and Faculty.


---

## ✨ Key Features

### 🔐 Role-Based Access Control (RBAC)
*   **Students:** View events, join clubs, submit anonymous complaints, download notes.
*   **Club Admins:** Create events, manage memberships, scan QR tickets.
*   **Faculty:** Oversee all campus activity, resolve complaints, approve clubs, view analytics.

### 📅 Event Management & Ticketing
*   **QR Code Integration:** Students get a unique digital ticket upon registration.
*   **Scanner Mode:** Admins use their device camera to scan tickets and verify attendance in real-time.
*   **Duplicate Prevention:** System rejects tickets that have already been scanned.

### 🛡️ Secure & Anonymous Complaints
*   **Safety First:** Students can report ragging or infrastructure issues without revealing their identity.
*   **Resolution Workflow:** Admins can track status (Submitted → In Review → Resolved).

### 📂 Academic Vault & Resources
*   **File Sharing:** Centralized repository for Notes, PYQs, and Assignments.
*   **Smart Filters:** Filter by Branch and Year.
*   **Moderation:** Admins can remove inappropriate uploads.

### 🕵️ Lost & Found
*   **Community Board:** Post lost items with photos.
*   **Direct Contact:** One-click WhatsApp integration to contact the finder.

---

## 🛠️ Tech Stack

**Frontend:**
*   **React + Vite:** Lightning fast build tool and UI library.
*   **TypeScript:** For type safety and robust code.
*   **Tailwind CSS:** For modern, responsive styling.
*   **Framer Motion:** For smooth animations and micro-interactions.
*   **Shadcn/UI:** For accessible, high-quality components.

**Backend (BaaS - Supabase):**
*   **PostgreSQL:** Relational database with complex foreign key relationships.
*   **Row Level Security (RLS):** Ensures data isolation between different colleges (Multi-Tenancy).
*   **Supabase Auth:** Secure email/password authentication.
*   **Supabase Storage:** S3-compatible storage for Event Posters and Profile Pictures.

---

## 📸 Screenshots

| Student Dashboard | Event Ticketing |
|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* |

| Admin Analytics | Lost & Found |
|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* |

---

## ⚙️ Installation & Local Setup

Follow these steps to run the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/campus-life-os.git
    cd campus-life-os
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Supabase keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## 🗄️ Database Setup (Supabase)

This project relies on a specific SQL schema. If you are forking this, you need to run the following SQL scripts in your Supabase SQL Editor:

1.  **Enable Tables:** Create `profiles`, `events`, `clubs`, `complaints`, `announcements`, `lost_items`, `resources`.
2.  **Enable Storage:** Create buckets for `events`, `avatars`, `lost-found`, `academic-files`.
3.  **Enable RLS:** Apply policies found in `supabase_schema.sql` (if provided) to ensure data security.

---

## 🔒 Security Note (For Recruiters/Evaluators)

**Admin Access:**
To facilitate easy testing of Role-Based features without a backend approval process, this MVP uses client-side secret codes during signup:
*   **Faculty Code:** `ADMIN123`
*   **Club Lead Code:** `CLUB123`

*In a production environment, this role assignment logic would be moved to a Supabase Edge Function to prevent client-side inspection.*

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature enhancements.

## 📄 License

This project is licensed under the MIT License.
