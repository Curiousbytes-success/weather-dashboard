# Sunidhi Nayak — Portfolio

Next.js (App Router) portfolio. Dark theme, mouse-reactive GLSL shader hero
(vanilla Three.js), terminal/file-directory motif, case-study pages per
project. No backend, no CMS — content lives in `lib/projects.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Push to GitHub, then import the repo on [vercel.com](https://vercel.com) —
zero config needed, it's a standard Next.js app.

## Structure

```
app/
  page.tsx            → home (hero + about teaser + featured work + CTA)
  about/page.tsx       → about, education, skills, certifications, experience
  work/page.tsx         → all projects
  work/[slug]/page.tsx  → case study detail (from lib/projects.ts)
  contact/page.tsx      → contact links + mailto form
  layout.tsx            → fonts, nav, footer
  globals.css            → design tokens + all styles
components/
  Hero.tsx      → shader canvas + typed terminal line (client component)
  Nav.tsx        → responsive nav with mobile toggle
  Reveal.tsx     → scroll-reveal wrapper (IntersectionObserver)
  Footer.tsx
lib/
  projects.ts    → case study content — edit this to add/change projects
```

## To edit content

All project/case-study copy lives in `lib/projects.ts` — add a new object to
the array to add a project, no other file needs to change (the `/work` list
and `/work/[slug]` pages both read from it).
