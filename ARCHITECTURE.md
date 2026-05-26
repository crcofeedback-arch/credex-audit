\# Architecture



\## System Diagram

```mermaid

graph TD

&#x20;   A\[User] --> B\[Next.js Frontend]

&#x20;   B --> C\[Spend Form + LocalStorage]

&#x20;   C --> D\[Audit Engine]

&#x20;   D --> E\[Results Page]

&#x20;   E --> F\[Email Capture]

&#x20;   F --> G\[Supabase Database]

&#x20;   E --> H\[Shareable URLs]

&#x20;   H --> I\[Vercel Hosting]

&#x20;   E --> J\[Google Gemini API]

