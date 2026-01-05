# Multi-Tenant SaaS Task Management Platform
A multi-tenant SaaS task management platform where organizations (tenants) can manage projects, users, and tasks with strict data isolation per tenant.
Target audience: small and medium teams that need a hosted task/project management tool with role-based access control.
​

### Features
Tenant registration and onboarding with a dedicated tenant admin.
​

Super admin panel to manage tenants, plans, and statuses.
​

Role-based access control: super admin, tenant admin, regular user.
​

User management per tenant (create, update, deactivate users).
​

Project management (create projects, assign to tenants).
​

Task management with priorities, assignees, and due dates.
​

Task status workflow (todo, in-progress, completed).
​

Tenant-scoped dashboards and statistics (projects, tasks, users).
​

JWT-based authentication with secure password hashing.
​

Health check endpoint for uptime monitoring.
​

### Technology Stack
#### Frontend
React 18.x

Vite 5.x / 7.x (React template)
​

React Router 6.x

#### Backend
Node.js 20.x

Express 5.2.1

Prisma ORM 6.19.1

@prisma/client 6.19.1

JSON Web Token 9.0.3

bcryptjs 3.0.3

express-validator 7.3.1

pg 8.16.3

#### Database
PostgreSQL (Render managed instance)
​

Deployment / Containerization
Docker (optional for local)
​

Backend: Render Web Service (https://multi-tenant-saas-task5.onrender.com)
​

Frontend: Netlify (https://rainbow-medovik-7ab6fd.netlify.app)
​

### Architecture Overview
The application follows a frontend–backend–database architecture:

React/Vite frontend communicates with the backend using REST APIs.

Node/Express backend exposes /api/... endpoints, applies authentication, authorization, and tenant isolation middleware.

Prisma connects to a single PostgreSQL database; tenant-specific tables include a tenantId column to enforce data isolation.
​

Include an architecture diagram image at docs/system-architecture.png


![Architecture Diagram](docs/system-architecture.png)
Installation & Setup (Local)
Prerequisites
Node.js 18+

npm

PostgreSQL running locally

### Git

#### 1. Clone Repository
bash
git clone https://github.com/Dhanasirikoppisetti/multi_tenant_saas_task5
cd multi_tenant_saas_task5
#### 2. Backend Setup
bash
cd backend
npm install
Create backend/.env:


DATABASE_URL=postgresql://<user>:<password>@localhost:5432/multi_tenant_saas_task5
JWT_SECRET=your-local-jwt-secret
NODE_ENV=development
PORT=5000
Generate Prisma client and run migrations:


npx prisma generate
npx prisma migrate dev
node prisma/seed.js    # or npm run seed if you add a script
Start backend:


npm run dev    # backend on http://localhost:5000
#### 3. Frontend Setup

cd ../frontend
npm install
Create frontend/.env:

VITE_API_URL=http://localhost:5000
Start frontend:


npm run dev    # typically http://localhost:3000
Environment Variables
Backend
DATABASE_URL – PostgreSQL connection string used by Prisma.
​

JWT_SECRET – secret key used to sign JWT tokens.

NODE_ENV – development or production.

PORT – port for Express app (5000 locally; Render injects its own).
​

Frontend
VITE_API_URL – base URL for backend API

Local: http://localhost:5000

Production: https://multi-tenant-saas-task5.onrender.com
​

### API Documentation
Full API documentation is available in docs/API.md (or Swagger/Postman collection if you choose that). It includes:

All 19 API endpoints with method, URL, auth requirement.

Request/response examples for authentication, tenant, user, project, and task APIs.

Explanation of JWT authentication and how tokens are used in Authorization: Bearer <token> header.
​

### Deployment
#### Backend – Render
Root directory: backend

 Build command:


npm install && npx prisma generate
Start command:


npm start
Environment variables (Render dashboard → Environment):


DATABASE_URL=<Render internal DB URL>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=5000
After first successful deploy, run from Render Shell:


npx prisma migrate deploy
node prisma/seed.js
​

#### Frontend – Netlify
Base directory: frontend

Build command: npm run build

Publish directory: dist

Environment variables (Netlify Site settings → Environment):

VITE_API_URL=https://multi-tenant-saas-task5.onrender.com
Deploy; production URL (example): https://rainbow-medovik-7ab6fd.netlify.app.
​

### Demo Credentials
These credentials are used both in prisma/seed.js and submission.json so evaluators can test the app.
​

Super Admin

Email: superadmin@system.com

Password: Admin123

Role: super_admin

Tenant Admin (Demo Company)

Tenant: Demo Company (subdomain: demo)

Email: admin@demo.com

Password: Demo123!

Role: tenant_admin

Sample Users

user1@demo.com / User123! (role: user)

user2@demo.com / User123! (optional)

These accounts are used in automated tests and for manual demo of multi-tenant behavior.

### Demo Video
A complete demo video (architecture, multi-tenancy explanation, and feature walkthrough) is available on YouTube:

Video link: https://youtu.be/<your-video-id>