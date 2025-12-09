# Practo Hub CMS

Content Management System for Practo Hub with role-based access control.

## Project Structure

- `cms-be/` - Backend (Node.js + Express + Prisma + PostgreSQL)
- `cms-fe/` - Frontend (Next.js + React + TailwindCSS)

## Setup

### Backend
```bash
cd cms-be
npm install
cp .env.example .env
# Update .env with your credentials
npx prisma migrate deploy
npx prisma generate
npm run dev
```

### Frontend
```bash
cd cms-fe
npm install
npm run dev
```

## Features

- UUID-based user identification
- Role-based access control (8 roles)
- Email/Password + Google OAuth authentication
- Set Password & Change Password functionality
- Doctor-specific fields (specialty, city)
- User status management (ACTIVE, INACTIVE, SUSPENDED)
