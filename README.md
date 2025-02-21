# Menu Management System

A full-stack application built with Next.js and Nest.js for managing hierarchical menu structures.

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Redux for state management
- Radix UI
- Next.js App Router

### Backend

- Nest.js
- PostgreSQL
- Prisma.js
- JWT Authentication

## Prerequisites

- Node.js 20.x or later
- pnpm (latest version)
- Docker and Docker Compose

## Development Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd hyperhire-assessment
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development environment:
   ```bash
   docker-compose up
   ```

This will start:

- PostgreSQL database on port 5432
- Frontend application on http://localhost:3000
- Backend API on http://localhost:4000

## Project Structure

```
.
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/        # App router pages
│   │   │   ├── components/ # React components
│   │   │   ├── lib/       # Utilities and helpers
│   │   │   └── store/     # Redux store
│   │   └── ...
│   │
│   └── api/                # Nest.js backend
│       ├── src/
│       │   ├── modules/    # Feature modules
│       │   ├── common/     # Shared code
│       │   └── config/     # Configuration
│       └── ...
│
├── docker/                 # Docker configuration
└── ...
```

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)

```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/hyperhire
JWT_SECRET=your-secret-key
```

## Available Scripts

In the project root:

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm start`: Start all applications in production mode
- `pnpm lint`: Run linting on all applications
