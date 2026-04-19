# Training and Placement Management System

A full-stack campus recruitment platform built with React, Vite, Express, and MongoDB. The project provides separate experiences for students, companies, and administrators, along with a public jobs portal and seeded demo data for local development.

## Overview

This repository is organized as a small monorepo:

- `Frontend/` contains the React client.
- `Backend/` contains the Express API, MongoDB models, seed scripts, and auth logic.
- The root `package.json` coordinates both apps for local development.

The current implementation focuses on:

- student registration, login, profile management, and eligibility-based job discovery
- company registration, login, job posting, job management, and automatic shortlist generation
- admin login and a central eligibility dashboard
- public browsing of active job listings

## Core Features

### Public Portal

- Home page with platform stats, latest jobs, and featured companies
- Public jobs listing with search and filtering
- Job details page for individual openings

### Student Module

- Student registration and login
- Protected student dashboard
- Profile creation and update flow
- Eligibility-aware job recommendations based on:
  - branch
  - CGPA
  - backlog count
  - graduation year
  - skill match percentage
- Direct job application action from the student portal

### Company Module

- Company registration and login
- Company dashboard with hiring stats
- Create, update, and delete job posts
- View company-owned jobs
- Automatic eligible-student shortlist for each job
- Skill-based ranking for shortlisted candidates

### Admin Module

- Admin login using environment-based credentials
- Central eligibility dashboard across all active jobs
- Per-job view of shortlisted students and matching skill data

## Eligibility and Shortlisting Logic

The backend includes a shared eligibility engine in [`Backend/services/job.service.js`](</d:/Training and Placement/Backend/services/job.service.js:1>).

It evaluates each student against a job using:

- allowed branches
- minimum CGPA
- maximum backlogs
- graduation year rules
- skill overlap between job skills and student profile skills

Only students with more than 50% skill match and valid academic criteria are shortlisted. The current shortlist threshold is `51%`.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs password hashing
- cookie-parser
- cors
- dotenv

## Project Structure

```text
Training and Placement/
|-- Backend/
|   |-- config/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- tests/
|   |-- utils/
|   |-- server.js
|   |-- seed.js
|   `-- seed.realworld.js
|-- Frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- utils/
|   `-- package.json
`-- package.json
```

## Available Routes

### Frontend Routes

- `/` - landing page
- `/jobs` - public jobs page
- `/jobs/:id` - public job details
- `/student/login`
- `/student/register`
- `/student/dashboard`
- `/student/profile`
- `/student/jobs`
- `/student/apply/:jobId`
- `/company/login`
- `/company/register`
- `/company/dashboard`
- `/company/post-job`
- `/company/jobs`
- `/company/applicants`
- `/admin/login`
- `/admin/dashboard`

### Backend API Routes

#### Company

- `POST /api/company/register`
- `POST /api/company/login`
- `GET /api/company/all`

#### Student

- `POST /api/student/register`
- `POST /api/student/login`
- `GET /api/student/me`
- `GET /api/student/me/profile`
- `POST /api/student/profile`
- `POST /api/student/save-profile`

#### Jobs

- `GET /api/jobs/count`
- `GET /api/jobs/public`
- `GET /api/jobs/public/:id`
- `POST /api/jobs/apply`
- `GET /api/jobs/eligible-for-me`
- `GET /api/jobs/my-jobs`
- `GET /api/jobs/:jobId/eligible-students`
- `GET /api/jobs/company/:companyId`
- `POST /api/jobs`
- `DELETE /api/jobs/:jobId`
- `GET /api/jobs/:id`

#### Stats

- `GET /api/stats/company-count`
- `GET /api/stats/:companyId`

#### Admin

- `POST /api/admin/login`
- `GET /api/admin/eligibility-overview`

## Local Development

### Prerequisites

- Node.js 20+ recommended
- npm
- MongoDB running locally or a reachable MongoDB URI

### 1. Install dependencies

From the project root:

```bash
npm install
npm run install-all
```

If you prefer installing packages manually:

```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 2. Configure environment variables

Create or update `Backend/.env` with values like:

```env
MONGO_URL=mongodb://localhost:27017/training-placement
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=3000

# Optional, but required for admin login
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$10$replace_with_a_real_bcrypt_hash
```

Notes:

- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are required for student and company auth.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` are required only if you want admin login to work.
- The backend loads `Backend/.env` explicitly, so it works even when started from the repository root.

### 3. Generate an admin password hash

Run this inside `Backend/`:

```bash
node --input-type=module -e "import bcrypt from 'bcryptjs'; bcrypt.hash('admin123', 10).then(console.log)"
```

Copy the generated hash into `ADMIN_PASSWORD_HASH`.

### 4. Start the application

From the project root:

```bash
npm run dev
```

This starts:

- the backend on `http://localhost:3000`
- the frontend Vite dev server on its default Vite port

You can also start each app separately:

```bash
cd Backend && npm run dev
cd Frontend && npm run dev
```

## Seed Data

Two backend seed scripts are included.

### Fresh Demo Dataset

```bash
npm run seed:fresh
```

This seeds:

- 4 companies
- 8 jobs
- 8 students with profiles

### Real-World Style Dataset

```bash
npm run seed:realworld
```

This seeds:

- 5 companies
- 10 jobs
- 12 students with profiles

Both seed scripts use the MongoDB connection from `Backend/.env`.

### Seeded Login Passwords

For seeded students and companies, the default password is:

```text
password123
```

Admin credentials are not seeded. They must be configured via environment variables.

## Scripts

### Root

- `npm run dev` - run backend and frontend together
- `npm run install-all` - install dependencies for root, backend, and frontend
- `npm run seed:fresh` - run `Backend/seed.js`
- `npm run seed:realworld` - run `Backend/seed.realworld.js`

### Backend

- `npm run dev` - start Express with nodemon
- `npm start` - start Express with Node
- `npm run seed:fresh` - seed the demo dataset
- `npm run seed:realworld` - seed the expanded dataset

### Frontend

- `npm run dev` - start Vite
- `npm run build` - build the production bundle
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Authentication Model

- Student and company logins return JWT-based access and refresh tokens.
- The frontend stores the authenticated user payload in `localStorage`.
- Axios automatically attaches the bearer token from `localStorage` to API requests.
- Some student auth logic still supports cookie-based access token fallback for older flows.
- Admin authentication is token-based and validated against the configured admin email.

## Important Implementation Notes

- The frontend API client is currently hardcoded to `http://localhost:3000/api` in [`Frontend/src/services/api.js`](</d:/Training and Placement/Frontend/src/services/api.js:1>). If you change the backend port or deploy this app, update that file or replace it with an environment-based API URL.
- Admin login returns a `503` response if `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` are not configured.
- The project includes some unfinished or placeholder flows, such as the student applications page, so the portal is functional for core role-based flows but not yet fully production-complete.

## Recommended Next Improvements

- Move frontend API base URL to Vite environment variables
- Add a persistent application model instead of only incrementing job application counts
- Add tests for auth, eligibility filtering, and job workflows
- Add role-based logout/token refresh flow
- Add deployment-ready production configuration
- Add `.env.example` files for frontend and backend

## License

This repository currently does not declare a project-specific license.
