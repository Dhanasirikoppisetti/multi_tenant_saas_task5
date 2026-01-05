
# Multi-Tenant SaaS Task Management Platform

A multi-tenant SaaS task management platform where organizations (tenants) can manage projects, users, and tasks with strict data isolation per tenant.  
Target audience: small and medium teams that need a hosted task/project management tool with role-based access control.

---

## Features

- Tenant registration and onboarding with a dedicated tenant admin.
- Super admin panel to manage tenants, plans, and statuses.
- Role-based access control: super admin, tenant admin, regular user.
- User management per tenant (create, update, deactivate users).
- Project management (create projects, assign to tenants).
- Task management with priorities, assignees, and due dates.
- Task status workflow (todo, in-progress, completed).
- Tenant-scoped dashboards and statistics (projects, tasks, users).
- JWT-based authentication with secure password hashing.
- Health check endpoint for uptime monitoring.

---

## Technology Stack

### Frontend

- React 18.x
- Vite 5.x / 7.x (React template)
- React Router 6.x

### Backend

- Node.js 20.x
- Express 5.2.1
- Prisma ORM 6.19.1
- @prisma/client 6.19.1
- JSON Web Token 9.0.3
- bcryptjs 3.0.3
- express-validator 7.3.1
- pg 8.16.3

### Database

- PostgreSQL (local instance)

### Containerization (Optional)

- Docker + Docker Compose (for running backend, frontend, and Postgres locally in containers)

---

## Architecture Overview

The application follows a frontend–backend–database architecture:

- React/Vite frontend communicates with the backend using REST APIs.
- Node/Express backend exposes `/api/...` endpoints, applies authentication, authorization, and tenant isolation middleware.
- Prisma connects to a single PostgreSQL database; tenant-specific tables include a `tenantId` column to enforce data isolation.

(Optionally, you can include an architecture diagram at `docs/system-architecture.png`.)

---

## Installation & Setup (Local)

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL running locally
- (Optional) Docker and Docker Compose, if you want to run everything in containers.

### 1. Clone Repository


git clone https://github.com/Dhanasirikoppisetti/multi_tenant_saas_task5
cd multi_tenant_saas_task5
### 2. Backend Setup (without Docker)
bash
cd backend
npm install
Create backend/.env:


DATABASE_URL=postgresql://postgres:Dhanasiri.18@localhost:5432/multi_tenant_saas_task5
JWT_SECRET=your-local-jwt-secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
Generate Prisma client and run migrations:


npx prisma generate
npx prisma migrate dev
node prisma/seed.js    # or npm run seed if you add a script
Start backend:


npm run dev    # backend on http://localhost:5000

### 3.Frontend Setup (without Docker)

cd ../frontend
npm install
Create frontend/.env:

VITE_API_URL=http://localhost:5000
Start frontend:


npm run dev    # app on http://localhost:3000
Open http://localhost:3000 in your browser and log in with the demo credentials below.

Running with Docker (Optional)
If you prefer Docker for local development:

From the project root (multi_tenant_saas_task5), ensure docker-compose.yml is configured to expose ports (for example: frontend 3000, backend 5000, database 5432).

Create a .env file for the backend (or use Docker env vars) with values similar to:


DATABASE_URL=postgresql://postgres:Dhanasiri.18@localhost:5432/multi_tenant_saas_task5
JWT_SECRET=your-local-jwt-secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
### Build and start containers:

docker compose build
docker compose up -d
Frontend: http://localhost:3000

Backend: http://localhost:5000

### Postgres: exposed via the database service in Docker Compose

If needed, run migrations and seed inside the backend container:

docker compose exec backend npx prisma migrate dev
docker compose exec backend node prisma/seed.js
Environment Variables
### Backend
DATABASE_URL – PostgreSQL connection string used by Prisma.

JWT_SECRET – secret key used to sign JWT tokens.

JWT_EXPIRES_IN – token lifetime, e.g. 24h.

NODE_ENV – usually development for local.

PORT – port for Express app (5000).

FRONTEND_URL – frontend origin for CORS, e.g. http://localhost:3000.

### Frontend
VITE_API_URL – base URL for backend API.

Local example:


VITE_API_URL=http://localhost:5000
API Documentation
Full API documentation is available in docs/API.md (or a Swagger/Postman collection if provided). It includes:

All API endpoints with method, URL, and auth requirement.

Request/response examples for authentication, tenant, user, project, and task APIs.

Explanation of JWT authentication and how tokens are used in Authorization: Bearer <token> header.

### Demo Credentials
These credentials are used in prisma/seed.js so evaluators can easily test the app.

#### Super Admin
Email: superadmin@system.com

Password: Admin123

Role: super_admin

#### Tenant Admin (Demo Company)
Tenant: Demo Company (subdomain: demo)

Email: admin@demo.com

Password: Demo123!

Role: tenant_admin

#### Sample Users
user1@demo.com / User123! (role: user)

user2@demo.com / User123! (optional)

These accounts are suitable for demonstrating multi-tenant behavior and role-based access.

Notes
The project is intended to be evaluated on localhost:

Frontend: http://localhost:3000

Backend API: http://localhost:5000
