# Editable Portfolio Content via Lovable Cloud Database

## Goal
Move portfolio content out of hardcoded files into a database so you can add/edit/remove items yourself from a password-protected admin page — no code changes needed for content updates.

## What changes

### 1. Database tables (migrations, with GRANTs + RLS)
- `site_content` — key/value rows for editable text (hero tagline, about paragraphs, email, university, skills list, education entry)
- `projects` — title, year, summary, tags (array), link, sort order, published flag
- `blog_posts` — title, slug, body, published flag, created date (makes the Blog section real)
- Public read policies (`TO anon SELECT`) limited to published rows; writes restricted to authenticated admin.
- Owner-scoped read policy so you can see drafts in admin.

### 2. Auth (email + password, single admin = you)
- `/auth` sign-in page.
- Admin routes live under `_authenticated/` so only signed-in users can reach them.

### 3. Admin panel (`/admin`)
- Edit site text (tagline, about, email, skills) via a simple form.
- Projects: list, add, edit, delete, toggle published.
- Blog posts: list, add, edit, delete, publish/unpublish.
- All writes go through authenticated server functions (`requireSupabaseAuth`).

### 4. Public page reads from the database
- Home page sections (About, Skills, Projects, Education, Contact) read `site_content`/`projects` via public server functions with graceful fallbacks to the current hardcoded content if the database is unreachable.
- Blog section lists published posts; empty state stays when there are none.

### 5. Vercel deployment note
- Self-hosting on Vercel requires following Lovable's self-hosting guide (env vars for Supabase URL + publishable key). The database itself stays on Lovable Cloud and works the same regardless of where the frontend is hosted.

## Technical details
- Server fns in `src/lib/content.functions.ts` (public reads) and `src/lib/admin.functions.ts` (authed writes).
- Public reads use publishable-key client with narrow `TO anon` SELECT policies; admin writes use `requireSupabaseAuth`; bearer attached via existing `functionMiddleware` in `src/start.ts`.
- Home page keeps current design/motion — only the data source changes.
- `head()` metadata unchanged.

## Verification
- Sign in, add/edit a project and a blog post in `/admin`, confirm they appear on the public page; delete one and confirm it disappears; sign out and confirm `/admin` redirects to `/auth`.
