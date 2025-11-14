# Project Structure

## Directory Organization

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (login, register)
│   ├── tasks/             # Task management pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (redirects)
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components
│   ├── ui/               # Shadcn UI primitives (button, card, dialog, etc.)
│   ├── task-card.tsx     # Feature components
│   └── task-dialog.tsx
├── graphql/              # GraphQL operations
│   ├── queries.ts        # All GraphQL queries
│   └── mutations.ts      # All GraphQL mutations
├── lib/                  # Utility libraries and configs
│   ├── apollo-client.ts  # Apollo Client setup with auth
│   ├── apollo-wrapper.tsx # Apollo Provider wrapper
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # Shared utilities (cn helper)
├── hooks/                # Custom React hooks
│   └── use-toast.ts
└── hasura/               # Backend configuration
    ├── docker-compose.yml
    ├── migrations/       # Database migrations
    └── metadata/         # Hasura metadata (tables, permissions)
```

## Code Organization Patterns

### Components
- UI primitives in `components/ui/` (Shadcn components)
- Feature components at `components/` root level
- Use TypeScript interfaces for props
- Export named components (not default)

### GraphQL
- All queries in `graphql/queries.ts`
- All mutations in `graphql/mutations.ts`
- Use `gql` template literals from `@apollo/client`
- Operations are named (e.g., `GET_TASKS`, `CREATE_TASK`)

### Utilities
- `lib/utils.ts` contains the `cn()` helper for className merging
- Apollo setup in `lib/apollo-client.ts` with auth middleware
- Auth token stored in localStorage

### Styling
- Tailwind utility classes for styling
- Use `cn()` helper from `@/lib/utils` for conditional classes
- CSS variables defined in `app/globals.css` for theming
- Shadcn design tokens (colors, radius, etc.)

### Type Safety
- Strict TypeScript enabled
- Define interfaces for component props
- Type GraphQL responses where needed

## Naming Conventions

- Files: kebab-case (e.g., `task-card.tsx`, `apollo-client.ts`)
- Components: PascalCase (e.g., `TaskCard`, `TaskDialog`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE for GraphQL operations
