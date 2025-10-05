# Tailwind CSS v4 Reference
## Design System Configuration for Vecia Website V5

**Source**: Context7 - Tailwind CSS Documentation
**Created**: 2025-10-05
**Purpose**: Quick reference for Tailwind CSS v4 theme customization

---

## 📋 Table of Contents
1. [Theme Configuration](#theme-configuration)
2. [Custom Colors](#custom-colors)
3. [Custom Fonts](#custom-fonts)
4. [Responsive Design](#responsive-design)
5. [Common Patterns](#common-patterns)

---

## Theme Configuration

### ⚠️ Tailwind v4 Setup (2025 - Astro 5.2+)

**IMPORTANT**: Tailwind v4 uses `@tailwindcss/vite` plugin, NOT `@astrojs/tailwind` (deprecated).

**Installation**:
```bash
npm install tailwindcss @tailwindcss/vite
```

**Astro Config** (`astro.config.mjs`):
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});
```

**Global CSS** (`src/styles/global.css`):
```css
@import "tailwindcss";
```

**Import in Layout**:
```astro
---
import '../styles/global.css';
---
```

### Vecia Design Tokens (via @theme directive)

**In `src/styles/global.css`**:
```css
@import "tailwindcss";

@theme {
  --color-primary: #5B8BFF;
  --color-secondary: #9B59F6;
  --color-accent1: #3BB4FF;
  --color-accent2: #7B6FDE;
  --color-accent3: #E8F4FF;
  --color-text: #1A1A2E;
  --color-background: #FFFFFF;

  --font-heading: "Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

### Vecia Design Tokens (from graphic_chart.md)
```js
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B8BFF',      // Mid blue
        secondary: '#9B59F6',    // Purple
        accent1: '#3BB4FF',      // Light blue
        accent2: '#7B6FDE',      // Purple-blue blend
        accent3: '#E8F4FF',      // Very light blue tint
        text: '#1A1A2E',         // Deep navy
        background: '#FFFFFF',   // White
      },
      fontFamily: {
        heading: ['Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

---

## Custom Colors

### Method 1: Using @theme Directive (CSS)
```css
/* src/styles/global.css */
@theme {
  --color-primary: #5B8BFF;
  --color-secondary: #9B59F6;
  --color-accent1: #3BB4FF;
  --color-accent2: #7B6FDE;
  --color-accent3: #E8F4FF;
  --color-text: #1A1A2E;
  --color-background: #FFFFFF;
}
```

Usage:
```html
<div class="bg-primary text-white">
  Primary background
</div>

<p class="text-secondary">
  Secondary text color
</p>
```

### Method 2: Extend in Config (Recommended for Vecia)
```js
// tailwind.config.mjs
theme: {
  extend: {
    colors: {
      primary: '#5B8BFF',
      secondary: '#9B59F6',
      // ... other colors
    },
  },
}
```

### Arbitrary Values
```html
<!-- For one-off custom colors -->
<div class="bg-[#5B8BFF]">Custom blue background</div>
<p class="text-[#9B59F6]">Custom purple text</p>
```

---

## Custom Fonts

### Define Font Families

**Method 1: @theme Directive**
```css
@theme {
  --font-heading: "Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

**Method 2: Config Extension**
```js
fontFamily: {
  heading: ['Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

### Usage
```html
<h1 class="font-heading">Headline in Grotesk</h1>
<p class="font-body">Body text in Inter</p>
```

### Custom Font Weights
```css
@theme {
  --font-weight-extrablack: 1000;
}
```

```html
<div class="font-extrablack">Extra black weight</div>
```

### Font Feature Settings
```css
@theme {
  --font-display: "Oswald", sans-serif;
  --font-display--font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  --font-display--font-variation-settings: "opsz" 32;
}
```

### Custom Font Size with Line Height
```css
@theme {
  --text-tiny: 0.625rem;
  --text-tiny--line-height: 1.5rem;
  --text-tiny--letter-spacing: 0.125rem;
  --text-tiny--font-weight: 500;
}
```

---

## Responsive Design

### Breakpoints (Tailwind Defaults)
```
sm: 640px   // Small devices (phones landscape)
md: 768px   // Medium devices (tablets)
lg: 1024px  // Large devices (desktops)
xl: 1280px  // Extra large devices
2xl: 1536px // 2X large devices
```

### Custom Breakpoints
```js
theme: {
  screens: {
    'mobile': '320px',
    'tablet': '768px',
    'desktop': '1024px',
    'wide': '1920px',
  },
}
```

### Responsive Utilities
```html
<!-- Mobile-first approach -->
<div class="text-base md:text-lg lg:text-xl">
  Responsive text sizing
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

<!-- Hide on mobile, show on desktop -->
<nav class="hidden md:block">Desktop navigation</nav>

<!-- Show on mobile, hide on desktop -->
<button class="block md:hidden">Mobile menu</button>
```

---

## Common Patterns

### Gradient Text (Vecia Style)
```html
<h1 class="text-5xl">
  Automatisez Vos Processus,
  <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
    Économisez Plus de 20h par Semaine,
  </span>
  et Développez Votre Entreprise
</h1>
```

### Gradient Backgrounds
```html
<section class="bg-gradient-to-br from-primary via-secondary to-accent1">
  Gradient section
</section>
```

### Button Styles (Vecia)
```html
<!-- Primary button -->
<button class="
  px-6 py-3
  bg-gradient-to-r from-primary to-secondary
  text-white font-semibold rounded-full
  hover:scale-105 hover:shadow-xl
  transition-all duration-300
">
  AUDIT IA GRATUIT
</button>

<!-- Secondary button (outline) -->
<button class="
  px-6 py-3
  border-2 border-primary
  text-primary font-semibold rounded-full
  hover:bg-primary hover:text-white
  transition-all duration-300
">
  VOIR NOS CAS D'USAGE
</button>
```

### Cards with Hover Effects
```html
<div class="
  p-6 rounded-lg
  bg-white border border-gray-200
  hover:border-primary hover:shadow-lg
  transition-all duration-300
  transform hover:-translate-y-1
">
  Card content
</div>
```

### Centered Container
```html
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Responsive padding -->
</div>
```

### Flexbox Patterns
```html
<!-- Center content -->
<div class="flex items-center justify-center min-h-screen">
  Centered content
</div>

<!-- Space between items -->
<nav class="flex items-center justify-between">
  <div>Logo</div>
  <div>Navigation</div>
</nav>

<!-- Vertical stack with gap -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid Layouts
```html
<!-- Auto-fit responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Asymmetric Bento Grid (Vecia style) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="md:col-span-1">Narrow column</div>
  <div class="md:col-span-2">Wide column</div>
</div>
```

---

## Animations & Transitions

### Hover Effects
```html
<!-- Scale on hover -->
<button class="transform hover:scale-105 transition-transform duration-300">
  Hover me
</button>

<!-- Lift effect -->
<div class="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
  Lift on hover
</div>

<!-- Color transition -->
<a class="text-gray-600 hover:text-primary transition-colors duration-200">
  Link
</a>
```

### Custom Animations
```css
/* global.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in;
}

.animate-slideUp {
  animation: slideUp 0.6s ease-out;
}
```

Usage:
```html
<div class="animate-fadeIn">Fades in</div>
<div class="animate-slideUp">Slides up</div>
```

---

## Dark Mode (Optional)

### Enable Dark Mode
```js
// tailwind.config.mjs
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ...
}
```

### Usage
```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Light and dark mode support
</div>
```

---

## Performance Tips

### 1. Purge Unused CSS (Automatic in v4)
Tailwind v4 automatically removes unused styles based on `content` configuration.

### 2. Use @apply Sparingly
```css
/* ✅ GOOD: Utility classes in HTML */
<button class="px-6 py-3 bg-primary text-white rounded-full">

/* ❌ AVOID: Too many @apply directives */
.btn {
  @apply px-6 py-3 bg-primary text-white rounded-full hover:scale-105;
}
```

### 3. Extract Common Components
```astro
---
// src/components/Button.astro
interface Props {
  variant?: 'primary' | 'secondary';
}
const { variant = 'primary' } = Astro.props;

const baseClasses = "px-6 py-3 font-semibold rounded-full transition-all duration-300";
const variantClasses = {
  primary: "bg-gradient-to-r from-primary to-secondary text-white hover:scale-105",
  secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
};
---
<button class={`${baseClasses} ${variantClasses[variant]}`}>
  <slot />
</button>
```

---

## Vecia-Specific Utilities

### Custom Spacing Scale (if needed)
```js
theme: {
  extend: {
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
  },
}
```

### Custom Shadows
```js
theme: {
  extend: {
    boxShadow: {
      'vecia': '0 10px 40px rgba(91, 139, 255, 0.15)',
      'vecia-lg': '0 20px 60px rgba(91, 139, 255, 0.2)',
    },
  },
}
```

Usage:
```html
<div class="shadow-vecia hover:shadow-vecia-lg transition-shadow">
  Card with custom shadow
</div>
```

---

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Vecia Design Tokens**: `docs/graphic_chart.md`
- **Our Config**: `tailwind.config.mjs`

---

**Last Updated**: 2025-10-05
**Status**: Reference for Vecia V5 implementation
