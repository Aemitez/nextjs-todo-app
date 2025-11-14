# Tech Stack

## Frontend

- **Framework**: Next.js 13.5.6 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **UI Library**: React 18.2
- **Styling**: Tailwind CSS with custom design tokens
- **Component Library**: Shadcn UI (built on Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: Apollo Client for GraphQL state

## Backend

- **GraphQL Engine**: Hasura
- **Database**: PostgreSQL (via Hasura)
- **API Client**: Apollo Client 3.8

## Key Libraries

- `@apollo/client` - GraphQL client and state management
- `class-variance-authority` - Component variant styling
- `clsx` + `tailwind-merge` - Utility class management (via `cn()` helper)
- `@radix-ui/*` - Accessible UI primitives

## Development Tools

- ESLint with Next.js config
- TypeScript 5.0
- PostCSS with Autoprefixer

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Hasura (from hasura/ directory)
cd hasura
docker-compose up -d     # Start Hasura + PostgreSQL
docker-compose down      # Stop services
hasura console           # Open Hasura console
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_HASURA_GRAPHQL_URL` - Hasura GraphQL endpoint
- `NEXT_PUBLIC_HASURA_ADMIN_SECRET` - Hasura admin secret

## Path Aliases

- `@/*` maps to project root (e.g., `@/components`, `@/lib`)
