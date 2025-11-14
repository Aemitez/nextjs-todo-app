# 📝 Next.js Todo App with Hasura GraphQL

A modern, full-stack todo application with a beautiful UI, built using Next.js 14, TypeScript, Shadcn UI, and Hasura GraphQL.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- Token-based authentication with JWT
- Protected routes and user sessions

### ✅ Task Management
- Create, read, update, and delete tasks
- Toggle task completion status with visual feedback
- Separate views for TODO and DONE tasks
- Color-coded task cards (Orange for pending, Green for completed)

### 🎨 Modern UI/UX
- Clean and intuitive interface
- Fully responsive design (Mobile, Tablet, PC)
- Custom-styled components with Shadcn UI
- Smooth animations and transitions
- Real-time date display with day, month, and year

### 🚀 Technical Features
- Real-time GraphQL API with Hasura
- Client-side state management with Apollo Client
- Form validation and error handling
- Toast notifications for user feedback
- Optimized for performance and SEO

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13.5.6 (App Router)
- **Language**: TypeScript 5.0 (Strict mode)
- **UI Library**: React 18.2
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: Shadcn UI (built on Radix UI primitives)
- **Icons**: Lucide React

### Backend
- **GraphQL Engine**: Hasura
- **Database**: PostgreSQL (via Hasura)
- **API Client**: Apollo Client 3.8

### State Management
- React Hooks
- Apollo Client for GraphQL state

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/yarn
- **Docker** and Docker Compose (for Hasura)
- **PostgreSQL** database

## 🚀 Getting Started

Follow these steps to get the application running locally:

### 1️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 2️⃣ Set Up Hasura Backend

Start Hasura GraphQL Engine with Docker:

```bash
cd hasura
docker-compose up -d
```

This will start:
- 🚀 Hasura GraphQL Engine at `http://localhost:8080`
- 🗄️ PostgreSQL database

### 3️⃣ Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your-admin-secret
```

### 4️⃣ Run Database Migrations

Open Hasura Console:

```bash
cd hasura
hasura console
```

Or access directly at `http://localhost:8080/console`

Apply the migration from `hasura/migrations/001_init.sql` in the SQL tab.

### 5️⃣ Configure Hasura Metadata

In Hasura Console:
1. Navigate to the **Data** tab
2. Track the `users` and `tasks` tables
3. Set up relationships and permissions as defined in `hasura/metadata/tables.yaml`

### 6️⃣ Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open `http://localhost:3000` in your browser 🎉

## 📁 Project Structure

```
nextjs-todo-app/
├── app/                      # Next.js App Router
│   ├── auth/
│   │   ├── login/           # 🔐 Login page
│   │   └── register/        # 📝 Register page
│   ├── tasks/               # ✅ Tasks list page (main app)
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (redirects to login)
│   └── globals.css          # Global styles and CSS variables
│
├── components/              # React components
│   ├── ui/                  # 🎨 Shadcn UI primitives
│   ├── task-card.tsx        # Task card with color coding
│   └── task-dialog.tsx      # Task create/edit dialog
│
├── graphql/                 # GraphQL operations
│   ├── queries.ts           # All GraphQL queries
│   └── mutations.ts         # All GraphQL mutations
│
├── lib/                     # Utility libraries
│   ├── apollo-client.ts     # Apollo Client with auth
│   ├── apollo-wrapper.tsx   # Apollo Provider wrapper
│   ├── auth.ts              # Authentication utilities
│   └── utils.ts             # Helper functions (cn)
│
├── hooks/                   # Custom React hooks
│   └── use-toast.ts         # Toast notification hook
│
└── hasura/                  # Backend configuration
    ├── docker-compose.yml   # Hasura + PostgreSQL setup
    ├── migrations/          # Database migrations
    └── metadata/            # Hasura metadata
```

## 🔐 Authentication Flow

The app uses token-based authentication:

1. 👤 User registers or logs in
2. 🔑 Backend returns JWT token
3. 💾 Token stored in localStorage
4. 📡 Token sent with each GraphQL request
5. ✅ Hasura validates token and applies permissions

> **Note**: For production, implement proper JWT authentication with Hasura Actions or a custom auth service.

## 🎯 UI Features

### Task Cards
- **TODO Tasks**: Orange background (#fd6e41) with transparent complete button
- **DONE Tasks**: Green background (#00af3b) with white checkmark
- **Actions**: Edit and delete buttons in top-right corner
- **Complete Toggle**: Large circular button on the right side

### Responsive Design
- **Mobile**: Optimized layout with centered headings and compact buttons
- **Tablet**: 2-column grid for tasks
- **Desktop**: 3-column grid with full-size elements

### Date Display
- Shows current date in English format
- Large day number with day name, month, and year
- Responsive sizing across devices

## 📡 GraphQL Operations

### Queries
- `GET_TASKS` - Fetch all tasks for current user
- `GET_TASK` - Fetch single task by ID

### Mutations
- `LOGIN_USER` - User login
- `CREATE_USER` - User registration
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

## 💻 Development Commands

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

## 🚢 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_HASURA_GRAPHQL_URL`
   - `NEXT_PUBLIC_HASURA_ADMIN_SECRET`
4. Deploy 🚀

### Backend (Hasura Cloud)

1. Create a project on [Hasura Cloud](https://cloud.hasura.io)
2. Connect your PostgreSQL database
3. Apply migrations and metadata
4. Update `NEXT_PUBLIC_HASURA_GRAPHQL_URL` in your frontend

## 🔒 Security Considerations

For production deployment, ensure you:

- ✅ Implement proper JWT authentication with Hasura Actions
- ✅ Use environment variables for all sensitive data
- ✅ Enable HTTPS in production
- ✅ Implement rate limiting on API endpoints
- ✅ Add CSRF protection
- ✅ Validate all inputs server-side
- ✅ Use secure password hashing (bcrypt)
- ✅ Implement proper session management

## 🎨 Customization

### Colors
The app uses custom colors for task states:
- **TODO**: `#fd6e41` (Orange)
- **DONE**: `#00af3b` (Green)
- **NEW TASK Button**: `#e145e5` (Purple)

You can customize these in the respective component files.

### Styling
The app uses Tailwind CSS with custom design tokens defined in `app/globals.css`. Modify the CSS variables to change the theme.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

---

Made with ❤️ using Next.js and Hasura
