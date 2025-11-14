# Product Overview

A full-stack todo application with user authentication and task management capabilities.

## Core Features

- User authentication (login/register with token-based auth)
- Task CRUD operations (create, read, update, delete)
- Task completion toggling
- User-scoped data (users only see their own tasks)
- Real-time GraphQL API
- Responsive UI with modern design system

## User Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. User manages personal tasks (create, edit, delete, mark complete)
4. All operations are authenticated and user-scoped

## Security Model

- Token-based authentication with JWT
- Hasura permissions ensure users can only access their own data
- Admin secret for backend operations
- Protected routes on frontend
