```markdown
# 🤖 AI Spend Auditor

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com/)

**Free tool to audit your AI tool spending across 8+ platforms.**  
Get instant savings recommendations, AI‑powered summaries, and shareable audit reports.

🔗 **Live Demo:** [https://credex-audit.vercel.app](https://credex-audit.vercel.app)

---

## 📸 Screenshots

| Form | Results | Shareable URL |
|------|---------|----------------|
| ![Form](screenshot1.png) | ![Results](screenshot2.png) | ![Share URL](screenshot3.png) |

---

## ✨ Features

- **8+ AI tools supported** – ChatGPT, Claude, Midjourney, Copilot, Gemini, Perplexity, and more.
- **Smart audit engine** – Compares your spending against benchmarks & detects overuse.
- **💰 Savings recommendations** – Actionable tips to reduce monthly AI costs.
- **📧 Email capture + Supabase storage** – Store audits and follow up with users.
- **🔗 Shareable result URLs** – Each audit gets a unique, permanent link.
- **🤖 AI‑generated summary** – Powered by Google Gemini for human‑readable insights.
- **Responsive & fast** – Built with Tailwind CSS and Next.js App Router.

---

## 🧰 Tech Stack

| Category       | Tools |
|----------------|-------|
| Framework      | Next.js 16 (App Router) |
| Language       | TypeScript |
| Styling        | Tailwind CSS |
| Database & Auth| Supabase (PostgreSQL) |
| Emails         | Resend |
| AI Summaries   | Google Gemini API |
| Deployment     | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn/bun
- A Supabase project (free tier works)
- Google Gemini API key
- Resend API key (for email features)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/ai-spend-auditor.git
cd ai-spend-auditor

# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
https://credex-audit-lvjd.vercel.app/

---

## 🗄️ Database Setup (Supabase)

Create the following table in your Supabase SQL editor:

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  data JSONB NOT NULL,
  share_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index on share_id for fast lookups
CREATE INDEX idx_audits_share_id ON audits(share_id);
```

The `share_id` is a unique slug (e.g., `abc123`) used for public result pages.

---

## 📡 API Routes (Optional)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/audit` | POST | Accepts user spending data, runs audit logic, stores in Supabase, returns share ID and AI summary. |
| `/api/audit/[shareId]` | GET | Retrieves a stored audit result by share ID. |
| `/api/send-email` | POST | Sends a follow‑up email with the audit results (via Resend). |

---

## 🌍 Deployment on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into Vercel.
3. Add the same environment variables from `.env.local` in the Vercel dashboard.
4. Deploy – your app will be live in seconds.

Vercel automatically detects Next.js and optimizes the build.

---

## 🧪 Usage Guide

1. **Enter your monthly spend** for each AI tool (or leave as 0).
2. Click **“Audit My Spending”** – the engine compares your input against average usage data.
3. View your **custom savings recommendations** and an **AI‑generated summary**.
4. Provide your email (optional) to save the report and receive a follow‑up.
5. **Share your unique audit URL** with colleagues or consultants.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-idea`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-idea`).
5. Open a Pull Request.

---

## 📄 License

This project is open‑source under the **MIT License**.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Resend](https://resend.com/)
- [Google Gemini API](https://deepmind.google/technologies/gemini/)

---

Built with ❤️ by [Credex](https://credex-audit.vercel.app)
```
