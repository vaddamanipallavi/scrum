# Hostel Management System

## Setup

1. Copy .env.example to .env and update DATABASE_URL and JWT_SECRET.
2. Install dependencies: npm install
3. Generate Prisma client: npm run prisma:generate
4. Apply migrations: npm run prisma:migrate

## Development

npm run dev

## Auth API

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## Roles

- STUDENT
- WARDEN
- ADMIN
