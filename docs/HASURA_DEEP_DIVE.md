# 🚀 Hasura Deep Dive - หลักการทำงานโดยละเอียด

## 📚 Table of Contents
1. [Hasura คืออะไร](#hasura-คืออะไร)
2. [Architecture Overview](#architecture-overview)
3. [Request Lifecycle](#request-lifecycle)
4. [Metadata System](#metadata-system)
5. [Permission System](#permission-system)
6. [Authentication & Authorization](#authentication--authorization)
7. [Query Execution](#query-execution)
8. [Real-time Subscriptions](#real-time-subscriptions)

---

## Hasura คืออะไร

**Hasura** = GraphQL Engine ที่สร้าง GraphQL API อัตโนมัติจาก PostgreSQL Database

```
PostgreSQL Database
        ↓
    Hasura Engine
        ↓
GraphQL API (Auto-generated)
```

### Core Features:

```
1. Auto-generate GraphQL API from database schema
2. Real-time subscriptions
3. Row-level permissions
4. JWT/Webhook authentication
5. Remote schemas (join multiple GraphQL APIs)
6. Actions (custom business logic)
7. Event triggers
8. Scheduled triggers
```

---

## Architecture Overview

### System Architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  - Web App (React/Next.js)                              │
│  - Mobile App                                           │
│  - Third-party services                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ GraphQL over HTTP/WebSocket
                     │
┌────────────────────▼────────────────────────────────────┐
│                  HASURA ENGINE                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1. GraphQL Parser                                │  │
│  │    - Parse incoming GraphQL query                │  │
│  │    - Validate syntax                             │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     ↓                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 2. Schema Registry                               │  │
│  │    - Load metadata                               │  │
│  │    - Check permissions                           │  │
│  │    - Validate against schema                     │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     ↓                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 3. Query Compiler                                │  │
│  │    - Convert GraphQL to SQL                      │  │
│  │    - Apply permissions (WHERE clauses)           │  │
│  │    - Optimize query                              │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     ↓                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 4. SQL Executor                                  │  │
│  │    - Execute SQL query                           │  │
│  │    - Handle transactions                         │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     ↓                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 5. Response Builder                              │  │
│  │    - Format SQL results                          │  │
│  │    - Build GraphQL response                      │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────▼────────────────────────────────────┐
│                 POSTGRESQL DATABASE                     │
│  - Tables                                               │
│  - Relationships                                        │
│  - Constraints                                          │
│  - Indexes                                              │
└─────────────────────────────────────────────────────────┘
```


### How Hasura Generates API:

```
Step 1: Database Introspection
┌─────────────────────────────────────────────────────────┐
│ PostgreSQL Database                                     │
│                                                         │
│ CREATE TABLE users (                                    │
│   id UUID PRIMARY KEY,                                  │
│   name TEXT NOT NULL,                                   │
│   email TEXT UNIQUE NOT NULL                            │
│ );                                                      │
│                                                         │
│ CREATE TABLE tasks (                                    │
│   id UUID PRIMARY KEY,                                  │
│   user_id UUID REFERENCES users(id),                    │
│   title TEXT NOT NULL,                                  │
│   completed BOOLEAN DEFAULT false                       │
│ );                                                      │
└─────────────────────────────────────────────────────────┘
                     ↓
Step 2: Hasura Reads Schema
┌─────────────────────────────────────────────────────────┐
│ Hasura discovers:                                       │
│ - Tables: users, tasks                                  │
│ - Columns: id, name, email, title, completed            │
│ - Types: UUID, TEXT, BOOLEAN                            │
│ - Relationships: tasks.user_id → users.id               │
│ - Constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE         │
└─────────────────────────────────────────────────────────┘
                     ↓
Step 3: Auto-generate GraphQL Schema
┌─────────────────────────────────────────────────────────┐
│ type User {                                             │
│   id: uuid!                                             │
│   name: String!                                         │
│   email: String!                                        │
│   tasks: [Task!]!  # Auto-generated relationship        │
│ }                                                       │
│                                                         │
│ type Task {                                             │
│   id: uuid!                                             │
│   user_id: uuid!                                        │
│   title: String!                                        │
│   completed: Boolean!                                   │
│   user: User!      # Auto-generated relationship        │
│ }                                                       │
│                                                         │
│ type Query {                                            │
│   users: [User!]!                                       │
│   users_by_pk(id: uuid!): User                          │
│   tasks: [Task!]!                                       │
│   tasks_by_pk(id: uuid!): Task                          │
│ }                                                       │
│                                                         │
│ type Mutation {                                         │
│   insert_users_one(object: users_insert_input!): User   │
│   update_users_by_pk(...): User                         │
│   delete_users_by_pk(id: uuid!): User                   │
│   insert_tasks_one(...): Task                           │
│   update_tasks_by_pk(...): Task                         │
│   delete_tasks_by_pk(...): Task                         │
│ }                                                       │
│                                                         │
│ type Subscription {                                     │
│   users: [User!]!                                       │
│   tasks: [Task!]!                                       │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```


---

## Request Lifecycle

### Complete Request Flow:

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: CLIENT SENDS REQUEST                            │
│                                                         │
│ POST /v1/graphql                                        │
│ Headers: {                                              │
│   "Authorization": "Bearer <JWT_TOKEN>",                │
│   "Content-Type": "application/json"                    │
│ }                                                       │
│ Body: {                                                 │
│   "query": "query { users { id name } }",               │
│   "variables": {}                                       │
│ }                                                       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: AUTHENTICATION                                  │
│                                                         │
│ Hasura extracts JWT token from header                  │
│ ↓                                                       │
│ Validates JWT signature                                │
│ ↓                                                       │
│ Decodes JWT payload:                                    │
│ {                                                       │
│   "sub": "user-id-123",                                 │
│   "https://hasura.io/jwt/claims": {                     │
│     "x-hasura-allowed-roles": ["user"],                 │
│     "x-hasura-default-role": "user",                    │
│     "x-hasura-user-id": "user-id-123"                   │
│   }                                                     │
│ }                                                       │
│ ↓                                                       │
│ Sets session variables:                                │
│ - X-Hasura-Role: "user"                                 │
│ - X-Hasura-User-Id: "user-id-123"                       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: PARSE & VALIDATE QUERY                          │
│                                                         │
│ Parse GraphQL query:                                    │
│ query {                                                 │
│   users {                                               │
│     id                                                  │
│     name                                                │
│   }                                                     │
│ }                                                       │
│ ↓                                                       │
│ Validate syntax ✓                                       │
│ ↓                                                       │
│ Validate against schema:                                │
│ - Does "users" query exist? ✓                           │
│ - Does User type have "id" field? ✓                     │
│ - Does User type have "name" field? ✓                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: CHECK PERMISSIONS                               │
│                                                         │
│ Load permission rules for role "user":                  │
│                                                         │
│ Table: users                                            │
│ Role: user                                              │
│ Operation: select                                       │
│ Permission: {                                           │
│   "filter": {                                           │
│     "id": { "_eq": "X-Hasura-User-Id" }                 │
│   },                                                    │
│   "columns": ["id", "name", "email"]                    │
│ }                                                       │
│ ↓                                                       │
│ User can only see their own data ✓                      │
│ User can access "id" and "name" columns ✓               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 5: COMPILE TO SQL                                  │
│                                                         │
│ GraphQL Query:                                          │
│ query {                                                 │
│   users {                                               │
│     id                                                  │
│     name                                                │
│   }                                                     │
│ }                                                       │
│ ↓                                                       │
│ Compiled SQL:                                           │
│ SELECT                                                  │
│   users.id,                                             │
│   users.name                                            │
│ FROM users                                              │
│ WHERE users.id = 'user-id-123'  -- Permission filter    │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 6: EXECUTE SQL                                     │
│                                                         │
│ Hasura sends SQL to PostgreSQL                         │
│ ↓                                                       │
│ PostgreSQL executes query                               │
│ ↓                                                       │
│ Returns result:                                         │
│ [                                                       │
│   {                                                     │
│     "id": "user-id-123",                                │
│     "name": "John Doe"                                  │
│   }                                                     │
│ ]                                                       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 7: BUILD RESPONSE                                  │
│                                                         │
│ Format SQL result as GraphQL response:                  │
│ {                                                       │
│   "data": {                                             │
│     "users": [                                          │
│       {                                                 │
│         "id": "user-id-123",                            │
│         "name": "John Doe"                              │
│       }                                                 │
│     ]                                                   │
│   }                                                     │
│ }                                                       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 8: SEND RESPONSE                                   │
│                                                         │
│ HTTP 200 OK                                             │
│ Content-Type: application/json                          │
│                                                         │
│ {                                                       │
│   "data": {                                             │
│     "users": [...]                                      │
│   }                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```


---

## Metadata System

### What is Metadata?

**Metadata** = Configuration ที่บอก Hasura ว่าจะสร้าง API อย่างไร

```
Metadata includes:
- Tables to track
- Relationships
- Permissions
- Remote schemas
- Actions
- Event triggers
```

### Metadata Storage:

```
┌─────────────────────────────────────────────────────────┐
│ Hasura Metadata Database                                │
│                                                         │
│ Tables:                                                 │
│ - hdb_catalog.hdb_table                                 │
│ - hdb_catalog.hdb_relationship                          │
│ - hdb_catalog.hdb_permission                            │
│ - hdb_catalog.hdb_action                                │
│ - hdb_catalog.event_triggers                            │
└─────────────────────────────────────────────────────────┘
```

### Tracking Tables:

```yaml
# metadata/tables.yaml
- table:
    schema: public
    name: users
  
  # Define relationships
  object_relationships: []
  array_relationships:
    - name: tasks
      using:
        foreign_key_constraint_on:
          column: user_id
          table:
            schema: public
            name: tasks
  
  # Define permissions
  select_permissions:
    - role: user
      permission:
        columns:
          - id
          - name
          - email
        filter:
          id:
            _eq: X-Hasura-User-Id
```


### Relationships:

```
Types of Relationships:

1. Object Relationship (One-to-One, Many-to-One)
   tasks.user → users
   
2. Array Relationship (One-to-Many)
   users.tasks → [tasks]
   
3. Remote Relationship (Join with remote data source)
   users.profile → Remote API
```

**Example:**

```sql
-- Database Schema
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT
);
```

```yaml
# Hasura Metadata
- table:
    name: tasks
  object_relationships:
    - name: user
      using:
        foreign_key_constraint_on: user_id

- table:
    name: users
  array_relationships:
    - name: tasks
      using:
        foreign_key_constraint_on:
          column: user_id
          table:
            name: tasks
```

```graphql
# Generated GraphQL
type Task {
  id: uuid!
  user_id: uuid!
  title: String!
  user: User!  # Object relationship
}

type User {
  id: uuid!
  name: String!
  tasks: [Task!]!  # Array relationship
}

# Query with relationships
query {
  users {
    name
    tasks {  # Follow relationship
      title
    }
  }
}
```


---

## Permission System

### Row-Level Security:

Hasura ใช้ **Row-Level Permissions** เพื่อควบคุมว่า user แต่ละคนเห็นข้อมูลอะไรได้บ้าง

### Permission Structure:

```
Permission = Role + Table + Operation + Rules
```

### Operations:

```
1. select   - Read data
2. insert   - Create data
3. update   - Modify data
4. delete   - Remove data
```

### Permission Rules:

```yaml
# Example: User can only see their own tasks

table: tasks
role: user
operation: select
permission:
  # Filter (WHERE clause)
  filter:
    user_id:
      _eq: X-Hasura-User-Id
  
  # Columns allowed
  columns:
    - id
    - title
    - completed
    - created_at
  
  # Limit rows
  limit: 100
  
  # Allow aggregations
  allow_aggregations: true
```

### How Permissions Work:

```
User Query:
query {
  tasks {
    id
    title
  }
}

↓ Hasura applies permission filter ↓

Generated SQL:
SELECT
  tasks.id,
  tasks.title
FROM tasks
WHERE tasks.user_id = 'current-user-id'  -- Permission filter
LIMIT 100;                                -- Permission limit
```


### Permission Examples:

```yaml
# ═══════════════════════════════════════════════════
# 1. SELECT Permission - Read own data
# ═══════════════════════════════════════════════════
table: tasks
role: user
operation: select
permission:
  filter:
    user_id: { _eq: X-Hasura-User-Id }
  columns: [id, title, completed]

# ═══════════════════════════════════════════════════
# 2. INSERT Permission - Create with user_id
# ═══════════════════════════════════════════════════
table: tasks
role: user
operation: insert
permission:
  check:
    user_id: { _eq: X-Hasura-User-Id }
  columns: [title, completed]
  # user_id will be set automatically

# ═══════════════════════════════════════════════════
# 3. UPDATE Permission - Update own tasks only
# ═══════════════════════════════════════════════════
table: tasks
role: user
operation: update
permission:
  filter:
    user_id: { _eq: X-Hasura-User-Id }
  columns: [title, completed]
  # Cannot update user_id

# ═══════════════════════════════════════════════════
# 4. DELETE Permission - Delete own tasks only
# ═══════════════════════════════════════════════════
table: tasks
role: user
operation: delete
permission:
  filter:
    user_id: { _eq: X-Hasura-User-Id }

# ═══════════════════════════════════════════════════
# 5. Admin Permission - Full access
# ═══════════════════════════════════════════════════
table: tasks
role: admin
operation: select
permission:
  filter: {}  # No filter = see all
  columns: '*'  # All columns
```


### Complex Permission Rules:

```yaml
# Multiple conditions with AND
filter:
  _and:
    - user_id: { _eq: X-Hasura-User-Id }
    - status: { _eq: "active" }
    - created_at: { _gte: "2024-01-01" }

# Multiple conditions with OR
filter:
  _or:
    - user_id: { _eq: X-Hasura-User-Id }
    - is_public: { _eq: true }

# Nested relationships
filter:
  user:
    organization_id: { _eq: X-Hasura-Org-Id }

# Array contains
filter:
  tags: { _contains: ["important"] }

# Exists (has related records)
filter:
  tasks:
    completed: { _eq: false }
```

---

## Authentication & Authorization

### JWT Authentication:

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER LOGS IN                                         │
│    POST /auth/login                                     │
│    { email, password }                                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. AUTH SERVICE VALIDATES                               │
│    - Check credentials                                  │
│    - Generate JWT token                                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. JWT TOKEN STRUCTURE                                  │
│                                                         │
│ Header:                                                 │
│ {                                                       │
│   "alg": "HS256",                                       │
│   "typ": "JWT"                                          │
│ }                                                       │
│                                                         │
│ Payload:                                                │
│ {                                                       │
│   "sub": "user-id-123",                                 │
│   "name": "John Doe",                                   │
│   "https://hasura.io/jwt/claims": {                     │
│     "x-hasura-allowed-roles": ["user", "admin"],        │
│     "x-hasura-default-role": "user",                    │
│     "x-hasura-user-id": "user-id-123",                  │
│     "x-hasura-org-id": "org-456"                        │
│   }                                                     │
│ }                                                       │
│                                                         │
│ Signature:                                              │
│ HMACSHA256(                                             │
│   base64UrlEncode(header) + "." +                       │
│   base64UrlEncode(payload),                             │
│   secret                                                │
│ )                                                       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. CLIENT STORES TOKEN                                  │
│    localStorage.setItem('token', jwt)                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. CLIENT SENDS REQUEST WITH TOKEN                      │
│    POST /v1/graphql                                     │
│    Headers: {                                           │
│      "Authorization": "Bearer <JWT>"                    │
│    }                                                    │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. HASURA VALIDATES JWT                                 │
│    - Verify signature                                   │
│    - Check expiration                                   │
│    - Extract claims                                     │
│    - Set session variables                              │
└─────────────────────────────────────────────────────────┘
```


### Hasura JWT Configuration:

```yaml
# docker-compose.yml
HASURA_GRAPHQL_JWT_SECRET: '{
  "type": "HS256",
  "key": "your-256-bit-secret-key-here"
}'

# Or with RS256 (public key)
HASURA_GRAPHQL_JWT_SECRET: '{
  "type": "RS256",
  "key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
}'
```

### Session Variables:

```
Session variables are extracted from JWT claims:

X-Hasura-Role        → Current role
X-Hasura-User-Id     → Current user ID
X-Hasura-Org-Id      → Organization ID
X-Hasura-*           → Custom variables

Used in permissions:
filter:
  user_id: { _eq: X-Hasura-User-Id }
  org_id: { _eq: X-Hasura-Org-Id }
```

---

## Query Execution

### GraphQL to SQL Compilation:

```graphql
# GraphQL Query
query {
  users(where: { name: { _ilike: "%john%" } }) {
    id
    name
    tasks(where: { completed: { _eq: false } }) {
      title
      created_at
    }
  }
}
```

```sql
-- Compiled SQL (simplified)
SELECT
  users.id,
  users.name,
  (
    SELECT json_agg(
      json_build_object(
        'title', tasks.title,
        'created_at', tasks.created_at
      )
    )
    FROM tasks
    WHERE tasks.user_id = users.id
      AND tasks.completed = false
  ) AS tasks
FROM users
WHERE users.name ILIKE '%john%'
  AND users.id = 'current-user-id';  -- Permission filter
```


### Query Optimization:

```
Hasura optimizes queries by:

1. Batching
   - Combine multiple queries into one SQL query
   
2. N+1 Prevention
   - Use JOINs instead of multiple queries
   
3. Prepared Statements
   - Cache query plans
   
4. Connection Pooling
   - Reuse database connections
   
5. Query Analysis
   - Analyze and optimize query plans
```

### Mutation Execution:

```graphql
# GraphQL Mutation
mutation {
  insert_tasks_one(object: {
    title: "New Task"
    user_id: "user-123"
  }) {
    id
    title
  }
}
```

```sql
-- Compiled SQL
BEGIN;

-- Check permission
SELECT 1
FROM tasks
WHERE user_id = 'user-123'
  AND user_id = 'current-user-id';  -- Permission check

-- Insert
INSERT INTO tasks (id, title, user_id)
VALUES (gen_random_uuid(), 'New Task', 'user-123')
RETURNING id, title;

COMMIT;
```

---

## Real-time Subscriptions

### How Subscriptions Work:

```
┌─────────────────────────────────────────────────────────┐
│ 1. CLIENT SUBSCRIBES                                    │
│    WebSocket connection to /v1/graphql                  │
│                                                         │
│    subscription {                                       │
│      tasks {                                            │
│        id                                               │
│        title                                            │
│      }                                                  │
│    }                                                    │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. HASURA EXECUTES INITIAL QUERY                        │
│    SELECT id, title FROM tasks                          │
│    WHERE user_id = 'current-user-id'                    │
│    ↓                                                    │
│    Sends initial data to client                         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. HASURA LISTENS FOR CHANGES                           │
│    Uses PostgreSQL LISTEN/NOTIFY                        │
│    ↓                                                    │
│    CREATE TRIGGER task_notify                           │
│    AFTER INSERT OR UPDATE OR DELETE ON tasks            │
│    EXECUTE FUNCTION notify_hasura()                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. DATA CHANGES                                         │
│    INSERT INTO tasks (title, user_id)                   │
│    VALUES ('New Task', 'current-user-id')               │
│    ↓                                                    │
│    Trigger fires → NOTIFY hasura                        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. HASURA RECEIVES NOTIFICATION                         │
│    Re-executes subscription query                       │
│    ↓                                                    │
│    Compares with previous result                        │
│    ↓                                                    │
│    Sends diff to client                                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. CLIENT RECEIVES UPDATE                               │
│    {                                                    │
│      "data": {                                          │
│        "tasks": [                                       │
│          { "id": "1", "title": "Task 1" },              │
│          { "id": "2", "title": "New Task" }  ← New      │
│        ]                                                │
│      }                                                  │
│    }                                                    │
│    ↓                                                    │
│    React re-renders with new data                       │
└─────────────────────────────────────────────────────────┘
```


### Subscription Modes:

```
1. Live Queries (Default)
   - Re-execute query on every change
   - Always get latest data
   - Higher server load

2. Streaming Subscriptions
   - Stream changes as they happen
   - More efficient
   - Lower latency
```

### Using Subscriptions in React:

```typescript
import { useSubscription } from '@apollo/client'
import { gql } from '@apollo/client'

const TASKS_SUBSCRIPTION = gql`
  subscription TasksSubscription {
    tasks(order_by: { created_at: desc }) {
      id
      title
      completed
    }
  }
`

function TaskList() {
  const { data, loading, error } = useSubscription(TASKS_SUBSCRIPTION)
  
  // Component automatically re-renders when data changes!
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data.tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}
```

---

## Advanced Features

### 1. Actions (Custom Business Logic):

```yaml
# Define custom mutation
- name: sendEmail
  definition:
    kind: synchronous
    handler: https://api.example.com/send-email
  
  # GraphQL definition
  type: mutation
  arguments:
    - name: to
      type: String!
    - name: subject
      type: String!
    - name: body
      type: String!
  
  output_type: EmailResponse
```

```graphql
# Use in GraphQL
mutation {
  sendEmail(
    to: "user@example.com"
    subject: "Hello"
    body: "World"
  ) {
    success
    message
  }
}
```

### 2. Event Triggers:

```yaml
# Trigger on database events
table:
  name: users
  schema: public

webhook: https://api.example.com/user-created

insert:
  columns: '*'

# When user is inserted:
# 1. Hasura captures event
# 2. Sends webhook to your API
# 3. Your API processes (send welcome email, etc.)
```

### 3. Scheduled Triggers:

```yaml
# Run at specific times
webhook: https://api.example.com/daily-report
schedule: "0 9 * * *"  # Every day at 9 AM
payload:
  type: daily_report
```

### 4. Remote Schemas:

```yaml
# Join multiple GraphQL APIs
- name: payment_api
  definition:
    url: https://payment-api.example.com/graphql
    headers:
      - name: Authorization
        value: Bearer token

# Now you can query both Hasura and payment API together
query {
  users {
    name
    payments {  # From remote schema
      amount
      status
    }
  }
}
```

---

## Performance Optimization

### 1. Query Performance:

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Composite index for common filters
CREATE INDEX idx_tasks_user_completed 
ON tasks(user_id, completed);
```

### 2. Connection Pooling:

```yaml
# docker-compose.yml
HASURA_GRAPHQL_PG_CONNECTIONS: 50
HASURA_GRAPHQL_PG_TIMEOUT: 180
```

### 3. Caching:

```graphql
# Use @cached directive
query @cached(ttl: 60) {
  users {
    name
  }
}
```

### 4. Query Limits:

```yaml
# Prevent expensive queries
HASURA_GRAPHQL_QUERY_PLAN_CACHE_SIZE: 100
HASURA_GRAPHQL_RATE_LIMIT:
  global:
    unique_params: IP
    max_reqs_per_min: 100
```

---

## Monitoring & Debugging

### 1. Query Analytics:

```
Hasura Console → API Explorer → Analyze

Shows:
- Query execution time
- SQL generated
- Permission checks
- Database query plan
```

### 2. Logs:

```yaml
# Enable detailed logs
HASURA_GRAPHQL_ENABLED_LOG_TYPES: 
  startup, http-log, webhook-log, websocket-log, query-log

# Log levels
HASURA_GRAPHQL_LOG_LEVEL: debug
```

### 3. Metrics:

```
Hasura exposes Prometheus metrics:
- Request count
- Request duration
- Active subscriptions
- Database connections
- Error rates
```

---

## Summary

### Key Concepts:

1. **Auto-generation**: GraphQL API from database schema
2. **Metadata**: Configuration for API generation
3. **Permissions**: Row-level security
4. **JWT Auth**: Token-based authentication
5. **Real-time**: WebSocket subscriptions
6. **Relationships**: Auto-join tables
7. **Actions**: Custom business logic
8. **Events**: Database triggers

### Request Flow Summary:

```
Client Request
  ↓
Authentication (JWT)
  ↓
Parse & Validate Query
  ↓
Check Permissions
  ↓
Compile to SQL
  ↓
Execute on PostgreSQL
  ↓
Format Response
  ↓
Send to Client
```

### Benefits:

```
✅ Instant GraphQL API
✅ Real-time subscriptions
✅ Fine-grained permissions
✅ No backend code needed
✅ Auto-optimized queries
✅ Type-safe
✅ Scalable
```

---

Made with ❤️ for Hasura learners
