# 🚀 Next.js Deep Dive - หลักการทำงานโดยละเอียด

## 📚 Table of Contents
1. [Next.js คืออะไร](#nextjs-คืออะไร)
2. [Rendering Strategies](#rendering-strategies)
3. [App Router Architecture](#app-router-architecture)
4. [Server vs Client Components](#server-vs-client-components)
5. [Data Fetching](#data-fetching)
6. [Routing System](#routing-system)
7. [Build & Deploy Process](#build--deploy-process)

---

## Next.js คืออะไร

**Next.js** = React Framework ที่เพิ่มความสามารถให้กับ React

```
React (Library)
  ↓
Next.js (Framework)
  ↓
Adds:
- Routing
- Server-Side Rendering
- Static Site Generation
- API Routes
- Image Optimization
- Code Splitting
- และอื่นๆ
```

### React vs Next.js:

```javascript
// ═══════════════════════════════════════════════════
// REACT (Client-Side Only)
// ═══════════════════════════════════════════════════
// 1. Browser requests page
// 2. Server sends empty HTML + JS bundle
// 3. Browser downloads JS
// 4. React renders UI
// 5. User sees content (slow initial load)

// index.html
<div id="root"></div>
<script src="bundle.js"></script>

// ═══════════════════════════════════════════════════
// NEXT.JS (Server + Client)
// ═══════════════════════════════════════════════════
// 1. Browser requests page
// 2. Server renders React to HTML
// 3. Server sends HTML (user sees content immediately!)
// 4. Browser downloads JS
// 5. React "hydrates" (makes interactive)

// Generated HTML
<div id="root">
  <h1>Hello World</h1>
  <button>Click me</button>
</div>
<script src="bundle.js"></script>
```

---

## Rendering Strategies

Next.js รองรับ 4 วิธีในการ render:

### 1. Server-Side Rendering (SSR)

```
Request → Server renders → Send HTML → Hydrate
```

```javascript
// app/page.tsx
export default async function Page() {
  // Fetch data on server
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  
  // Render on server
  return <div>{json.title}</div>
}

// Timeline:
// 1. User requests /
// 2. Server fetches data
// 3. Server renders React to HTML
// 4. Server sends HTML to browser
// 5. User sees content (fast!)
// 6. JS loads and hydrates
```

**Pros:**
- ✅ Fast initial load
- ✅ Good for SEO
- ✅ Fresh data every request

**Cons:**
- ❌ Slower than static (server processing)
- ❌ More server load

---

### 2. Static Site Generation (SSG)

```
Build time → Generate HTML → Cache → Serve instantly
```

```javascript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)
  return <article>{post.content}</article>
}

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map(post => ({
    slug: post.slug
  }))
}

// Timeline:
// Build time:
// 1. Next.js calls generateStaticParams()
// 2. For each slug, renders page to HTML
// 3. Saves HTML files

// Request time:
// 1. User requests /blog/hello-world
// 2. Server serves pre-built HTML (instant!)
// 3. No server processing needed
```

**Pros:**
- ✅ Fastest (pre-built)
- ✅ Cheap hosting (static files)
- ✅ Great for SEO

**Cons:**
- ❌ Data can be stale
- ❌ Need rebuild for updates

---

### 3. Incremental Static Regeneration (ISR)

```
Static + Revalidation = Best of both worlds
```

```javascript
// app/products/[id]/page.tsx
export const revalidate = 60 // Revalidate every 60 seconds

export default async function Product({ params }) {
  const product = await getProduct(params.id)
  return <div>{product.name}</div>
}

// Timeline:
// First request:
// 1. User requests /products/123
// 2. Server generates HTML (SSR)
// 3. Caches HTML for 60 seconds
// 4. Serves cached HTML

// Subsequent requests (within 60s):
// 1. User requests /products/123
// 2. Server serves cached HTML (instant!)

// After 60 seconds:
// 1. Next request triggers revalidation
// 2. Server regenerates HTML in background
// 3. Serves old cache (still fast!)
// 4. Updates cache with new HTML
```

**Pros:**
- ✅ Fast (cached)
- ✅ Fresh data (revalidates)
- ✅ Low server load

**Cons:**
- ❌ Slightly complex
- ❌ First user after revalidation sees old data

---

### 4. Client-Side Rendering (CSR)

```
Empty HTML → JS loads → Fetch data → Render
```

```javascript
"use client" // Client Component

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  if (!data) return <div>Loading...</div>
  
  return <div>{data.title}</div>
}

// Timeline:
// 1. User requests /dashboard
// 2. Server sends HTML with <div>Loading...</div>
// 3. Browser renders loading state
// 4. JS loads
// 5. useEffect runs
// 6. Fetches data from API
// 7. Updates UI with data
```

**Pros:**
- ✅ Interactive
- ✅ No server load for rendering
- ✅ Good for authenticated pages

**Cons:**
- ❌ Slow initial load
- ❌ Bad for SEO
- ❌ Loading states needed

---

## App Router Architecture

### File System = Routing

```
app/
├── page.tsx                    → /
├── about/
│   └── page.tsx                → /about
├── blog/
│   ├── page.tsx                → /blog
│   └── [slug]/
│       └── page.tsx            → /blog/:slug
└── dashboard/
    ├── layout.tsx              → Layout for /dashboard/*
    ├── page.tsx                → /dashboard
    └── settings/
        └── page.tsx            → /dashboard/settings
```

### Special Files:

```
app/
├── layout.tsx          # Layout wrapper (persistent)
├── page.tsx            # Page content (unique per route)
├── loading.tsx         # Loading UI (Suspense fallback)
├── error.tsx           # Error UI (Error Boundary)
├── not-found.tsx       # 404 UI
└── template.tsx        # Re-renders on navigation
```

---

### Layout System:

```javascript
// app/layout.tsx (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

// app/dashboard/layout.tsx (Nested Layout)
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  )
}

// app/dashboard/page.tsx
export default function Dashboard() {
  return <h1>Dashboard</h1>
}

// Rendered HTML:
<html>
  <body>
    <Header />
    <div>
      <Sidebar />
      <main>
        <h1>Dashboard</h1>
      </main>
    </div>
    <Footer />
  </body>
</html>
```

**Layout Nesting:**

```
URL: /dashboard/settings

Layouts applied:
1. app/layout.tsx (Root)
2. app/dashboard/layout.tsx (Dashboard)
3. app/dashboard/settings/page.tsx (Page)

Result:
<RootLayout>
  <DashboardLayout>
    <SettingsPage />
  </DashboardLayout>
</RootLayout>
```

---

## Server vs Client Components

### Server Components (Default)

```javascript
// app/page.tsx
// No "use client" = Server Component

export default async function Page() {
  // ✅ Can use async/await
  const data = await fetch('https://api.example.com/data')
  
  // ✅ Can access server-only resources
  const db = await connectToDatabase()
  
  // ✅ Can use server-only packages
  import fs from 'fs'
  
  // ❌ Cannot use hooks
  // const [state, setState] = useState() // Error!
  
  // ❌ Cannot use browser APIs
  // localStorage.getItem('token') // Error!
  
  // ❌ Cannot use event handlers
  // <button onClick={() => {}}>Click</button> // Error!
  
  return <div>{data.title}</div>
}
```

**Server Component Benefits:**

```
1. Zero JavaScript to client
   - Smaller bundle size
   - Faster page load

2. Direct database access
   - No API layer needed
   - Secure (credentials stay on server)

3. Better SEO
   - Fully rendered HTML
   - Search engines see content

4. Automatic code splitting
   - Only needed code sent to client
```

---

### Client Components

```javascript
"use client" // Required directive

import { useState } from 'react'

export default function Counter() {
  // ✅ Can use hooks
  const [count, setCount] = useState(0)
  
  // ✅ Can use browser APIs
  const token = localStorage.getItem('token')
  
  // ✅ Can use event handlers
  const handleClick = () => setCount(count + 1)
  
  // ❌ Cannot use async/await in component
  // async function Counter() {} // Error!
  
  // ❌ Cannot access server-only resources
  // const db = await connectToDatabase() // Error!
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  )
}
```

**Client Component Use Cases:**

```
Use Client Components when you need:
- useState, useEffect, other hooks
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- Third-party libraries that use hooks
- Interactive features
```

---

### Composition Pattern:

```javascript
// ✅ Good - Server Component with Client Component children
// app/page.tsx (Server Component)
import ClientCounter from './ClientCounter'

export default async function Page() {
  const data = await fetchData() // Server-side
  
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientCounter /> {/* Client Component */}
    </div>
  )
}

// app/ClientCounter.tsx (Client Component)
"use client"

export default function ClientCounter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Component Tree:**

```
Server Component (page.tsx)
├── Server Component (Header)
├── Client Component (Counter)
│   └── Server Component as children ✅
└── Server Component (Footer)
```

---

## Data Fetching

### Server Components (Recommended):

```javascript
// app/posts/page.tsx
export default async function Posts() {
  // Fetch on server
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // Default: cache forever
  })
  const posts = await res.json()
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**Caching Options:**

```javascript
// 1. Cache forever (default)
fetch(url, { cache: 'force-cache' })

// 2. No cache (always fresh)
fetch(url, { cache: 'no-store' })

// 3. Revalidate after time
fetch(url, { next: { revalidate: 60 } }) // 60 seconds
```

---

### Parallel Data Fetching:

```javascript
// ❌ Sequential (slow)
export default async function Page() {
  const user = await fetchUser()
  const posts = await fetchPosts() // Waits for user
  const comments = await fetchComments() // Waits for posts
  
  // Total time = user + posts + comments
}

// ✅ Parallel (fast)
export default async function Page() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ])
  
  // Total time = max(user, posts, comments)
}
```

---

### Client Components:

```javascript
"use client"

import { useState, useEffect } from 'react'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

## Routing System

### Dynamic Routes:

```javascript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  // URL: /blog/hello-world
  // params.slug = "hello-world"
  
  return <h1>Post: {params.slug}</h1>
}

// app/shop/[category]/[product]/page.tsx
export default function Product({ params }) {
  // URL: /shop/electronics/laptop
  // params.category = "electronics"
  // params.product = "laptop"
  
  return (
    <div>
      <h1>Category: {params.category}</h1>
      <h2>Product: {params.product}</h2>
    </div>
  )
}
```

---

### Catch-all Routes:

```javascript
// app/docs/[...slug]/page.tsx
export default function Docs({ params }) {
  // URL: /docs/getting-started/installation
  // params.slug = ["getting-started", "installation"]
  
  // URL: /docs/api/reference/hooks
  // params.slug = ["api", "reference", "hooks"]
  
  return <div>Path: {params.slug.join('/')}</div>
}
```

---

### Route Groups:

```javascript
// Organize routes without affecting URL

app/
├── (marketing)/
│   ├── layout.tsx          # Marketing layout
│   ├── page.tsx            → /
│   └── about/
│       └── page.tsx        → /about
└── (shop)/
    ├── layout.tsx          # Shop layout
    ├── products/
    │   └── page.tsx        → /products
    └── cart/
        └── page.tsx        → /cart

// Different layouts, same URL structure
```

---

### Navigation:

```javascript
"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  
  return (
    <div>
      {/* Declarative navigation */}
      <Link href="/about">About</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </button>
      
      {/* With query params */}
      <Link href="/search?q=nextjs">Search</Link>
      
      {/* Dynamic route */}
      <Link href={`/blog/${post.slug}`}>Read Post</Link>
    </div>
  )
}
```

---

## Build & Deploy Process

### Development Mode:

```bash
npm run dev

# What happens:
# 1. Start dev server (http://localhost:3000)
# 2. Watch for file changes
# 3. Hot Module Replacement (HMR)
# 4. Fast Refresh (preserve state)
# 5. On-demand compilation
```

---

### Production Build:

```bash
npm run build

# Build process:
┌─────────────────────────────────────────────────────────┐
│ 1. COMPILATION                                          │
│    - TypeScript → JavaScript                            │
│    - JSX → JavaScript                                   │
│    - Optimize code                                      │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. BUNDLING                                             │
│    - Combine files                                      │
│    - Tree shaking (remove unused code)                  │
│    - Code splitting (separate bundles)                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. STATIC GENERATION                                    │
│    - Generate static pages (SSG)                        │
│    - Pre-render Server Components                       │
│    - Create HTML files                                  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. OPTIMIZATION                                         │
│    - Minify JavaScript                                  │
│    - Optimize images                                    │
│    - Generate source maps                               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. OUTPUT                                               │
│    .next/                                               │
│    ├── static/                                          │
│    │   ├── chunks/        # JavaScript bundles          │
│    │   └── css/           # CSS files                   │
│    └── server/                                          │
│        ├── app/           # Server Components           │
│        └── pages/         # API routes                  │
└─────────────────────────────────────────────────────────┘
```

---

### Build Output:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    137 B          85.2 kB
├ ○ /about                               142 B          85.3 kB
├ ƒ /blog/[slug]                         168 B          85.4 kB
└ ○ /contact                             139 B          85.2 kB

○  (Static)  automatically rendered as static HTML
ƒ  (Dynamic) server-rendered on demand
```

**Symbols:**
- `○` Static = Pre-rendered at build time
- `ƒ` Dynamic = Rendered on each request
- `λ` Server = API route

---

### Deployment:

```bash
# 1. Build
npm run build

# 2. Start production server
npm start

# Or deploy to Vercel (recommended)
vercel deploy
```

**Deployment Flow:**

```
1. Push code to Git
   ↓
2. Vercel detects push
   ↓
3. Runs npm run build
   ↓
4. Deploys to CDN
   ↓
5. Assigns URL
   ↓
6. Site is live!
```

---

## Request Lifecycle

### Complete Request Flow:

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER REQUEST                                         │
│    Browser → GET /dashboard                             │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. ROUTING                                              │
│    Next.js matches route                                │
│    → app/dashboard/page.tsx                             │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. MIDDLEWARE (Optional)                                │
│    - Authentication check                               │
│    - Redirects                                          │
│    - Headers modification                               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. LAYOUTS                                              │
│    Render nested layouts:                               │
│    - app/layout.tsx (Root)                              │
│    - app/dashboard/layout.tsx (Dashboard)               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. SERVER COMPONENTS                                    │
│    - Fetch data (async/await)                           │
│    - Access database                                    │
│    - Render to React Server Component Payload           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. STREAMING (Optional)                                 │
│    - Send HTML chunks as they're ready                  │
│    - Show loading states                                │
│    - Progressive rendering                              │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 7. HTML GENERATION                                      │
│    - Combine layouts + page                             │
│    - Inject Client Component markers                    │
│    - Generate final HTML                                │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 8. RESPONSE                                             │
│    Server → HTML + JavaScript bundles                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 9. BROWSER RENDERING                                    │
│    - Parse HTML                                         │
│    - Display content (user sees page!)                  │
│    - Download JavaScript                                │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 10. HYDRATION                                           │
│    - React attaches to HTML                             │
│    - Client Components become interactive               │
│    - Event handlers attached                            │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

### Key Concepts:

1. **Hybrid Rendering**: Server + Client components
2. **File-based Routing**: Folder structure = URLs
3. **Automatic Optimization**: Code splitting, image optimization
4. **Multiple Rendering Strategies**: SSR, SSG, ISR, CSR
5. **React Server Components**: Zero JS to client
6. **Streaming**: Progressive rendering

### When to Use What:

```
Static Content (Blog, Docs)
→ SSG (generateStaticParams)

Dynamic Content (Dashboard, Profile)
→ SSR (Server Components)

Frequently Updated (Product Prices)
→ ISR (revalidate)

Highly Interactive (Games, Editors)
→ CSR (Client Components)
```

---

Made with ❤️ for Next.js learners
