# Vecia Website - Graphic Chart & Design System

**Version:** 1.0
**Date:** October 6, 2025
**Last Updated:** October 6, 2025

---

## 🎨 Typography

### Font Families

#### **Space Grotesk** (Display Font)
- **Usage**: All titles (H1, H2, H3), navigation links
- **CSS Variable**: `--font-display`, `--font-heading`
- **Tailwind Class**: `font-display`
- **Weights**: Bold (700)
- **Characteristics**: Modern, geometric, excellent for headings

#### **Inter** (Body Font)
- **Usage**: Paragraph text, descriptions, body content
- **CSS Variable**: `--font-body`
- **Tailwind Class**: `font-body`
- **Weights**: Regular (400), Medium (500), Semibold (600)
- **Characteristics**: Highly readable, optimized for screens

---

## 📐 Typography Scale

### Section Titles (H2)
```css
/* Tailwind Classes */
font-display text-4xl font-bold

/* Properties */
font-family: "Space Grotesk", sans-serif
font-size: 2.25rem (36px)
line-height: 2.5rem (40px)
font-weight: 700 (Bold)
```

**Example:**
```html
<h2 class="font-display text-4xl font-bold text-gray-800">
  Insights & Actualités
</h2>
```

---

### Hero Headline (H1)
```css
/* Tailwind Classes */
font-display font-bold text-5xl md:text-6xl lg:text-7xl

/* Properties */
font-family: "Space Grotesk", sans-serif
font-size:
  - Mobile: 3rem (48px)
  - Tablet: 3.75rem (60px)
  - Desktop: 4.5rem (72px)
font-weight: 700 (Bold)
line-height: 1.3
```

---

### Navigation Links
```css
/* Tailwind Classes */
font-display font-bold uppercase tracking-wide text-base

/* Properties */
font-family: "Space Grotesk", sans-serif
font-size: 1rem (16px)
font-weight: 700 (Bold)
text-transform: uppercase
letter-spacing: 0.05em (tracking-wide)
```

**Example:**
```html
<a class="font-display font-bold uppercase tracking-wide text-gray-700 hover:text-primary">
  About
</a>
```

---

### Subsection Titles (H3)
```css
/* Tailwind Classes */
font-display text-xl font-bold

/* Properties */
font-family: "Space Grotesk", sans-serif
font-size: 1.25rem (20px)
font-weight: 700 (Bold)
```

---

### Body Text
```css
/* Tailwind Classes */
text-base md:text-lg lg:text-xl

/* Properties */
font-family: "Inter", sans-serif
font-size:
  - Mobile: 1rem (16px)
  - Tablet: 1.125rem (18px)
  - Desktop: 1.25rem (20px)
line-height: 1.75 (leading-relaxed)
```

---

## 🎨 Color Palette

### Primary Colors
```css
--color-primary: #5B8BFF     /* Mid blue */
--color-secondary: #9B59F6   /* Purple */
--color-accent1: #3BB4FF     /* Light blue */
--color-accent2: #7B6FDE     /* Purple-blue blend */
--color-accent3: #E8F4FF     /* Very light blue tint */
```

### Neutral Colors
```css
--color-text: #1A1A2E        /* Deep navy - main text */
--color-background: #FFFFFF  /* White - main background */

/* Tailwind Grays (for secondary text, borders) */
gray-50: #F9FAFB
gray-100: #F3F4F6
gray-200: #E5E7EB
gray-300: #D1D5DB
gray-600: #4B5563
gray-700: #374151
gray-800: #1F2937
```

---

## 🔘 Buttons & CTAs

### Primary CTA (Gradient)
```css
/* Tailwind Classes */
px-8 py-4 text-white font-semibold rounded-lg
bg-gradient-to-r from-primary to-secondary
hover:shadow-xl hover:-translate-y-1 hover:scale-105
transition-all

/* Properties */
padding: 1rem 2rem
background: linear-gradient(to right, #5B8BFF, #9B59F6)
border-radius: 0.5rem (8px)
font-weight: 600
color: white
```

### Secondary CTA (Outlined)
```css
/* Tailwind Classes */
px-5 py-2.5 border-2 border-primary/30 rounded-lg
text-primary bg-white/10
hover:bg-primary hover:text-white
transition-all

/* Properties */
padding: 0.625rem 1.25rem
border: 2px solid rgba(91, 139, 255, 0.3)
border-radius: 0.5rem (8px)
color: #5B8BFF
```

---

## 📦 Component Patterns

### Card Design
```css
/* Tailwind Classes */
bg-white rounded-xl p-6 shadow-sm border border-gray-100
hover:shadow-md transition-shadow

/* Properties */
background: white
border-radius: 0.75rem (12px)
padding: 1.5rem (24px)
border: 1px solid #F3F4F6
box-shadow: 0 1px 2px rgba(0,0,0,0.05)
```

### Section Spacing
```css
/* Vertical Spacing */
py-20  /* Section padding: 5rem (80px) top & bottom */
mb-12  /* Title margin-bottom: 3rem (48px) */
gap-8  /* Grid/Flex gap: 2rem (32px) */
```

---

## 🎭 Animation & Transitions

### Standard Transition
```css
transition-all duration-300
/* or */
transition-colors duration-300
```

### Hover Effects (Buttons)
```css
hover:shadow-xl         /* Larger shadow */
hover:-translate-y-1    /* Lift 4px */
hover:scale-105         /* Scale to 105% */
active:scale-95         /* Scale to 95% on click */
```

### Smooth Scroll
```css
html {
  scroll-behavior: smooth;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind Default Breakpoints */
sm:   640px   /* Small devices */
md:   768px   /* Tablets */
lg:   1024px  /* Desktops */
xl:   1280px  /* Large desktops */
2xl:  1536px  /* Extra large screens */
```

### Usage Pattern
```html
<!-- Mobile-first approach -->
<h2 class="text-3xl md:text-4xl lg:text-5xl">
  <!-- 3xl mobile, 4xl tablet, 5xl desktop -->
</h2>
```

---

## ✅ Component Checklist

When creating new components, ensure:

- [ ] **Titles** use `font-display text-4xl font-bold`
- [ ] **Navigation links** use `font-display font-bold uppercase tracking-wide`
- [ ] **Body text** uses `font-body` (Inter)
- [ ] **Colors** use design tokens (primary, secondary, accent1-3)
- [ ] **Spacing** follows consistent scale (gap-4, gap-8, py-20)
- [ ] **Buttons** include hover states with transitions
- [ ] **Cards** use `rounded-xl shadow-sm border`
- [ ] **Responsive** breakpoints are mobile-first

---

## 🔗 Related Files

- **CSS Variables**: `src/styles/global.css` (Tailwind v4 @theme)
- **PRD Typography Section**: `docs/PRD.md` (Typography specifications)
- **Tailwind Config**: `docs/TAILWIND-REFERENCE.md` (v4 configuration)
- **Implementation Plan**: `docs/IMPLEMENTATION-PLAN.md` (Component roadmap)

---

## 📋 Quick Reference

### Section Title (with blue square icon)
```html
<h2 class="font-display text-4xl font-bold text-gray-800 mb-4">
  <span class="title-icon"></span>Title Text
</h2>
```

**Note:** The `.title-icon` class creates a rounded blue square (■) before the title using the primary brand color.

### Navigation Link
```html
<a class="font-display font-bold uppercase tracking-wide text-gray-700 hover:text-primary transition-colors">
  Link Text
</a>
```

### Primary Button
```html
<a class="px-8 py-4 text-white font-semibold rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all">
  Button Text
</a>
```

### Card
```html
<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
  Card Content
</div>
```

---

**Last Updated:** October 6, 2025
**Maintained By:** Vecia Development Team
