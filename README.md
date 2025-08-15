# Flamingo Test Task

## Project Overview

This repository contains a full-stack application with a NestJS backend and a React (Vite) frontend. The project demonstrates authentication, user management, projects, and tasks features, using Drizzle ORM for database access and modular architecture for scalability and maintainability.

---

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Architecture Notes](#architecture-notes)
- [Tech Stack](#tech-stack)
- [Scripts](#scripts)

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (or compatible database)

### 1. Clone the repository
```bash
git clone https://github.com/AlexandrDubovchenko/flamingo-task.git
cd flamingo-task
```

### 2. Install dependencies
#### Backend
```bash
cd backend
npm install
```
#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend
Create a `.env` file in the `backend/` directory. Example:
```env
DATABASE_URL=postgres://user:password@localhost:5432/flamingo
JWT_SECRET=your_jwt_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Frontend
Create a `.env` file in the `frontend/` directory. Example:
```env
VITE_API_URL=http://localhost:3000
```

### 4. Database Migration
Run migrations to set up the database schema:
```bash
cd backend
npm run migrate
```

---

## Running Locally

### Backend
```bash
cd backend
npm run start:dev
```
The backend will start on `http://localhost:3000` by default.

### Frontend
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173` by default.

---

## Environment Variables
- See `.env.example` files in both `backend/` and `frontend/` for required variables.
- Backend: Database connection, JWT secret, OAuth credentials
- Frontend: API base URL

---

## Architecture Notes

### Backend Architecture
```
src/
├── common/          # Shared utilities, types, interceptors, guards
├── database/        # Database configuration, migrations, schema
├── domain/          # Core business models and repository interfaces
├── infrastructure/  # External service implementations (repositories, auth)
├── auth/            # Authentication module (strategies, guards, services)
├── users/           # User management module
├── projects/        # Project management module
├── tasks/           # Task management module
└── main.ts          # Application entry point
```
- **NestJS**: Modular structure with dependency injection
- **Domain-Driven Design**: Clean separation between domain and infrastructure
- **Repository Pattern**: Abstract data access with interface-based design
- **Authentication**: JWT and GitHub OAuth strategies with guards
- **Drizzle ORM**: Type-safe database access and migrations

### Frontend Architecture
```
src/
├── shared/          # UI components, utils, configs, API calls
├── models/          # Domain interfaces and types
├── services/        # Data mapping and business logic  
├── features/        # Reusable components with logic
├── pages/           # Route-level pages
├── assets/          # Static assets
└── App.tsx          # Main app component
```
- **React + Vite**: Fast development and build
- **Feature-based folders**: Clean separation of concerns
- **Service Layer**: API communication and data transformation
- **Shared Components**: Reusable UI components and utilities

---

## Tech Stack
- **Backend**: NestJS, Drizzle ORM, PostgreSQL
- **Frontend**: React, Vite, TypeScript

---

## Scripts

### Backend
- `npm run start:dev` — Start backend in development mode
- `npm run migrate` — Run database migrations

### Frontend
- `npm run dev` — Start frontend in development mode

---

## Contact
For questions, contact [AlexandrDubovchenko](https://github.com/AlexandrDubovchenko).
