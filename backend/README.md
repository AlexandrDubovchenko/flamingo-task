# TaskFlow Backend

A modern REST API built with Nest.js, Fastify, Drizzle ORM, and Supabase for the TaskFlow personal task management application.

## 🛠️ Tech Stack

- **Framework**: Nest.js with Fastify adapter
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Auth0 (SSO)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module (Auth0 integration)
├── users/               # User management
├── projects/            # Projects CRUD module
├── tasks/               # Tasks CRUD module
├── common/              # Shared utilities, guards, decorators
│   ├── guards/
│   └── decorators/
├── database/            # Drizzle configuration & schemas
│   ├── schema/
│   └── migrations/
└── main.ts             # Application bootstrap
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Auth0 account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - Supabase database URL and credentials
   - Auth0 domain, client ID, client secret, and audience
   - JWT secret

### Database Setup

1. Generate migration files:
```bash
npm run db:generate
```

2. Push schema to database:
```bash
npm run db:push
```

3. (Optional) Open Drizzle Studio to view your database:
```bash
npm run db:studio
```

### Running the Application

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3001
- **Swagger Documentation**: http://localhost:3001/api/docs

## 📊 Database Schema

### Users
- `id` (UUID, Primary Key)
- `auth0Id` (String, Auth0 user ID)
- `email` (String)
- `name` (String, optional)
- `picture` (String, optional)
- `createdAt`, `updatedAt` (Timestamps)

### Projects
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text, optional)
- `color` (String, hex color)
- `userId` (UUID, Foreign Key → Users)
- `createdAt`, `updatedAt` (Timestamps)

### Tasks
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text, optional)
- `status` (Enum: todo, in_progress, completed)
- `priority` (Enum: low, medium, high)
- `dueDate` (Timestamp, optional)
- `projectId` (UUID, Foreign Key → Projects)
- `userId` (UUID, Foreign Key → Users)
- `createdAt`, `updatedAt` (Timestamps)

## 🔗 API Endpoints

### Authentication
- `GET /auth/config` - Get Auth0 configuration
- `GET /auth/profile` - Get current user profile (protected)

### Projects
- `GET /projects` - Get all user projects (protected)
- `POST /projects` - Create new project (protected)
- `GET /projects/:id` - Get specific project (protected)
- `PATCH /projects/:id` - Update project (protected)
- `DELETE /projects/:id` - Delete project (protected)

### Tasks
- `GET /tasks` - Get all user tasks (protected)
- `GET /tasks?projectId=:id` - Get tasks by project (protected)
- `POST /tasks` - Create new task (protected)
- `GET /tasks/:id` - Get specific task (protected)
- `PATCH /tasks/:id` - Update task (protected)
- `DELETE /tasks/:id` - Delete task (protected)

## 🔐 Authentication

The API uses Auth0 for authentication. All protected endpoints require a valid Bearer token in the Authorization header:

```
Authorization: Bearer <your-auth0-jwt-token>
```

## 🧪 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGci...` |
| `AUTH0_DOMAIN` | Auth0 domain | `your-tenant.auth0.com` |
| `AUTH0_CLIENT_ID` | Auth0 client ID | `xxx` |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | `xxx` |
| `AUTH0_AUDIENCE` | Auth0 API audience | `https://taskflow-api` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |

## 🏗️ Architecture Decisions

1. **Nest.js with Fastify**: Chosen for performance and modern TypeScript support
2. **Drizzle ORM**: Lightweight, type-safe ORM with excellent performance
3. **Supabase**: Managed PostgreSQL with real-time capabilities
4. **Auth0**: Enterprise-grade authentication and authorization
5. **Modular Structure**: Each domain (auth, users, projects, tasks) is a separate module
6. **Guard-based Security**: JWT authentication implemented as guards
7. **DTO Validation**: Input validation using class-validator decorators

## 🔒 Security Features

- JWT token validation
- Input validation and sanitization
- CORS configuration
- User isolation (users can only access their own data)
- SQL injection prevention through ORM

## 📖 API Documentation

Once the server is running, visit http://localhost:3001/api/docs for interactive Swagger documentation.

## 🚀 Next Steps

1. Set up Supabase database and configure environment variables
2. Configure Auth0 application and API
3. Deploy to your preferred cloud platform
4. Set up CI/CD pipeline
5. Add monitoring and logging
