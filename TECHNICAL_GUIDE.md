# 📚 Technical Guide - Next.js Todo App

คู่มือทางเทคนิคสำหรับ Senior Developers ที่ต้องการเข้าใจสถาปัตยกรรมและการทำงานของโปรเจกต์นี้

---

## 🏗️ สถาปัตยกรรมโดยรวม (Architecture Overview)

โปรเจกต์นี้เป็น **Full-Stack Application** แบบ **Client-Server Architecture** ที่แยกชัดเจนระหว่าง:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│  Next.js 14 (React) + TypeScript + Tailwind CSS            │
│  - Server-Side Rendering (SSR)                              │
│  - Client-Side Rendering (CSR)                              │
│  - Apollo Client (GraphQL State Management)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ GraphQL over HTTP
                  │ (Apollo Client → Hasura)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                       BACKEND SIDE                          │
│  Hasura GraphQL Engine                                      │
│  - Auto-generated GraphQL API                               │
│  - Real-time subscriptions                                  │
│  - Permission & Authorization                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ SQL Queries
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                        DATABASE                             │
│  PostgreSQL                                                 │
│  - users table                                              │
│  - tasks table                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 FRONTEND (Next.js + React + TypeScript)

### 1. Next.js 14 - App Router

**Next.js** คือ React Framework ที่เพิ่มความสามารถให้กับ React

#### Key Concepts:

**App Router (ใหม่ใน Next.js 13+)**
- ใช้โฟลเดอร์ `app/` แทน `pages/`
- File-based routing: โครงสร้างโฟลเดอร์ = URL routes
- Server Components เป็น default

```
app/
├── page.tsx              → / (root)
├── layout.tsx            → Layout wrapper ทุกหน้า
├── auth/
│   ├── login/
│   │   └── page.tsx      → /auth/login
│   └── register/
│       └── page.tsx      → /auth/register
└── tasks/
    └── page.tsx          → /tasks
```

**Special Files:**
- `page.tsx` = หน้าเว็บที่เข้าถึงได้
- `layout.tsx` = Layout component ที่ wrap children
- `globals.css` = Global styles

---

### 2. React Lifecycle & Hooks

#### Component Lifecycle ใน React Function Components:

```typescript
export default function TasksPage() {
  // 1. INITIALIZATION PHASE
  const [state, setState] = useState(initialValue)
  
  // 2. MOUNTING PHASE
  useEffect(() => {
    // รันครั้งแรกเมื่อ component mount
    // เหมือน componentDidMount ใน Class Component
  }, [])
  
  // 3. UPDATING PHASE
  useEffect(() => {
    // รันทุกครั้งที่ dependency เปลี่ยน
    // เหมือน componentDidUpdate
  }, [dependency])
  
  // 4. CLEANUP PHASE
  useEffect(() => {
    return () => {
      // Cleanup function
      // เหมือน componentWillUnmount
    }
  }, [])
  
  // 5. RENDER PHASE
  return <div>UI</div>
}
```

#### Hooks ที่ใช้ในโปรเจกต์:

**1. useState** - จัดการ state ภายใน component
```typescript
const [isDialogOpen, setIsDialogOpen] = useState(false)
// isDialogOpen = ค่าปัจจุบัน
// setIsDialogOpen = function สำหรับเปลี่ยนค่า
```

**2. useEffect** - Side effects (API calls, subscriptions, etc.)
```typescript
useEffect(() => {
  // Code ที่ต้องการรัน
  fetchData()
}, [dependencies]) // รันใหม่เมื่อ dependencies เปลี่ยน
```

**3. useRouter** (Next.js) - Navigation
```typescript
const router = useRouter()
router.push('/login') // Navigate to /login
```

**4. useQuery** (Apollo Client) - Fetch data
```typescript
const { data, loading, error } = useQuery(GET_TASKS)
```

**5. useMutation** (Apollo Client) - Modify data
```typescript
const [deleteTask] = useMutation(DELETE_TASK)
```

---

### 3. TypeScript Basics

**TypeScript** = JavaScript + Static Type Checking

#### Type Annotations:
```typescript
// Variables
const name: string = "John"
const age: number = 25
const isActive: boolean = true

// Arrays
const numbers: number[] = [1, 2, 3]

// Objects (Interface)
interface User {
  id: string
  name: string
  email: string
}

const user: User = {
  id: "1",
  name: "John",
  email: "john@example.com"
}

// Functions
function greet(name: string): string {
  return `Hello ${name}`
}

// Any type (หลีกเลี่ยงถ้าทำได้)
const data: any = { anything: "goes here" }
```

#### ใช้ใน React:
```typescript
interface TaskCardProps {
  task: {
    id: string
    title: string
    completed: boolean
  }
  onEdit: (task: any) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // Component logic
}
```

---

### 4. Client-Side Rendering vs Server-Side Rendering

#### "use client" Directive:

```typescript
"use client" // บอก Next.js ว่า component นี้รันฝั่ง client

import { useState } from "react"

export default function TasksPage() {
  // ใช้ browser APIs ได้ (localStorage, window, etc.)
  // ใช้ React hooks ได้
  // Interactive features
}
```

**เมื่อไหร่ต้องใช้ "use client":**
- ใช้ React hooks (useState, useEffect)
- ใช้ browser APIs (localStorage, window)
- Event handlers (onClick, onChange)
- Interactive components

**Server Components (default):**
- ไม่มี "use client"
- รันฝั่ง server เท่านั้น
- ไม่สามารถใช้ hooks หรือ browser APIs
- ดีสำหรับ SEO และ performance

---

### 5. Hydration Process

**Hydration** = กระบวนการที่ React "ทำให้มีชีวิต" กับ HTML ที่ server render มา

```
1. Server renders HTML → ส่งไปยัง browser
2. Browser แสดง HTML (ยังไม่ interactive)
3. JavaScript loads
4. React "hydrates" → เชื่อม event handlers
5. Page becomes interactive
```

**Hydration Mismatch Problem:**
```typescript
// ❌ ผิด - server และ client render ไม่เหมือนกัน
export default function Page() {
  const date = new Date() // เวลาต่างกันระหว่าง server/client
  return <div>{date.toString()}</div>
}

// ✅ ถูก - ใช้ useEffect เพื่อ render ฝั่ง client เท่านั้น
export default function Page() {
  const [date, setDate] = useState("")
  
  useEffect(() => {
    setDate(new Date().toString())
  }, [])
  
  return <div>{date}</div>
}
```

---

### 6. Tailwind CSS

**Utility-First CSS Framework** - เขียน CSS ผ่าน class names

```typescript
// แทนที่จะเขียน CSS แบบนี้:
// .button { padding: 1rem; background: blue; border-radius: 0.5rem; }

// เขียนแบบนี้:
<button className="px-4 py-2 bg-blue-500 rounded-lg">
  Click me
</button>
```

**Responsive Design:**
```typescript
<div className="
  text-sm          // mobile (default)
  sm:text-base     // ≥640px
  md:text-lg       // ≥768px
  lg:text-xl       // ≥1024px
">
  Responsive text
</div>
```

**Common Utilities:**
- `flex`, `grid` - Layout
- `p-4`, `m-2` - Padding, Margin
- `text-lg`, `font-bold` - Typography
- `bg-blue-500`, `text-white` - Colors
- `rounded-lg`, `shadow-md` - Effects

---

## 🔧 BACKEND (Hasura + PostgreSQL)

### 1. Hasura GraphQL Engine

**Hasura** = GraphQL API Generator ที่สร้าง API อัตโนมัติจาก database schema

#### ทำงานอย่างไร:

```
1. สร้าง PostgreSQL tables
   ↓
2. Hasura อ่าน schema
   ↓
3. Auto-generate GraphQL API
   - Queries (SELECT)
   - Mutations (INSERT, UPDATE, DELETE)
   - Subscriptions (Real-time)
```

#### ตัวอย่าง:

**Database Table:**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID,
  title TEXT,
  completed BOOLEAN,
  created_at TIMESTAMP
);
```

**Hasura Auto-generates:**
```graphql
# Query
query GetTasks {
  tasks {
    id
    title
    completed
  }
}

# Mutation
mutation CreateTask {
  insert_tasks_one(object: {
    title: "New task"
    completed: false
  }) {
    id
  }
}
```

---

### 2. GraphQL Basics

**GraphQL** = Query Language สำหรับ APIs (ทางเลือกของ REST)

#### REST vs GraphQL:

**REST:**
```
GET /api/users/1
GET /api/users/1/tasks
GET /api/tasks/1
```

**GraphQL:**
```graphql
query {
  user(id: 1) {
    name
    tasks {
      title
      completed
    }
  }
}
```

#### GraphQL Operations:

**1. Query (อ่านข้อมูล)**
```graphql
query GetTasks($userId: uuid!) {
  tasks(where: { user_id: { _eq: $userId } }) {
    id
    title
    completed
    created_at
  }
}
```

**2. Mutation (เปลี่ยนแปลงข้อมูล)**
```graphql
mutation CreateTask($title: String!, $userId: uuid!) {
  insert_tasks_one(object: {
    title: $title
    user_id: $userId
    completed: false
  }) {
    id
    title
  }
}
```

**3. Subscription (Real-time)**
```graphql
subscription TasksSubscription {
  tasks {
    id
    title
    completed
  }
}
```

---

### 3. Apollo Client

**Apollo Client** = GraphQL Client Library สำหรับ React

#### Setup:

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

const client = new ApolloClient({
  link: httpLink,           // HTTP connection to Hasura
  cache: new InMemoryCache() // Local cache
})
```

#### Usage in Components:

**Query:**
```typescript
const { data, loading, error } = useQuery(GET_TASKS, {
  variables: { userId: user.id },
  skip: !user?.id // ข้าม query ถ้าไม่มี userId
})

// data = ข้อมูลที่ได้
// loading = กำลังโหลดอยู่หรือไม่
// error = error object (ถ้ามี)
```

**Mutation:**
```typescript
const [deleteTask, { loading }] = useMutation(DELETE_TASK, {
  onCompleted: () => {
    // เมื่อสำเร็จ
    refetch() // Refresh data
  },
  onError: (error) => {
    // เมื่อเกิด error
    console.error(error)
  }
})

// เรียกใช้
await deleteTask({ variables: { id: taskId } })
```

---

## 🔗 การเชื่อมต่อ Frontend-Backend

### Request Flow:

```
1. User Action (Click button)
   ↓
2. React Event Handler
   ↓
3. Apollo Client Mutation/Query
   ↓
4. HTTP POST to Hasura
   Headers: { Authorization: "Bearer <token>" }
   Body: { query: "...", variables: {...} }
   ↓
5. Hasura validates token
   ↓
6. Hasura checks permissions
   ↓
7. Hasura executes SQL query
   ↓
8. PostgreSQL returns data
   ↓
9. Hasura formats as GraphQL response
   ↓
10. Apollo Client receives response
   ↓
11. Apollo Client updates cache
   ↓
12. React re-renders with new data
```

### Authentication Flow:

```typescript
// 1. Login
const response = await loginMutation({
  variables: { email, password }
})

// 2. Store token
localStorage.setItem("token", response.data.token)
localStorage.setItem("user", JSON.stringify(response.data.user))

// 3. Apollo Client adds token to all requests
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token")
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  })
  
  return forward(operation)
})

// 4. Hasura validates token on every request
// 5. Hasura applies row-level permissions
```

---

## 📝 Code Walkthrough - Key Files

### 1. app/tasks/page.tsx (Main App Page)

```typescript
"use client" // Client component

export default function TasksPage() {
  // === STATE MANAGEMENT ===
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  
  // === ROUTING ===
  const router = useRouter()
  
  // === AUTHENTICATION CHECK ===
  useEffect(() => {
    setMounted(true)
    const userData = getUser() // จาก localStorage
    setUser(userData)
    
    if (!isAuthenticated()) {
      router.push("/auth/login") // Redirect ถ้าไม่ได้ login
    }
  }, [router])
  
  // === DATA FETCHING ===
  const { data, loading, refetch } = useQuery(GET_TASKS, {
    variables: { userId: user?.id },
    skip: !user?.id
  })
  
  // === MUTATIONS ===
  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      toast({ title: "Success" })
      refetch() // Refresh task list
    }
  })
  
  // === EVENT HANDLERS ===
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteTask({ variables: { id } })
    }
  }
  
  // === DERIVED STATE ===
  const todoTasks = data?.tasks?.filter(t => !t.completed) || []
  const doneTasks = data?.tasks?.filter(t => t.completed) || []
  
  // === RENDER ===
  if (!mounted) return null // Prevent hydration mismatch
  
  return (
    <div>
      {/* Header with date */}
      {/* Task list */}
      {/* Dialog for create/edit */}
    </div>
  )
}
```

---

### 2. components/task-card.tsx

```typescript
interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    completed: boolean
    created_at: string
  }
  onEdit: (task: any) => void
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <Card 
      className="border-2 relative flex items-center"
      style={{ 
        backgroundColor: task.completed ? "#00af3b" : "#fd6e41" 
      }}
    >
      {/* Edit/Delete buttons */}
      <div className="absolute top-2 right-2">
        <Button onClick={() => onEdit(task)}>
          <Pencil />
        </Button>
        <Button onClick={() => onDelete(task.id)}>
          <Trash2 />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1">
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        {task.description && (
          <CardContent>{task.description}</CardContent>
        )}
      </div>

      {/* Complete button */}
      <Button onClick={() => onToggle(task.id, task.completed)}>
        {task.completed && <Check />}
      </Button>
    </Card>
  )
}
```

---

### 3. graphql/queries.ts & mutations.ts

```typescript
import { gql } from "@apollo/client"

// === QUERIES ===
export const GET_TASKS = gql`
  query GetTasks($userId: uuid!) {
    tasks(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      title
      description
      completed
      created_at
    }
  }
`

// === MUTATIONS ===
export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String
    $userId: uuid!
  ) {
    insert_tasks_one(object: {
      title: $title
      description: $description
      user_id: $userId
      completed: false
    }) {
      id
      title
    }
  }
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`

export const TOGGLE_TASK = gql`
  mutation ToggleTask($id: uuid!, $completed: Boolean!) {
    update_tasks_by_pk(
      pk_columns: { id: $id }
      _set: { completed: $completed }
    ) {
      id
      completed
    }
  }
`
```

---

## 🔄 Complete User Flow Example

### สร้าง Task ใหม่:

```
1. User clicks "NEW TASK" button
   ↓
2. onClick={() => setIsDialogOpen(true)}
   ↓
3. TaskDialog component renders
   ↓
4. User fills form and clicks "Save"
   ↓
5. onSubmit handler calls createTask mutation
   ↓
6. Apollo Client sends GraphQL request:
   POST http://localhost:8080/v1/graphql
   Headers: { Authorization: "Bearer <token>" }
   Body: {
     query: "mutation CreateTask(...)",
     variables: { title: "...", userId: "..." }
   }
   ↓
7. Hasura receives request
   ↓
8. Hasura validates JWT token
   ↓
9. Hasura checks permissions:
   - User can only insert tasks with their own user_id
   ↓
10. Hasura executes SQL:
    INSERT INTO tasks (title, user_id, completed)
    VALUES ('...', '...', false)
    RETURNING id, title
   ↓
11. PostgreSQL inserts row and returns data
   ↓
12. Hasura formats response as GraphQL
   ↓
13. Apollo Client receives response
   ↓
14. onCompleted callback runs:
    - Show success toast
    - refetch() to get updated task list
   ↓
15. Apollo Client fetches new task list
   ↓
16. React re-renders with new data
   ↓
17. User sees new task in the list
```

---

## 🎓 Key Concepts Summary

### React/Next.js:
- **Components**: Reusable UI pieces
- **Props**: Data passed to components
- **State**: Component's internal data
- **Hooks**: Functions to use React features
- **useEffect**: Side effects and lifecycle
- **Server/Client Components**: Where code runs

### TypeScript:
- **Type Safety**: Catch errors at compile time
- **Interfaces**: Define object shapes
- **Type Annotations**: Specify variable types
- **Generics**: Reusable type definitions

### GraphQL:
- **Schema**: API structure definition
- **Query**: Read data
- **Mutation**: Modify data
- **Variables**: Dynamic query parameters
- **Fragments**: Reusable query parts

### Apollo Client:
- **useQuery**: Fetch data
- **useMutation**: Modify data
- **Cache**: Local data storage
- **Refetch**: Update data manually

### Hasura:
- **Auto-generated API**: From database schema
- **Permissions**: Row-level security
- **Real-time**: Subscriptions support
- **JWT Authentication**: Token-based auth

---

## 🎯 Interview Preparation Tips

### คำถามที่อาจถูกถาม:

**1. "อธิบาย lifecycle ของ React component"**
- Mounting → Updating → Unmounting
- useEffect with different dependencies
- Cleanup functions

**2. "Hydration คืออะไร? ทำไมต้องระวัง?"**
- Server renders HTML → Client "hydrates"
- Mismatch เกิดเมื่อ server/client render ไม่เหมือนกัน
- แก้ด้วย useEffect หรือ dynamic import

**3. "GraphQL ต่างจาก REST อย่างไร?"**
- Single endpoint vs multiple endpoints
- Client specifies exact data needed
- Strongly typed schema
- Real-time subscriptions

**4. "อธิบาย Apollo Client cache"**
- InMemoryCache stores query results
- Automatic cache updates
- Optimistic UI updates
- Cache policies (cache-first, network-only, etc.)

**5. "Security ในโปรเจกต์นี้ทำอย่างไร?"**
- JWT token authentication
- Hasura row-level permissions
- Token in Authorization header
- User can only access their own data

---

## 📚 Further Learning

### Next.js:
- Server Components vs Client Components
- Data Fetching strategies
- Route Handlers (API routes)
- Middleware

### React:
- Context API
- useReducer for complex state
- useMemo & useCallback for optimization
- Custom hooks

### GraphQL:
- Subscriptions for real-time
- Fragments for reusable queries
- Directives (@include, @skip)
- Error handling

### TypeScript:
- Generics
- Utility types (Partial, Pick, Omit)
- Type guards
- Advanced types

---

Made with ❤️ for interview preparation
