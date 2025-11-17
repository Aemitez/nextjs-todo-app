# 🔷 GraphQL Deep Dive - หลักการทำงานโดยละเอียด

## 📚 Table of Contents
1. [GraphQL คืออะไร](#graphql-คืออะไร)
2. [GraphQL vs REST](#graphql-vs-rest)
3. [Schema & Type System](#schema--type-system)
4. [Operations](#operations)
5. [Resolvers](#resolvers)
6. [Apollo Client](#apollo-client)
7. [Caching Strategy](#caching-strategy)
8. [Error Handling](#error-handling)

---

## GraphQL คืออะไร

**GraphQL** = Query Language สำหรับ APIs + Runtime สำหรับ execute queries

```
GraphQL = Query Language + Type System + Runtime
```

### Core Concepts:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT                               │
│  Sends Query (what data it wants)                       │
│  {                                                      │
│    user(id: "1") {                                      │
│      name                                               │
│      email                                              │
│    }                                                    │
│  }                                                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  GRAPHQL SERVER                         │
│  1. Parse query                                         │
│  2. Validate against schema                             │
│  3. Execute resolvers                                   │
│  4. Return data                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE                              │
│  SELECT name, email FROM users WHERE id = 1             │
└─────────────────────────────────────────────────────────┘
```

---

## GraphQL vs REST

### REST API:

```
GET /api/users/1
Response:
{
  "id": "1",
  "name": "John",
  "email": "john@example.com",
  "age": 30,
  "address": "...",
  "phone": "...",
  "avatar": "..."
}
// ❌ Over-fetching: ได้ข้อมูลมากเกินต้องการ

GET /api/users/1/posts
Response:
[
  { "id": "1", "title": "Post 1", ... },
  { "id": "2", "title": "Post 2", ... }
]

GET /api/posts/1/comments
Response:
[
  { "id": "1", "text": "Comment 1", ... }
]
// ❌ Under-fetching: ต้อง request หลายครั้ง
// ❌ N+1 Problem: หลาย requests
```

---

### GraphQL API:

```graphql
# Single request
query {
  user(id: "1") {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}

# Response: ได้แค่ที่ขอ
{
  "data": {
    "user": {
      "name": "John",
      "email": "john@example.com",
      "posts": [
        {
          "title": "Post 1",
          "comments": [
            { "text": "Comment 1" }
          ]
        }
      ]
    }
  }
}

// ✅ No over-fetching: ได้แค่ที่ต้องการ
// ✅ No under-fetching: ได้ครบใน 1 request
// ✅ Single endpoint: /graphql
```

---

### Comparison Table:

```
┌──────────────────┬─────────────────┬─────────────────┐
│                  │      REST       │    GraphQL      │
├──────────────────┼─────────────────┼─────────────────┤
│ Endpoints        │ Multiple        │ Single          │
│ Data Fetching    │ Fixed structure │ Client decides  │
│ Over-fetching    │ Common          │ No              │
│ Under-fetching   │ Common          │ No              │
│ Versioning       │ /v1, /v2        │ No need         │
│ Documentation    │ Manual          │ Auto-generated  │
│ Type Safety      │ No              │ Yes             │
│ Learning Curve   │ Easy            │ Moderate        │
└──────────────────┴─────────────────┴─────────────────┘
```

---

## Schema & Type System

### Schema = Contract between Client & Server

```graphql
# Schema Definition Language (SDL)

# Scalar Types (Built-in)
scalar ID
scalar String
scalar Int
scalar Float
scalar Boolean

# Custom Scalar
scalar DateTime
scalar JSON

# Object Type
type User {
  id: ID!              # ! = required (non-null)
  name: String!
  email: String!
  age: Int
  posts: [Post!]!      # Array of Posts (non-null)
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!        # Relationship
  comments: [Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

# Input Type (for mutations)
input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

# Enum Type
enum Role {
  ADMIN
  USER
  GUEST
}

# Interface (shared fields)
interface Node {
  id: ID!
  createdAt: DateTime!
}

type User implements Node {
  id: ID!
  createdAt: DateTime!
  name: String!
}

# Union Type
union SearchResult = User | Post | Comment

# Root Types
type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  search(query: String!): [SearchResult!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: CreateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

type Subscription {
  userCreated: User!
  postUpdated(id: ID!): Post!
}
```

---

## Operations

### 1. Query (Read Data)

```graphql
# Basic Query
query {
  users {
    id
    name
  }
}

# Query with Arguments
query {
  user(id: "1") {
    name
    email
  }
}

# Query with Variables
query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    email
  }
}

# Variables (sent separately)
{
  "userId": "1"
}

# Nested Query
query {
  user(id: "1") {
    name
    posts {
      title
      comments {
        text
        author {
          name
        }
      }
    }
  }
}

# Multiple Queries (with aliases)
query {
  user1: user(id: "1") {
    name
  }
  user2: user(id: "2") {
    name
  }
}

# Fragments (reusable fields)
fragment UserFields on User {
  id
  name
  email
}

query {
  user1: user(id: "1") {
    ...UserFields
  }
  user2: user(id: "2") {
    ...UserFields
  }
}
```

---

### 2. Mutation (Write Data)

```graphql
# Create
mutation {
  createUser(input: {
    name: "John"
    email: "john@example.com"
  }) {
    id
    name
  }
}

# Update
mutation {
  updateUser(
    id: "1"
    input: { name: "Jane" }
  ) {
    id
    name
  }
}

# Delete
mutation {
  deleteUser(id: "1")
}

# Multiple Mutations
mutation {
  createUser(input: { name: "John" }) {
    id
  }
  createPost(input: { title: "Hello" }) {
    id
  }
}

# With Variables
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}

# Variables
{
  "input": {
    "name": "John",
    "email": "john@example.com"
  }
}
```

---

### 3. Subscription (Real-time)

```graphql
# Subscribe to new users
subscription {
  userCreated {
    id
    name
    email
  }
}

# Subscribe with filter
subscription {
  postUpdated(id: "1") {
    title
    content
  }
}

# Client receives updates:
{
  "data": {
    "userCreated": {
      "id": "2",
      "name": "Jane",
      "email": "jane@example.com"
    }
  }
}
```

---

## Resolvers

**Resolver** = Function ที่ fetch ข้อมูลสำหรับแต่ละ field

### Resolver Structure:

```javascript
const resolvers = {
  // Query resolvers
  Query: {
    user: (parent, args, context, info) => {
      // parent: ผลลัพธ์จาก parent resolver
      // args: arguments ที่ส่งมา { id: "1" }
      // context: shared data (db, user, etc.)
      // info: query metadata
      
      return context.db.users.findById(args.id)
    },
    
    users: (parent, args, context) => {
      return context.db.users.findAll()
    }
  },
  
  // Mutation resolvers
  Mutation: {
    createUser: (parent, args, context) => {
      const user = context.db.users.create(args.input)
      return user
    },
    
    deleteUser: (parent, args, context) => {
      context.db.users.delete(args.id)
      return true
    }
  },
  
  // Field resolvers
  User: {
    // Resolve posts field
    posts: (parent, args, context) => {
      // parent = User object
      return context.db.posts.findByUserId(parent.id)
    },
    
    // Computed field
    fullName: (parent) => {
      return `${parent.firstName} ${parent.lastName}`
    }
  },
  
  Post: {
    author: (parent, args, context) => {
      return context.db.users.findById(parent.authorId)
    },
    
    comments: (parent, args, context) => {
      return context.db.comments.findByPostId(parent.id)
    }
  }
}
```

---

### Resolver Execution:

```graphql
query {
  user(id: "1") {
    name
    posts {
      title
      author {
        name
      }
    }
  }
}
```

**Execution Flow:**

```
1. Query.user(id: "1")
   → Returns: { id: "1", name: "John", ... }
   
2. User.name
   → Returns: "John" (from parent)
   
3. User.posts
   → Returns: [{ id: "1", title: "Post 1", authorId: "1" }, ...]
   
4. For each post:
   4.1. Post.title
        → Returns: "Post 1"
   
   4.2. Post.author
        → Returns: { id: "1", name: "John" }
   
   4.3. User.name
        → Returns: "John"

Final Result:
{
  "data": {
    "user": {
      "name": "John",
      "posts": [
        {
          "title": "Post 1",
          "author": {
            "name": "John"
          }
        }
      ]
    }
  }
}
```

---

## Apollo Client

**Apollo Client** = GraphQL Client Library สำหรับ React

### Setup:

```javascript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"

// 1. Create HTTP Link
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql'
})

// 2. Create Auth Link (add token to headers)
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token')
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  })
  
  return forward(operation)
})

// 3. Create Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client
```

---

### Usage in React:

```javascript
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

// Define Query
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`

// Define Mutation
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`

function UserList() {
  // ═══════════════════════════════════════════════════
  // QUERY
  // ═══════════════════════════════════════════════════
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    // Options
    variables: { limit: 10 },
    fetchPolicy: 'cache-first', // cache strategy
    pollInterval: 5000, // refetch every 5s
    onCompleted: (data) => {
      console.log('Query completed', data)
    },
    onError: (error) => {
      console.error('Query error', error)
    }
  })
  
  // ═══════════════════════════════════════════════════
  // MUTATION
  // ═══════════════════════════════════════════════════
  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    // Options
    onCompleted: (data) => {
      console.log('User created', data)
      refetch() // Refresh user list
    },
    onError: (error) => {
      console.error('Mutation error', error)
    },
    // Update cache manually
    update: (cache, { data }) => {
      const existing = cache.readQuery({ query: GET_USERS })
      cache.writeQuery({
        query: GET_USERS,
        data: {
          users: [...existing.users, data.createUser]
        }
      })
    }
  })
  
  // ═══════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════
  const handleCreate = async () => {
    await createUser({
      variables: {
        input: {
          name: 'John',
          email: 'john@example.com'
        }
      }
    })
  }
  
  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <button onClick={handleCreate} disabled={creating}>
        Create User
      </button>
      
      <ul>
        {data.users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Caching Strategy

### InMemoryCache:

```javascript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming]
          }
        }
      }
    }
  }
})
```

---

### Cache Normalization:

```javascript
// Query Response:
{
  "data": {
    "user": {
      "id": "1",
      "name": "John",
      "posts": [
        {
          "id": "1",
          "title": "Post 1",
          "author": {
            "id": "1",
            "name": "John"
          }
        }
      ]
    }
  }
}

// Normalized Cache:
{
  "User:1": {
    "__typename": "User",
    "id": "1",
    "name": "John",
    "posts": [{ "__ref": "Post:1" }]
  },
  "Post:1": {
    "__typename": "Post",
    "id": "1",
    "title": "Post 1",
    "author": { "__ref": "User:1" }
  }
}

// Benefits:
// 1. No duplicate data
// 2. Automatic updates across queries
// 3. Efficient memory usage
```

---

### Fetch Policies:

```javascript
useQuery(GET_USERS, {
  fetchPolicy: 'cache-first' // Default
})

// Policies:
// 1. cache-first
//    - Check cache first
//    - If not found, fetch from network
//    - Good for: Static data

// 2. cache-only
//    - Only use cache
//    - Never fetch from network
//    - Good for: Offline mode

// 3. network-only
//    - Always fetch from network
//    - Don't use cache
//    - Good for: Real-time data

// 4. no-cache
//    - Fetch from network
//    - Don't store in cache
//    - Good for: Sensitive data

// 5. cache-and-network
//    - Return cache immediately
//    - Fetch from network in background
//    - Update cache when done
//    - Good for: Best UX
```

---

## Error Handling

### GraphQL Error Response:

```json
{
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND",
        "userId": "999"
      }
    }
  ],
  "data": {
    "user": null
  }
}
```

---

### Handling Errors:

```javascript
function UserProfile({ userId }) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId }
  })
  
  // Network Error
  if (error?.networkError) {
    return <div>Network error: {error.networkError.message}</div>
  }
  
  // GraphQL Errors
  if (error?.graphQLErrors) {
    return (
      <div>
        {error.graphQLErrors.map((err, i) => (
          <div key={i}>
            {err.message}
            {err.extensions?.code === 'NOT_FOUND' && (
              <p>User not found</p>
            )}
          </div>
        ))}
      </div>
    )
  }
  
  if (loading) return <div>Loading...</div>
  
  return <div>{data.user.name}</div>
}
```

---

## Complete Request Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. CLIENT                                               │
│    User clicks button                                   │
│    ↓                                                    │
│    Call useMutation                                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. APOLLO CLIENT                                        │
│    - Check cache (if query)                             │
│    - Build HTTP request                                 │
│    - Add headers (auth token)                           │
│    - Send POST to /graphql                              │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. GRAPHQL SERVER (Hasura)                              │
│    - Parse query                                        │
│    - Validate against schema                            │
│    - Check permissions                                  │
│    - Execute resolvers                                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. DATABASE (PostgreSQL)                                │
│    - Execute SQL query                                  │
│    - Return data                                        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. GRAPHQL SERVER                                       │
│    - Format response                                    │
│    - Return JSON                                        │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. APOLLO CLIENT                                        │
│    - Receive response                                   │
│    - Normalize data                                     │
│    - Update cache                                       │
│    - Trigger re-render                                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 7. REACT                                                │
│    - Component re-renders                               │
│    - UI updates                                         │
│    - User sees new data                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

### Key Concepts:

1. **Single Endpoint**: `/graphql` for all operations
2. **Client-Specified Queries**: Client decides what data to fetch
3. **Strong Type System**: Schema defines API contract
4. **Efficient Data Fetching**: No over/under-fetching
5. **Real-time**: Subscriptions for live updates
6. **Caching**: Automatic cache management
7. **Introspection**: Self-documenting API

### Best Practices:

```
✅ Use fragments for reusable fields
✅ Use variables instead of string interpolation
✅ Implement proper error handling
✅ Use cache policies appropriately
✅ Normalize cache for efficiency
✅ Use pagination for large lists
✅ Implement optimistic UI updates
✅ Use subscriptions for real-time features
```

---

Made with ❤️ for GraphQL learners
