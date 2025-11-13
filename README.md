# Next.js Todo App with Hasura GraphQL

A full-stack todo application built with Next.js 14, TypeScript, Shadcn UI, and Hasura GraphQL.

## Features

- User Authentication (Login/Register)
- Task Management (Create, Read, Update, Delete)
- Mark tasks as complete/incomplete
- Responsive UI with Shadcn components
- Real-time GraphQL API with Hasura
- Protected routes
- Form validation and error handling

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React
- **UI**: Shadcn UI, Tailwind CSS, Radix UI
- **Backend**: Hasura GraphQL
- **State Management**: React Hooks, Apollo Client
- **Database**: PostgreSQL (via Hasura)

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose (for Hasura)
- PostgreSQL database

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Hasura

Start Hasura with Docker:

```bash
cd hasura
docker-compose up -d
```

This will start:
- Hasura GraphQL Engine at http://localhost:8080
- PostgreSQL database

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your-admin-secret
```

### 4. Run Database Migrations

Open Hasura Console:

```bash
cd hasura
hasura console
```

Or access directly at http://localhost:8080/console

Apply the migration from `hasura/migrations/001_init.sql` in the SQL tab.

### 5. Configure Hasura Metadata

In Hasura Console:
1. Go to Data tab
2. Track the `users` and `tasks` tables
3. Set up relationships and permissions as defined in `hasura/metadata/tables.yaml`

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── register/       # Register page
│   ├── tasks/              # Tasks list page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (redirects to login)
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── task-card.tsx       # Task card component
│   └── task-dialog.tsx     # Task create/edit dialog
├── graphql/
│   ├── queries.ts          # GraphQL queries
│   └── mutations.ts        # GraphQL mutations
├── lib/
│   ├── apollo-client.ts    # Apollo Client setup
│   ├── apollo-wrapper.tsx  # Apollo Provider wrapper
│   ├── auth.ts             # Auth utilities
│   └── utils.ts            # Utility functions
├── hooks/
│   └── use-toast.ts        # Toast hook
└── hasura/
    ├── migrations/         # Database migrations
    └── metadata/           # Hasura metadata
```

## Authentication Flow

The app uses a simple token-based authentication:

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with each GraphQL request
5. Hasura validates token and applies permissions

**Note**: For production, implement proper JWT authentication with Hasura Actions or a custom auth service.

## GraphQL Operations

### Queries
- `GET_TASKS` - Fetch all tasks for current user
- `GET_TASK` - Fetch single task by ID

### Mutations
- `LOGIN_USER` - User login
- `REGISTER_USER` - User registration
- `CREATE_TASK` - Create new task
- `UPDATE_TASK` - Update task details
- `DELETE_TASK` - Delete task
- `TOGGLE_TASK` - Toggle task completion status

## Hasura Setup

### Database Schema

**users table**:
- id (UUID, primary key)
- email (string, unique)
- name (string)
- password_hash (string)
- created_at (timestamp)
- updated_at (timestamp)

**tasks table**:
- id (UUID, primary key)
- user_id (UUID, foreign key)
- title (string)
- description (text, optional)
- completed (boolean)
- created_at (timestamp)
- updated_at (timestamp)

### Permissions

Users can only:
- View their own tasks
- Create tasks for themselves
- Update/delete their own tasks

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Hasura Cloud)

1. Create project on Hasura Cloud
2. Connect PostgreSQL database
3. Apply migrations and metadata
4. Update `NEXT_PUBLIC_HASURA_GRAPHQL_URL` in frontend

## Security Notes

- Implement proper JWT authentication for production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting
- Add CSRF protection
- Validate all inputs server-side

## License

MIT
