# FuelFit Student Planner — Setup Guide

Complete setup instructions for running FuelFit locally and deploying to GitHub Pages with Supabase as the backend.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [GitHub & Deployment](#github--deployment)
5. [Architecture Overview](#architecture-overview)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- A free [Supabase](https://supabase.com) account
- A [GitHub](https://github.com) account

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Choose an organization, give the project a name (e.g. `fuelfit`), set a database password, and pick a region.
3. Wait for the project to finish provisioning.

### 2. Get Your API Credentials

1. In the Supabase Dashboard, go to **Settings → API**.
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`).
3. Copy the **anon / public** key (starts with `eyJ...`).

> **Security note:** The `anon` key is safe to ship in client-side code — it's scoped by Row Level Security. The `service_role` key must **never** be committed or exposed to the client.

### 3. Run the Database Migration

1. In the Dashboard, go to **SQL Editor**.
2. Open the file `supabase/migrations/00001_initial_schema.sql` from this repo.
3. Paste the entire contents into the SQL Editor and click **Run**.

This creates the following tables with RLS enabled:

| Table | Purpose |
|-------|---------|
| `profiles` | User profile + preferences (auto-created on signup) |
| `habits` | User's trackable habits |
| `habit_logs` | Daily habit completion records |
| `workouts` | Workout plans (with exercises as JSONB) |
| `meals` | Daily meal entries |
| `weekly_check_ins` | Weekly reflection and feedback |

### 4. Verify Row Level Security

After running the migration, verify RLS is working:

1. Go to **Table Editor** in the Dashboard.
2. Click on each table listed above.
3. Confirm the **RLS** badge shows "Enabled" for every table.
4. Under **Policies**, each table should have 3–4 policies (select, insert, update, and optionally delete) scoped to `auth.uid()`.

### 5. Configure Authentication

1. Go to **Authentication → Providers** in the Dashboard.
2. Ensure **Email** provider is enabled (it is by default).
3. Recommended: Under Email settings, **disable** "Confirm email" for easier local testing. For production, keep it enabled.

### 6. Set Site URL & Redirect URLs

Go to **Authentication → URL Configuration** and set:

| Setting | Value |
|---------|-------|
| **Site URL** | `https://agarcia246.github.io/EntrepreneurshipIndividualProject/` |
| **Redirect URLs** | Add both: |
| | `http://localhost:5173/**` |
| | `https://agarcia246.github.io/EntrepreneurshipIndividualProject/**` |

> The trailing `/**` allows any sub-path under these origins to be used as a redirect destination.

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/agarcia246/EntrepreneurshipIndividualProject.git
cd EntrepreneurshipIndividualProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

For local development, you can optionally override the base path:

```
VITE_BASE_PATH=/
```

### 4. Start the Dev Server

```bash
npm run dev
```

The app runs at `http://localhost:5173`. The UI renders in a mobile-sized frame (430×932px) on desktop. On mobile-width screens it fills the viewport.

### 5. Test the Full Flow

1. The splash screen redirects to onboarding (if not signed in) or `/app` (if signed in).
2. Go through onboarding: select goals → set preferences → create account.
3. On signup, default habits, workouts, and meals are seeded for the user.
4. Explore: Home, Weekly Plan, Workout Plan, Meal Plan, Habit Tracker, Progress, Weekly Check-In, Profile/Settings.
5. Sign out from Settings and sign back in.

---

## GitHub & Deployment

### 1. Push to GitHub

If you haven't already created the repo:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/agarcia246/EntrepreneurshipIndividualProject.git
git branch -M main
git push -u origin main
```

### 2. Add Repository Secrets

The GitHub Actions workflow needs Supabase credentials at build time.

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions**.
2. Add two **Repository secrets**:

| Secret name | Value |
|-------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 3. Enable GitHub Pages

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. That's it — the workflow will handle the rest.

### 4. How Deployment Works

The workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. **Checkout** the code.
2. **Install** dependencies with `npm ci` (cached via `actions/setup-node`).
3. **Build** the Vite app with env vars injected from secrets.
4. **Upload** the `dist/` folder as a Pages artifact.
5. **Deploy** to GitHub Pages via `actions/deploy-pages`.

### 5. Verify the Live Site

After the first successful workflow run, your site is live at:

**https://agarcia246.github.io/EntrepreneurshipIndividualProject/**

### 6. About the Base Path

The Vite config sets `base` to `/EntrepreneurshipIndividualProject/` by default (configurable via `VITE_BASE_PATH` env var). This is required for GitHub Pages project sites where assets are served from a sub-path.

- **GitHub Pages (project site):** `/EntrepreneurshipIndividualProject/` (default)
- **Local dev:** Override with `VITE_BASE_PATH=/` in `.env` if you prefer clean paths
- **Custom domain or user/org site:** Set `VITE_BASE_PATH=/`

### 7. Client-Side Routing

The app uses **`HashRouter`** (URLs look like `https://.../#/app/plan`). This avoids 404 errors on GitHub Pages because the server only sees `index.html` — the hash portion is handled entirely by the browser.

---

## Architecture Overview

```
src/
  lib/
    supabase.ts          — Supabase client singleton
    auth.tsx             — AuthProvider context (session, signUp, signIn, signOut)
    hooks.ts             — Data hooks (useHabits, useWorkouts, useMeals, etc.)
    database.types.ts    — TypeScript types for all tables
  app/
    App.tsx              — AuthProvider + RouterProvider
    routes.tsx           — HashRouter route definitions
    components/
      MainLayout.tsx     — Bottom nav shell
      ProtectedRoute.tsx — Auth guard (redirects to /signup if not signed in)
    screens/             — All page components

supabase/
  migrations/
    00001_initial_schema.sql — Tables, indexes, RLS policies, profile trigger

.github/
  workflows/
    deploy.yml           — CI/CD pipeline for GitHub Pages
```

### Data Flow

- **Auth:** `supabase.auth` handles sign up/in/out. `AuthProvider` wraps the app and provides `useAuth()` hook.
- **Onboarding data** (goals, preferences) is stored in `sessionStorage` during onboarding, then saved to the `profiles` table on signup.
- **Default data** (habits, sample workouts, sample meals) is seeded on first signup via `seedDefaultData()`.
- **All data queries** use the Supabase anon key + RLS, so users can only access their own rows.

---

## Troubleshooting

### Build fails with "Missing VITE_SUPABASE_URL"

The Supabase client checks for env vars at build time. Make sure:
- Locally: `.env` file exists with both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- CI: Both secrets are added in GitHub repo settings (Settings → Secrets → Actions).

### Assets/pages 404 on GitHub Pages

This happens when `base` doesn't match your GitHub Pages URL.

- For project sites (`github.io/<repo>/`), `base` must be `/<repo-name>/`. This is the default.
- For user/org sites (`username.github.io`), set `VITE_BASE_PATH=/`.
- Make sure the Pages source is set to **GitHub Actions** (not "Deploy from branch").

### Auth redirect mismatch / "Invalid redirect URL"

Supabase rejects redirects that aren't in the allow list:

1. Go to **Authentication → URL Configuration** in the Supabase Dashboard.
2. Confirm **Redirect URLs** includes:
   - `http://localhost:5173/**`
   - `https://agarcia246.github.io/EntrepreneurshipIndividualProject/**`
3. The **Site URL** should be `https://agarcia246.github.io/EntrepreneurshipIndividualProject/`.

### Signup works but user sees empty data

The profile trigger and `seedDefaultData()` both run on signup. If data is missing:

1. Check the browser console for Supabase errors.
2. Verify the migration ran successfully (all 6 tables exist).
3. Confirm RLS policies exist — without policies, RLS blocks all access even for authenticated users.
4. Try signing out and creating a fresh account.

### CORS errors in the browser console

Supabase handles CORS automatically. If you see CORS errors:

1. Verify `VITE_SUPABASE_URL` is correct (no trailing slash).
2. Make sure you're not running from `file://` — use the Vite dev server.
3. Check that the Supabase project is active (paused projects reject requests).

### Workflow passes but site doesn't update

1. Check **Settings → Pages** — the environment should show the latest deployment.
2. Hard-refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`) to clear cache.
3. GitHub Pages CDN can take 1–2 minutes to propagate.

### "Email not confirmed" error on login

If email confirmation is enabled in Supabase:

1. Check your email for the confirmation link.
2. Or disable confirmation for testing: **Authentication → Providers → Email → Confirm email → OFF**.
