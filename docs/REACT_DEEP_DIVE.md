# ⚛️ React Deep Dive - หลักการทำงานโดยละเอียด

## 📚 Table of Contents
1. [React คือะไร](#react-คืออะไร)
2. [Virtual DOM](#virtual-dom)
3. [Component Lifecycle](#component-lifecycle)
4. [Rendering Process](#rendering-process)
5. [Hooks Deep Dive](#hooks-deep-dive)
6. [State Management](#state-management)
7. [Re-rendering Rules](#re-rendering-rules)

---

## React คืออะไร

**React** = JavaScript Library สำหรับสร้าง User Interface แบบ Component-Based

### Core Concepts:

```
React = Components + State + Props + Virtual DOM
```

**1. Components** = Building blocks ของ UI
**2. State** = ข้อมูลที่เปลี่ยนแปลงได้
**3. Props** = ข้อมูลที่ส่งระหว่าง components
**4. Virtual DOM** = DOM จำลองใน memory

---

## Virtual DOM

### ปัญหาของ Real DOM:

```javascript
// Real DOM manipulation (ช้า)
document.getElementById('title').innerHTML = 'New Title'
document.getElementById('count').innerHTML = '5'
document.getElementById('status').className = 'active'

// ทุกครั้งที่เปลี่ยน DOM:
// 1. Browser recalculates layout
// 2. Browser repaints screen
// 3. ช้ามาก ถ้าเปลี่ยนบ่อยๆ
```

### Virtual DOM Solution:

```
1. React สร้าง Virtual DOM (JavaScript Object)
   ↓
2. เมื่อ state เปลี่ยน → สร้าง Virtual DOM ใหม่
   ↓
3. เปรียบเทียบ (Diffing Algorithm)
   Old Virtual DOM vs New Virtual DOM
   ↓
4. หาส่วนที่ต่างกัน (Reconciliation)
   ↓
5. Update เฉพาะส่วนที่เปลี่ยนใน Real DOM
   ↓
6. เร็วกว่ามาก!
```

### ตัวอย่าง:

```javascript
// Virtual DOM (JavaScript Object)
const virtualDOM = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello' }
      },
      {
        type: 'p',
        props: { children: 'World' }
      }
    ]
  }
}

// React แปลงเป็น Real DOM
<div class="container">
  <h1>Hello</h1>
  <p>World</p>
</div>
```

---

## Component Lifecycle

### Class Component Lifecycle (เก่า):

```
┌─────────────────────────────────────────────────────────┐
│                    MOUNTING PHASE                       │
│  (Component ถูกสร้างและใส่เข้า DOM)                     │
├─────────────────────────────────────────────────────────┤
│  1. constructor()                                       │
│     - Initialize state                                  │
│     - Bind methods                                      │
│  ↓                                                      │
│  2. static getDerivedStateFromProps()                   │
│     - Sync state with props                            │
│  ↓                                                      │
│  3. render()                                            │
│     - Return JSX                                        │
│  ↓                                                      │
│  4. componentDidMount()                                 │
│     - API calls                                         │
│     - Subscriptions                                     │
│     - DOM manipulation                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    UPDATING PHASE                       │
│  (Component re-render เมื่อ props/state เปลี่ยน)       │
├─────────────────────────────────────────────────────────┤
│  1. static getDerivedStateFromProps()                   │
│  ↓                                                      │
│  2. shouldComponentUpdate()                             │
│     - Return true/false (optimize)                     │
│  ↓                                                      │
│  3. render()                                            │
│  ↓                                                      │
│  4. getSnapshotBeforeUpdate()                          │
│     - Capture DOM info before update                   │
│  ↓                                                      │
│  5. componentDidUpdate()                                │
│     - API calls based on changes                       │
│     - DOM updates                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   UNMOUNTING PHASE                      │
│  (Component ถูกลบออกจาก DOM)                            │
├─────────────────────────────────────────────────────────┤
│  1. componentWillUnmount()                              │
│     - Cleanup subscriptions                             │
│     - Cancel timers                                     │
│     - Remove event listeners                            │
└─────────────────────────────────────────────────────────┘
```

### Function Component Lifecycle (ใหม่ - ใช้ Hooks):

```javascript
function MyComponent() {
  // ═══════════════════════════════════════════════════
  // PHASE 1: INITIALIZATION
  // ═══════════════════════════════════════════════════
  // รันทุกครั้งที่ render (แต่ state จะถูก preserve)
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  // ═══════════════════════════════════════════════════
  // PHASE 2: MOUNTING (componentDidMount)
  // ═══════════════════════════════════════════════════
  useEffect(() => {
    console.log('Component mounted!')
    // API calls, subscriptions
    fetchData()
    
    // PHASE 4: UNMOUNTING (componentWillUnmount)
    return () => {
      console.log('Component will unmount!')
      // Cleanup
      cancelSubscription()
    }
  }, []) // Empty array = รันครั้งเดียวตอน mount
  
  // ═══════════════════════════════════════════════════
  // PHASE 3: UPDATING (componentDidUpdate)
  // ═══════════════════════════════════════════════════
  useEffect(() => {
    console.log('Count changed:', count)
    // รันทุกครั้งที่ count เปลี่ยน
  }, [count]) // Dependency array
  
  // ═══════════════════════════════════════════════════
  // RENDER PHASE
  // ═══════════════════════════════════════════════════
  return (
    <div>
      <h1>{name}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

---

## Rendering Process

### Complete Rendering Flow:

```
┌─────────────────────────────────────────────────────────┐
│ 1. TRIGGER PHASE                                        │
│    - Initial render                                     │
│    - State update (setState)                            │
│    - Parent re-render                                   │
│    - Context change                                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. RENDER PHASE (Pure, No Side Effects)                │
│    React calls component function                       │
│    ┌─────────────────────────────────────────────┐    │
│    │ function MyComponent() {                     │    │
│    │   const [count, setCount] = useState(0)      │    │
│    │   return <div>{count}</div>                  │    │
│    │ }                                            │    │
│    └─────────────────────────────────────────────┘    │
│    ↓                                                    │
│    Returns JSX (React Elements)                        │
│    ┌─────────────────────────────────────────────┐    │
│    │ {                                            │    │
│    │   type: 'div',                               │    │
│    │   props: { children: '0' }                   │    │
│    │ }                                            │    │
│    └─────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. RECONCILIATION PHASE                                 │
│    Diffing Algorithm                                    │
│    ┌──────────────────┐    ┌──────────────────┐       │
│    │  Old Virtual DOM │ vs │  New Virtual DOM │       │
│    └──────────────────┘    └──────────────────┘       │
│              ↓                                          │
│    Find differences (minimal changes)                   │
│    ┌─────────────────────────────────────────────┐    │
│    │ Changes:                                     │    │
│    │ - Update text in <div> from '0' to '1'      │    │
│    └─────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. COMMIT PHASE (Side Effects Allowed)                 │
│    Apply changes to Real DOM                            │
│    ┌─────────────────────────────────────────────┐    │
│    │ document.getElementById('root')              │    │
│    │   .querySelector('div')                      │    │
│    │   .textContent = '1'                         │    │
│    └─────────────────────────────────────────────┘    │
│    ↓                                                    │
│    Run useLayoutEffect (synchronous)                   │
│    ↓                                                    │
│    Browser paints screen                               │
│    ↓                                                    │
│    Run useEffect (asynchronous)                        │
└─────────────────────────────────────────────────────────┘
```

### Detailed Example:

```javascript
function Counter() {
  console.log('1. Render phase starts')
  
  const [count, setCount] = useState(0)
  
  console.log('2. Current count:', count)
  
  useEffect(() => {
    console.log('5. useEffect runs (after paint)')
  })
  
  useLayoutEffect(() => {
    console.log('4. useLayoutEffect runs (before paint)')
  })
  
  console.log('3. Render phase ends, returning JSX')
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => {
        console.log('User clicked!')
        setCount(count + 1)
        // Triggers re-render
      }}>
        Increment
      </button>
    </div>
  )
}

// Output sequence:
// 1. Render phase starts
// 2. Current count: 0
// 3. Render phase ends, returning JSX
// 4. useLayoutEffect runs (before paint)
// [Browser paints screen]
// 5. useEffect runs (after paint)
```

---

## Hooks Deep Dive

### 1. useState

```javascript
function useState(initialValue) {
  // Simplified implementation
  let state = initialValue
  
  function setState(newValue) {
    state = newValue
    // Trigger re-render
    scheduleRerender()
  }
  
  return [state, setState]
}

// Usage
const [count, setCount] = useState(0)

// Behind the scenes:
// React stores state in a "fiber" node
// Each component instance has its own state
```

**State Update Rules:**

```javascript
// ❌ Wrong - Direct mutation
const [user, setUser] = useState({ name: 'John' })
user.name = 'Jane' // ไม่ trigger re-render!

// ✅ Correct - Create new object
setUser({ ...user, name: 'Jane' })

// ❌ Wrong - Stale closure
const [count, setCount] = useState(0)
setTimeout(() => {
  setCount(count + 1) // count = 0 (stale)
}, 1000)

// ✅ Correct - Functional update
setTimeout(() => {
  setCount(prev => prev + 1) // prev = current value
}, 1000)
```

**Batching:**

```javascript
function handleClick() {
  setCount(count + 1)  // count = 0 → 1
  setCount(count + 1)  // count = 0 → 1 (same!)
  setCount(count + 1)  // count = 0 → 1 (same!)
  // Result: count = 1 (not 3!)
  
  // React batches updates
  // Only 1 re-render
}

// Fix with functional updates:
function handleClick() {
  setCount(c => c + 1)  // 0 → 1
  setCount(c => c + 1)  // 1 → 2
  setCount(c => c + 1)  // 2 → 3
  // Result: count = 3 ✅
}
```

---

### 2. useEffect

```javascript
useEffect(
  () => {
    // Effect function
    // Runs AFTER render & paint
    
    return () => {
      // Cleanup function
      // Runs BEFORE next effect
      // Runs BEFORE unmount
    }
  },
  [dependencies] // Dependency array
)
```

**Dependency Array Rules:**

```javascript
// 1. No array = Run every render
useEffect(() => {
  console.log('Every render')
})

// 2. Empty array = Run once (mount only)
useEffect(() => {
  console.log('Mount only')
}, [])

// 3. With dependencies = Run when deps change
useEffect(() => {
  console.log('When count changes')
}, [count])

// 4. Multiple dependencies
useEffect(() => {
  console.log('When count OR name changes')
}, [count, name])
```

**Execution Order:**

```javascript
function Component() {
  console.log('1. Render')
  
  useEffect(() => {
    console.log('3. Effect A')
    return () => console.log('Cleanup A')
  })
  
  useEffect(() => {
    console.log('4. Effect B')
    return () => console.log('Cleanup B')
  })
  
  console.log('2. Render done')
  
  return <div>Hello</div>
}

// First render:
// 1. Render
// 2. Render done
// [Browser paints]
// 3. Effect A
// 4. Effect B

// Re-render:
// 1. Render
// 2. Render done
// [Browser paints]
// Cleanup A
// Cleanup B
// 3. Effect A
// 4. Effect B

// Unmount:
// Cleanup A
// Cleanup B
```

---

### 3. useRef

```javascript
const ref = useRef(initialValue)

// ref = { current: initialValue }
// Persists across renders
// Changing ref.current does NOT trigger re-render
```

**Use Cases:**

```javascript
// 1. DOM reference
function TextInput() {
  const inputRef = useRef(null)
  
  useEffect(() => {
    inputRef.current.focus()
  }, [])
  
  return <input ref={inputRef} />
}

// 2. Store mutable value
function Timer() {
  const intervalRef = useRef(null)
  
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log('Tick')
    }, 1000)
    
    return () => clearInterval(intervalRef.current)
  }, [])
}

// 3. Previous value
function usePrevious(value) {
  const ref = useRef()
  
  useEffect(() => {
    ref.current = value
  })
  
  return ref.current
}
```

---

### 4. useMemo & useCallback

**useMemo** = Memoize computed value

```javascript
const expensiveValue = useMemo(
  () => {
    // Expensive calculation
    return computeExpensiveValue(a, b)
  },
  [a, b] // Recalculate only when a or b changes
)

// Without useMemo:
// Recalculates every render (slow!)

// With useMemo:
// Recalculates only when dependencies change
```

**useCallback** = Memoize function

```javascript
const handleClick = useCallback(
  () => {
    console.log('Clicked', count)
  },
  [count] // New function only when count changes
)

// Equivalent to:
const handleClick = useMemo(
  () => {
    return () => console.log('Clicked', count)
  },
  [count]
)
```

**When to use:**

```javascript
// ❌ Don't overuse
const value = useMemo(() => 2 + 2, [])
// Overhead > Benefit

// ✅ Use for expensive calculations
const sortedList = useMemo(
  () => items.sort((a, b) => a.value - b.value),
  [items]
)

// ✅ Use to prevent child re-renders
const Child = memo(({ onClick }) => {
  console.log('Child render')
  return <button onClick={onClick}>Click</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  
  // ❌ New function every render → Child re-renders
  const handleClick = () => console.log('Click')
  
  // ✅ Same function → Child doesn't re-render
  const handleClick = useCallback(
    () => console.log('Click'),
    []
  )
  
  return <Child onClick={handleClick} />
}
```

---

## State Management

### State Location Decision Tree:

```
Is state used by multiple components?
│
├─ NO → Keep in component (useState)
│
└─ YES → Is it used by siblings?
    │
    ├─ NO → Lift to parent
    │
    └─ YES → Is it used across many levels?
        │
        ├─ NO → Lift to common ancestor
        │
        └─ YES → Use Context or Global State
```

### Example:

```javascript
// ❌ Bad - Prop drilling
function App() {
  const [user, setUser] = useState(null)
  return <Layout user={user} setUser={setUser} />
}

function Layout({ user, setUser }) {
  return <Header user={user} setUser={setUser} />
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />
}

function UserMenu({ user, setUser }) {
  return <div>{user.name}</div>
}

// ✅ Good - Context
const UserContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  )
}

function UserMenu() {
  const { user } = useContext(UserContext)
  return <div>{user.name}</div>
}
```

---

## Re-rendering Rules

### What Triggers Re-render:

```javascript
// 1. State change
const [count, setCount] = useState(0)
setCount(1) // ✅ Re-render

// 2. Parent re-renders
function Parent() {
  const [count, setCount] = useState(0)
  return <Child /> // Child re-renders when Parent does
}

// 3. Context value changes
const value = useContext(MyContext)
// Re-renders when context value changes

// 4. Props change (for memo components)
const Child = memo(({ name }) => <div>{name}</div>)
// Only re-renders when name changes
```

### What DOESN'T Trigger Re-render:

```javascript
// 1. ref.current change
const ref = useRef(0)
ref.current = 1 // ❌ No re-render

// 2. Direct state mutation
const [user, setUser] = useState({ name: 'John' })
user.name = 'Jane' // ❌ No re-render

// 3. Same state value
const [count, setCount] = useState(0)
setCount(0) // ❌ No re-render (same value)
```

### Optimization:

```javascript
// 1. React.memo - Prevent re-render if props same
const Child = memo(function Child({ name }) {
  console.log('Child render')
  return <div>{name}</div>
})

// 2. useMemo - Memoize value
const sortedList = useMemo(() => {
  return items.sort()
}, [items])

// 3. useCallback - Memoize function
const handleClick = useCallback(() => {
  console.log('Click')
}, [])

// 4. Code splitting
const HeavyComponent = lazy(() => import('./Heavy'))
```

---

## Summary

### React Rendering Flow:

```
User Action
  ↓
State Update (setState)
  ↓
Schedule Re-render
  ↓
Render Phase (Call component function)
  ↓
Create Virtual DOM
  ↓
Reconciliation (Diff old vs new)
  ↓
Commit Phase (Update Real DOM)
  ↓
useLayoutEffect
  ↓
Browser Paint
  ↓
useEffect
```

### Key Principles:

1. **Declarative**: บอกว่าต้องการ UI แบบไหน ไม่ใช่วิธีทำ
2. **Component-Based**: แบ่ง UI เป็น components
3. **Unidirectional Data Flow**: Data ไหลทางเดียว (top-down)
4. **Virtual DOM**: Efficient updates
5. **Reconciliation**: Minimal DOM changes

---

Made with ❤️ for React learners
