# 🎨 Tailwind CSS Deep Dive - หลักการทำงานโดยละเอียด

## 📚 Table of Contents
1. [Tailwind CSS คืออะไร](#tailwind-css-คืออะไร)
2. [Utility-First Approach](#utility-first-approach)
3. [Build Process](#build-process)
4. [Responsive Design](#responsive-design)
5. [Customization](#customization)
6. [Best Practices](#best-practices)

---

## Tailwind CSS คืออะไร

**Tailwind CSS** = Utility-First CSS Framework

```
Traditional CSS:
Write CSS classes → Apply to HTML

Tailwind CSS:
Use pre-built utility classes → Compose in HTML
```

---

### Traditional CSS vs Tailwind:

```html
<!-- ═══════════════════════════════════════════════════ -->
<!-- TRADITIONAL CSS -->
<!-- ═══════════════════════════════════════════════════ -->

<!-- HTML -->
<button class="btn btn-primary">
  Click me
</button>

<!-- CSS -->
<style>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>

<!-- ═══════════════════════════════════════════════════ -->
<!-- TAILWIND CSS -->
<!-- ═══════════════════════════════════════════════════ -->

<!-- HTML (No separate CSS file needed!) -->
<button class="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
  Click me
</button>

<!-- Breakdown:
px-4          → padding-left: 1rem; padding-right: 1rem;
py-2          → padding-top: 0.5rem; padding-bottom: 0.5rem;
rounded       → border-radius: 0.25rem;
font-semibold → font-weight: 600;
bg-blue-500   → background-color: #3b82f6;
text-white    → color: white;
hover:bg-blue-600 → background-color: #2563eb; (on hover)
cursor-pointer → cursor: pointer;
-->
```

---

## Utility-First Approach

### Core Concept:

```
Instead of:
1. Write semantic class names
2. Write CSS for those classes
3. Apply classes to HTML

Do:
1. Use pre-built utility classes
2. Compose directly in HTML
3. No custom CSS needed
```

---

### Utility Classes Categories:

```css
/* ═══════════════════════════════════════════════════ */
/* 1. LAYOUT */
/* ═══════════════════════════════════════════════════ */

/* Display */
.block          { display: block; }
.inline-block   { display: inline-block; }
.flex           { display: flex; }
.grid           { display: grid; }
.hidden         { display: none; }

/* Position */
.static         { position: static; }
.relative       { position: relative; }
.absolute       { position: absolute; }
.fixed          { position: fixed; }
.sticky         { position: sticky; }

/* Flexbox */
.flex-row       { flex-direction: row; }
.flex-col       { flex-direction: column; }
.justify-start  { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-between{ justify-content: space-between; }
.items-start    { align-items: flex-start; }
.items-center   { align-items: center; }
.items-end      { align-items: flex-end; }

/* Grid */
.grid-cols-1    { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2    { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3    { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gap-4          { gap: 1rem; }

/* ═══════════════════════════════════════════════════ */
/* 2. SPACING */
/* ═══════════════════════════════════════════════════ */

/* Padding */
.p-0    { padding: 0; }
.p-1    { padding: 0.25rem; }  /* 4px */
.p-2    { padding: 0.5rem; }   /* 8px */
.p-4    { padding: 1rem; }     /* 16px */
.p-8    { padding: 2rem; }     /* 32px */

.px-4   { padding-left: 1rem; padding-right: 1rem; }
.py-2   { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.pt-4   { padding-top: 1rem; }
.pr-4   { padding-right: 1rem; }
.pb-4   { padding-bottom: 1rem; }
.pl-4   { padding-left: 1rem; }

/* Margin */
.m-0    { margin: 0; }
.m-4    { margin: 1rem; }
.mx-auto{ margin-left: auto; margin-right: auto; }
.mt-4   { margin-top: 1rem; }
.-mt-4  { margin-top: -1rem; } /* Negative margin */

/* ═══════════════════════════════════════════════════ */
/* 3. SIZING */
/* ═══════════════════════════════════════════════════ */

/* Width */
.w-0        { width: 0; }
.w-1        { width: 0.25rem; }
.w-4        { width: 1rem; }
.w-1/2      { width: 50%; }
.w-full     { width: 100%; }
.w-screen   { width: 100vw; }
.w-auto     { width: auto; }

/* Height */
.h-4        { height: 1rem; }
.h-screen   { height: 100vh; }
.h-full     { height: 100%; }

/* Min/Max */
.min-w-0    { min-width: 0; }
.max-w-sm   { max-width: 24rem; }
.max-w-full { max-width: 100%; }

/* ═══════════════════════════════════════════════════ */
/* 4. TYPOGRAPHY */
/* ═══════════════════════════════════════════════════ */

/* Font Size */
.text-xs    { font-size: 0.75rem; }   /* 12px */
.text-sm    { font-size: 0.875rem; }  /* 14px */
.text-base  { font-size: 1rem; }      /* 16px */
.text-lg    { font-size: 1.125rem; }  /* 18px */
.text-xl    { font-size: 1.25rem; }   /* 20px */
.text-2xl   { font-size: 1.5rem; }    /* 24px */
.text-4xl   { font-size: 2.25rem; }   /* 36px */

/* Font Weight */
.font-thin      { font-weight: 100; }
.font-normal    { font-weight: 400; }
.font-semibold  { font-weight: 600; }
.font-bold      { font-weight: 700; }

/* Text Align */
.text-left      { text-align: left; }
.text-center    { text-align: center; }
.text-right     { text-align: right; }

/* Text Color */
.text-black     { color: #000; }
.text-white     { color: #fff; }
.text-gray-500  { color: #6b7280; }
.text-blue-500  { color: #3b82f6; }

/* ═══════════════════════════════════════════════════ */
/* 5. BACKGROUNDS */
/* ═══════════════════════════════════════════════════ */

.bg-transparent { background-color: transparent; }
.bg-white       { background-color: #fff; }
.bg-gray-50     { background-color: #f9fafb; }
.bg-blue-500    { background-color: #3b82f6; }
.bg-red-500     { background-color: #ef4444; }

/* ═══════════════════════════════════════════════════ */
/* 6. BORDERS */
/* ═══════════════════════════════════════════════════ */

.border         { border-width: 1px; }
.border-2       { border-width: 2px; }
.border-t       { border-top-width: 1px; }
.border-gray-300{ border-color: #d1d5db; }

/* Border Radius */
.rounded-none   { border-radius: 0; }
.rounded-sm     { border-radius: 0.125rem; }
.rounded        { border-radius: 0.25rem; }
.rounded-lg     { border-radius: 0.5rem; }
.rounded-full   { border-radius: 9999px; }

/* ═══════════════════════════════════════════════════ */
/* 7. EFFECTS */
/* ═══════════════════════════════════════════════════ */

/* Shadow */
.shadow-sm      { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow         { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
.shadow-lg      { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

/* Opacity */
.opacity-0      { opacity: 0; }
.opacity-50     { opacity: 0.5; }
.opacity-100    { opacity: 1; }

/* ═══════════════════════════════════════════════════ */
/* 8. TRANSITIONS */
/* ═══════════════════════════════════════════════════ */

.transition         { transition-property: all; }
.transition-colors  { transition-property: color, background-color; }
.duration-150       { transition-duration: 150ms; }
.duration-300       { transition-duration: 300ms; }
.ease-in-out        { transition-timing-function: ease-in-out; }
```

---

## Build Process

### How Tailwind Works:

```
┌─────────────────────────────────────────────────────────┐
│ 1. DEVELOPMENT                                          │
│    Write HTML with Tailwind classes                     │
│    <div class="bg-blue-500 p-4 rounded">...</div>       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. TAILWIND SCANS                                       │
│    Scans all files for class names                      │
│    - app/**/*.tsx                                       │
│    - components/**/*.tsx                                │
│    - pages/**/*.tsx                                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. GENERATE CSS                                         │
│    Creates CSS only for used classes                    │
│    .bg-blue-500 { background-color: #3b82f6; }          │
│    .p-4 { padding: 1rem; }                              │
│    .rounded { border-radius: 0.25rem; }                 │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. PURGE UNUSED                                         │
│    Remove unused classes (production only)              │
│    Result: Small CSS file (~10KB gzipped)               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. OUTPUT                                               │
│    Final CSS file                                       │
│    styles.css                                           │
└─────────────────────────────────────────────────────────┘
```

---

### Configuration:

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  // 1. Content paths (where to scan for classes)
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  
  // 2. Theme customization
  theme: {
    extend: {
      // Custom colors
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
      
      // Custom spacing
      spacing: {
        '128': '32rem',
      },
      
      // Custom breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  
  // 3. Plugins
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config
```

---

## Responsive Design

### Mobile-First Approach:

```html
<!-- Base styles = Mobile (default) -->
<!-- Then add breakpoints for larger screens -->

<div class="
  text-sm          <!-- Mobile: 14px -->
  sm:text-base     <!-- ≥640px: 16px -->
  md:text-lg       <!-- ≥768px: 18px -->
  lg:text-xl       <!-- ≥1024px: 20px -->
  xl:text-2xl      <!-- ≥1280px: 24px -->
">
  Responsive text
</div>
```

---

### Breakpoints:

```css
/* Default breakpoints */
/* sm  */ @media (min-width: 640px)  { ... }
/* md  */ @media (min-width: 768px)  { ... }
/* lg  */ @media (min-width: 1024px) { ... }
/* xl  */ @media (min-width: 1280px) { ... }
/* 2xl */ @media (min-width: 1536px) { ... }
```

---

### Responsive Examples:

```html
<!-- ═══════════════════════════════════════════════════ -->
<!-- 1. RESPONSIVE LAYOUT -->
<!-- ═══════════════════════════════════════════════════ -->

<div class="
  flex flex-col        <!-- Mobile: Stack vertically -->
  md:flex-row          <!-- Tablet+: Side by side -->
">
  <div>Sidebar</div>
  <div>Content</div>
</div>

<!-- ═══════════════════════════════════════════════════ -->
<!-- 2. RESPONSIVE GRID -->
<!-- ═══════════════════════════════════════════════════ -->

<div class="
  grid
  grid-cols-1          <!-- Mobile: 1 column -->
  sm:grid-cols-2       <!-- Tablet: 2 columns -->
  lg:grid-cols-3       <!-- Desktop: 3 columns -->
  gap-4
">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- ═══════════════════════════════════════════════════ -->
<!-- 3. RESPONSIVE SPACING -->
<!-- ═══════════════════════════════════════════════════ -->

<div class="
  p-4                  <!-- Mobile: 16px padding -->
  md:p-8               <!-- Tablet+: 32px padding -->
">
  Content
</div>

<!-- ═══════════════════════════════════════════════════ -->
<!-- 4. RESPONSIVE VISIBILITY -->
<!-- ═══════════════════════════════════════════════════ -->

<div class="
  hidden               <!-- Mobile: Hidden -->
  md:block             <!-- Tablet+: Visible -->
">
  Desktop only content
</div>

<div class="
  block                <!-- Mobile: Visible -->
  md:hidden            <!-- Tablet+: Hidden -->
">
  Mobile only content
</div>
```

---

## State Variants

### Hover, Focus, Active:

```html
<!-- ═══════════════════════════════════════════════════ -->
<!-- HOVER -->
<!-- ═══════════════════════════════════════════════════ -->

<button class="
  bg-blue-500
  hover:bg-blue-600    <!-- On hover -->
  text-white
  hover:text-gray-100  <!-- On hover -->
">
  Hover me
</button>

<!-- ═══════════════════════════════════════════════════ -->
<!-- FOCUS -->
<!-- ═══════════════════════════════════════════════════ -->

<input class="
  border
  border-gray-300
  focus:border-blue-500    <!-- On focus -->
  focus:ring-2             <!-- On focus -->
  focus:ring-blue-200      <!-- On focus -->
" />

<!-- ═══════════════════════════════════════════════════ -->
<!-- ACTIVE -->
<!-- ═══════════════════════════════════════════════════ -->

<button class="
  bg-blue-500
  active:bg-blue-700       <!-- While clicking -->
">
  Click me
</button>

<!-- ═══════════════════════════════════════════════════ -->
<!-- DISABLED -->
<!-- ═══════════════════════════════════════════════════ -->

<button class="
  bg-blue-500
  disabled:bg-gray-300     <!-- When disabled -->
  disabled:cursor-not-allowed
" disabled>
  Disabled
</button>

<!-- ═══════════════════════════════════════════════════ -->
<!-- GROUP HOVER -->
<!-- ═══════════════════════════════════════════════════ -->

<div class="group">
  <img src="..." />
  <p class="
    opacity-0
    group-hover:opacity-100  <!-- Show on parent hover -->
  ">
    Caption
  </p>
</div>
```

---

## Dark Mode:

```html
<!-- Enable dark mode in config -->
<!-- tailwind.config.ts -->
module.exports = {
  darkMode: 'class', // or 'media'
}

<!-- Usage -->
<div class="
  bg-white           <!-- Light mode -->
  dark:bg-gray-900   <!-- Dark mode -->
  text-black
  dark:text-white
">
  Content
</div>

<!-- Toggle dark mode -->
<html class="dark">
  <!-- All dark: variants will apply -->
</html>
```

---

## Customization

### Custom Utilities:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utilities */
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Usage */
<h1 class="text-shadow">Shadowed text</h1>
```

---

### Component Classes:

```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-semibold;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }
  
  .btn-secondary {
    @apply bg-gray-500 text-white hover:bg-gray-600;
  }
}

/* Usage */
<button class="btn btn-primary">Click me</button>
```

---

## Best Practices

### 1. Use @apply Sparingly:

```html
<!-- ❌ Bad: Too many classes -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
  Click me
</button>

<!-- ✅ Good: Extract to component -->
<!-- Button.tsx -->
<button className={cn(
  "px-4 py-2 rounded font-semibold",
  "bg-blue-500 text-white",
  "hover:bg-blue-600",
  "focus:outline-none focus:ring-2",
  "disabled:opacity-50",
  className
)}>
  {children}
</button>
```

---

### 2. Use cn() Helper:

```typescript
// lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  "more-classes"
)}>
  Content
</div>
```

---

### 3. Organize Classes:

```html
<!-- ✅ Good: Organized by category -->
<div class="
  <!-- Layout -->
  flex items-center justify-between
  
  <!-- Spacing -->
  p-4 gap-2
  
  <!-- Sizing -->
  w-full h-auto
  
  <!-- Typography -->
  text-lg font-semibold
  
  <!-- Colors -->
  bg-white text-gray-900
  
  <!-- Borders -->
  border border-gray-200 rounded-lg
  
  <!-- Effects -->
  shadow-md
  
  <!-- States -->
  hover:bg-gray-50
  
  <!-- Responsive -->
  md:p-6 lg:p-8
">
  Content
</div>
```

---

### 4. Use Arbitrary Values:

```html
<!-- When you need exact values -->
<div class="
  w-[137px]              <!-- Exact width -->
  h-[calc(100vh-64px)]   <!-- Calculated height -->
  bg-[#1da1f2]           <!-- Exact color -->
  top-[117px]            <!-- Exact position -->
">
  Content
</div>
```

---

## Summary

### Key Concepts:

1. **Utility-First**: Compose styles from utility classes
2. **Mobile-First**: Base styles for mobile, then scale up
3. **JIT Compiler**: Generate CSS on-demand
4. **Purge Unused**: Small production bundle
5. **Customizable**: Extend with custom values
6. **Responsive**: Built-in breakpoints
7. **State Variants**: hover, focus, active, etc.

### Benefits:

```
✅ Fast development
✅ Consistent design
✅ Small bundle size
✅ No naming conflicts
✅ Easy maintenance
✅ Great DX (Developer Experience)
```

### When to Use:

```
✅ Rapid prototyping
✅ Component libraries
✅ Design systems
✅ Consistent styling
✅ Responsive layouts
```

---

Made with ❤️ for Tailwind learners
