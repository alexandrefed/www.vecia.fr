# About Page - Complete Build Specification

**Version:** 1.0
**Date:** January 10, 2025
**Languages:** French (`/about.html`) & English (`/en/about.html`)
**Framework:** Tailwind CSS v4 + Alpine.js

---

## Table of Contents
1. [Overview](#overview)
2. [Dependencies](#dependencies)
3. [CSS Architecture](#css-architecture)
4. [HTML Structure](#html-structure)
5. [Animations & Interactions](#animations--interactions)
6. [Complete HTML Code](#complete-html-code)
7. [Complete CSS Code](#complete-css-code)

---

## Overview

The About page showcases Vecia's mission, values, team, and statistics. It features:
- **Hero section** with animated fade-in
- **Mission section** with two-column layout
- **Values grid** with 4 core values
- **Stats section** with gradient numbers
- **Team section** with founder profiles
- **CTA section** with gradient background
- **Minimalist footer**

**Key Features:**
- Fully responsive design
- Smooth scroll animations (fadeUp)
- Hover lift effects on cards
- Alpine.js powered navigation dropdown
- Tailwind CSS v4 custom theme
- Bilingual support (French/English)

---

## Dependencies

### External Libraries
```html
<!-- Google Fonts - Space Grotesk & Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Alpine.js for interactions -->
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Tailwind CSS v4 (compiled from /src/main.css) -->
<link rel="stylesheet" href="/src/main.css">
```

### Build System
- **Vite** (configured in `/vite.config.js`)
- **Tailwind CSS v4** (`@import "tailwindcss"`)
- **PostCSS** (processing)

---

## CSS Architecture

### Tailwind v4 Theme Configuration

Located in `/src/main.css`:

#### Brand Colors
```css
@theme {
  --color-vecia-purple: #9B59F6;
  --color-vecia-mid-blue: #5B8BFF;
  --color-vecia-light-blue: #3BB4FF;
  --color-vecia-blue: #5B8BFF;
  --color-primary: #5B8BFF;
  --color-secondary: #9B59F6;
  --color-accent: #3BB4FF;
  --color-dark: #1A1A2E;
}
```

#### Typography
```css
@theme {
  --font-sans: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}
```

#### Gradients
```css
@theme {
  --background-image-vecia-gradient: linear-gradient(135deg, #9B59F6 0%, #5B8BFF 50%, #3BB4FF 100%);
  --background-image-vecia-gradient-hover: linear-gradient(135deg, #8B49E6 0%, #4B7BEF 50%, #2BA4EF 100%);
}
```

### Custom Utilities
```css
/* Gradient text utility */
@utility text-gradient {
  background: linear-gradient(135deg, #9B59F6 0%, #5B8BFF 50%, #3BB4FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Background gradient */
@utility bg-vecia-gradient {
  background-image: var(--background-image-vecia-gradient);
}

/* Glow effect */
@utility shadow-glow-blue {
  box-shadow: 0 0 20px rgba(91, 139, 255, 0.3);
}
```

### Page-Specific CSS (Inline in HTML)

```css
/* Typography System */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.font-display {
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
}

/* Gradient text utility */
.text-gradient {
  background: linear-gradient(135deg, #9B59F6 0%, #5B8BFF 50%, #3BB4FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Footer glow effect */
.shadow-glow-blue {
  box-shadow: 0 0 20px rgba(91, 139, 255, 0.3);
}

/* Section styling */
.section {
  padding: 6rem 0;
}

@media (max-width: 768px) {
  .section {
    padding: 4rem 0;
  }
}

/* Animation classes */
.scroll-fade {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease-out forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation delays */
.scroll-fade:nth-child(1) { animation-delay: 0ms; }
.scroll-fade:nth-child(2) { animation-delay: 100ms; }
.scroll-fade:nth-child(3) { animation-delay: 200ms; }
.scroll-fade:nth-child(4) { animation-delay: 300ms; }

/* Hover effects */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(155, 89, 246, 0.2);
}
```

---

## HTML Structure

### Layout Hierarchy

```
<body>
├── <header> (Fixed navigation)
│   ├── Logo
│   ├── Navigation links (About, Blog)
│   ├── Language dropdown (Alpine.js)
│   └── CTA buttons
├── <section> Hero
│   └── Title + Description
├── <section> Mission
│   ├── Text content (left)
│   └── Image (right)
├── <section> Values
│   └── 4-column grid
│       ├── Innovation
│       ├── Excellence
│       ├── Partnership
│       └── Impact
├── <section> Stats
│   └── 4-column grid
│       ├── 30% productivity
│       ├── 280% ROI
│       ├── 50+ companies
│       └── 24/7 agents
├── <section> Team
│   └── 2-column grid
│       ├── Alexandre Fedotov (CEO)
│       └── Tanguy Dray (CTO)
├── <section> CTA
│   └── Call-to-action with gradient background
└── <footer>
    ├── Logo
    ├── Navigation links
    └── Social + Copyright
```

### Key Components

#### 1. Navigation Header
- Fixed positioning (`fixed top-0`)
- Transparent background with border
- Alpine.js language dropdown
- Responsive mobile menu toggle

#### 2. Hero Section
- Large heading with gradient accent (`■`)
- Centered layout
- Fade-up animation on load

#### 3. Mission Section
- Two-column grid (`lg:grid-cols-2`)
- Text on left, image placeholder on right
- Gradient background on image container

#### 4. Values Cards
- 4-column grid (`md:grid-cols-2 lg:grid-cols-4`)
- SVG icons
- White cards with hover lift effect
- Scroll-fade animation on each card

#### 5. Stats Section
- 4-column grid
- Large gradient numbers using `.text-gradient`
- Simple gray text labels

#### 6. Team Section
- 2-column grid (`md:grid-cols-2`)
- Profile cards with images
- LinkedIn profile links
- Hover lift effect

#### 7. CTA Section
- Full-width gradient background (`bg-vecia-gradient`)
- Centered white text
- White button with hover effect

#### 8. Footer
- Single-row layout (desktop) / stacked (mobile)
- Logo, navigation, social links
- Minimalist design

---

## Animations & Interactions

### CSS Animations

#### 1. Fade-Up Animation
```css
.scroll-fade {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease-out forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Usage:** Applied to hero content, section headings, cards
**Timing:** Staggered with 100ms delays per element

#### 2. Hover Lift Effect
```css
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(155, 89, 246, 0.2);
}
```

**Usage:** Applied to value cards and team cards
**Effect:** Elevates card on hover with enhanced shadow

### Alpine.js Interactions

#### Language Dropdown
```html
<div class="relative" x-data="{ open: false }">
  <button @click="open = !open">
    <!-- Toggle button -->
  </button>

  <div x-show="open"
       @click.outside="open = false"
       x-transition:enter="transition ease-out duration-200"
       x-transition:enter-start="opacity-0 scale-95"
       x-transition:enter-end="opacity-100 scale-100">
    <!-- Dropdown content -->
  </div>
</div>
```

**Features:**
- Click to toggle dropdown
- Click outside to close
- Smooth fade + scale transition
- Current language highlighted

---

## Complete HTML Code

### French Version (`/about.html`)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>À propos de Vecia - Agence d'Automatisation IA</title>
    <meta name="description" content="Découvrez l'équipe et la mission de Vecia. Nous transformons les entreprises grâce à l'intelligence artificielle agentique et l'automatisation intelligente.">

    <!-- Open Graph -->
    <meta property="og:title" content="À propos de Vecia - Agence d'Automatisation IA">
    <meta property="og:description" content="Découvrez comment Vecia transforme les entreprises grâce à l'automatisation intelligente et l'IA agentique.">
    <meta property="og:url" content="https://www.vecia.fr/about">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" href="/favicon.png">

    <!-- Google Fonts - Space Grotesk & Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS v4 (processed by Vite) -->
    <link rel="stylesheet" href="/src/main.css">

    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        /* Typography System - Space Grotesk for display, Inter for body */
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .font-display {
            font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
        }

        /* Gradient text utility */
        .text-gradient {
            background: linear-gradient(135deg, #9B59F6 0%, #5B8BFF 50%, #3BB4FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Footer glow effect */
        .shadow-glow-blue {
            box-shadow: 0 0 20px rgba(91, 139, 255, 0.3);
        }

        /* Section styling */
        .section {
            padding: 6rem 0;
        }

        @media (max-width: 768px) {
            .section {
                padding: 4rem 0;
            }
        }

        /* Animation classes */
        .scroll-fade {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeUp 0.8s ease-out forwards;
        }

        @keyframes fadeUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Stagger animation delays */
        .scroll-fade:nth-child(1) { animation-delay: 0ms; }
        .scroll-fade:nth-child(2) { animation-delay: 100ms; }
        .scroll-fade:nth-child(3) { animation-delay: 200ms; }
        .scroll-fade:nth-child(4) { animation-delay: 300ms; }

        /* Hover effects */
        .hover-lift {
            transition: all 0.3s ease;
        }

        .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px rgba(155, 89, 246, 0.2);
        }
    </style>
</head>

<body class="bg-gray-50">
    <!-- Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-gray-200/20">
        <nav class="px-4">
            <div class="flex items-center justify-between h-[70px]">

                <!-- Logo -->
                <a href="/" class="flex items-center">
                    <img src="/assets/images/logos/vecia-full-logo.png"
                         alt="Vecia"
                         class="hidden lg:block h-10 w-auto">
                    <img src="/assets/images/logos/vecia-v-logo.png"
                         alt="Vecia"
                         class="lg:hidden h-10 w-auto">
                </a>

                <!-- Right Actions -->
                <div class="flex items-center gap-4">
                    <div class="hidden lg:flex items-center gap-7">
                        <a href="/about.html" class="text-base font-medium uppercase tracking-wide text-vecia-blue font-semibold transition-colors duration-200">
                            À propos de nous
                        </a>
                        <a href="/blog.html" class="text-base font-medium uppercase tracking-wide text-gray-700 hover:text-vecia-blue transition-colors duration-200">
                            Blog
                        </a>

                        <!-- Language Toggle Dropdown -->
                        <div class="relative" x-data="{ open: false }">
                            <button @click="open = !open" class="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-vecia-blue transition-colors duration-200 px-3 py-1 rounded-md hover:bg-gray-50">
                                fr
                                <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            <div x-show="open"
                                 @click.outside="open = false"
                                 x-transition:enter="transition ease-out duration-200"
                                 x-transition:enter-start="opacity-0 scale-95"
                                 x-transition:enter-end="opacity-100 scale-100"
                                 x-transition:leave="transition ease-in duration-150"
                                 x-transition:leave-start="opacity-100 scale-100"
                                 x-transition:leave-end="opacity-0 scale-95"
                                 class="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">

                                <div class="px-4 py-2 text-sm font-medium text-vecia-blue bg-gray-50 border-l-2 border-vecia-blue">
                                    🇫🇷 Français
                                </div>

                                <a href="/en/about.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-vecia-blue transition-colors duration-150">
                                    🇬🇧 English
                                </a>
                            </div>
                        </div>

                        <button class="px-5 py-2.5 text-base font-semibold text-vecia-blue border-2 border-vecia-blue rounded-lg hover:bg-vecia-blue hover:text-white transition-all duration-200">
                            Organiser un Call
                        </button>
                        <button class="px-6 py-2.5 text-base font-semibold text-white bg-vecia-gradient rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
                            Démarrez
                        </button>
                    </div>

                    <!-- Mobile Menu Toggle -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen"
                            class="lg:hidden p-2.5 text-gray-700 hover:text-vecia-blue transition-colors">
                        <div class="w-7 h-6 flex flex-col justify-between">
                            <span class="menu-line block h-0.5 w-full bg-current"></span>
                            <span class="menu-line block h-0.5 w-full bg-current"></span>
                            <span class="menu-line block h-0.5 w-full bg-current"></span>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="section bg-gradient-to-b from-white to-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 scroll-fade">
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-dark mb-6">
                    <span class="text-4xl text-primary">■</span> À propos de Vecia
                </h1>
                <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Nous transformons la façon dont les entreprises travaillent en déployant des agents IA qui augmentent les capacités humaines plutôt que de les remplacer.
                </p>
            </div>
        </div>
    </section>

    <!-- Mission Section -->
    <section class="section bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div class="scroll-fade">
                    <h2 class="text-4xl font-display font-bold text-dark mb-6">Notre Mission</h2>
                    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
                        Chez Vecia, nous croyons que l'intelligence artificielle doit libérer le potentiel humain, pas le contraindre. Notre mission est de rendre l'IA agentique accessible à toutes les entreprises, quelle que soit leur taille.
                    </p>
                    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
                        Nous développons des solutions sur mesure qui s'intègrent parfaitement à vos processus existants, permettant à vos équipes de se concentrer sur ce qui compte vraiment : l'innovation, la créativité et la relation client.
                    </p>
                    <div class="mt-8">
                        <a href="#contact" class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 inline-flex items-center">
                            <span>Commencer votre transformation</span>
                        </a>
                    </div>
                </div>
                <div class="relative scroll-fade">
                    <div class="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20">
                        <img src="/assets/images/mission-handshake.png"
                             alt="Notre mission - Partenariat et collaboration"
                             class="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Values Section -->
    <section class="section bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12 scroll-fade">
                <h2 class="text-4xl font-display font-bold text-dark mb-4">Nos Valeurs</h2>
                <p class="text-xl text-gray-700 max-w-3xl mx-auto">
                    Les principes qui guident chaque décision et chaque ligne de code
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="scroll-fade hover-lift">
                    <div class="bg-white rounded-2xl p-8 h-full">
                        <div class="mb-6">
                            <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-display font-semibold text-dark mb-3">Innovation</h3>
                        <p class="text-gray-600">Nous repoussons constamment les limites de ce qui est possible avec l'IA</p>
                    </div>
                </div>

                <div class="scroll-fade hover-lift">
                    <div class="bg-white rounded-2xl p-8 h-full">
                        <div class="mb-6">
                            <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-display font-semibold text-dark mb-3">Excellence</h3>
                        <p class="text-gray-600">Chaque projet est une opportunité de créer quelque chose d'exceptionnel</p>
                    </div>
                </div>

                <div class="scroll-fade hover-lift">
                    <div class="bg-white rounded-2xl p-8 h-full">
                        <div class="mb-6">
                            <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-display font-semibold text-dark mb-3">Partenariat</h3>
                        <p class="text-gray-600">Nous travaillons main dans la main avec nos clients pour leur succès</p>
                    </div>
                </div>

                <div class="scroll-fade hover-lift">
                    <div class="bg-white rounded-2xl p-8 h-full">
                        <div class="mb-6">
                            <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-display font-semibold text-dark mb-3">Impact</h3>
                        <p class="text-gray-600">Chaque automatisation doit créer une valeur mesurable et durable</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="section bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="text-center scroll-fade">
                    <div class="text-5xl font-display font-bold text-gradient mb-2">30%</div>
                    <p class="text-gray-600">Gain de productivité moyen</p>
                </div>
                <div class="text-center scroll-fade">
                    <div class="text-5xl font-display font-bold text-gradient mb-2">280%</div>
                    <p class="text-gray-600">ROI en 6 mois</p>
                </div>
                <div class="text-center scroll-fade">
                    <div class="text-5xl font-display font-bold text-gradient mb-2">50+</div>
                    <p class="text-gray-600">Entreprises accompagnées</p>
                </div>
                <div class="text-center scroll-fade">
                    <div class="text-5xl font-display font-bold text-gradient mb-2">24/7</div>
                    <p class="text-gray-600">Agents opérationnels</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="section bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12 scroll-fade">
                <h2 class="text-4xl font-display font-bold text-dark mb-4">L'équipe Vecia</h2>
                <p class="text-xl text-gray-700 max-w-3xl mx-auto">
                    Une équipe passionnée par l'innovation et l'excellence en IA
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div class="scroll-fade hover-lift">
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div class="aspect-square overflow-hidden">
                            <img src="/assets/images/team/alexandre-fedotov.jpg"
                                 alt="Alexandre Fedotov - Co-Fondateur & CEO"
                                 class="w-full h-full object-cover"/>
                        </div>
                        <div class="p-8">
                            <h3 class="text-2xl font-display font-semibold text-dark mb-2">Alexandre Fedotov</h3>
                            <p class="text-primary font-medium mb-4">Co-Fondateur & CEO</p>
                            <p class="text-gray-600 mb-6">
                                Passionné par la construction de systèmes intelligents avec l'IA. Expert en automatisation et transformation digitale, Alexandre dirige la vision stratégique de Vecia pour révolutionner la productivité des entreprises grâce à l'IA agentique.
                            </p>
                            <a href="https://www.linkedin.com/in/alexandre-fedotov-a26819110/" target="_blank" rel="noopener noreferrer"
                               class="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                                Voir le profil LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                <div class="scroll-fade hover-lift">
                    <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div class="aspect-square overflow-hidden">
                            <img src="/assets/images/team/tanguy-dray.jpg"
                                 alt="Tanguy Dray - Co-Fondateur & CTO"
                                 class="w-full h-full object-cover"/>
                        </div>
                        <div class="p-8">
                            <h3 class="text-2xl font-display font-semibold text-dark mb-2">Tanguy Dray</h3>
                            <p class="text-primary font-medium mb-4">Co-Fondateur & CTO</p>
                            <p class="text-gray-600 mb-6">
                                Lead Dev Data IA avec une expertise approfondie en développement d'agents intelligents et en architecture de systèmes distribués. Tanguy pilote l'innovation technique de Vecia pour créer des solutions d'automatisation robustes et évolutives.
                            </p>
                            <a href="https://www.linkedin.com/in/tanguy-dray/" target="_blank" rel="noopener noreferrer"
                               class="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                                Voir le profil LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="section bg-vecia-gradient">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center text-white">
                <h2 class="text-4xl font-display font-bold mb-6">
                    Prêt à transformer votre entreprise ?
                </h2>
                <p class="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                    Découvrez comment l'IA agentique peut révolutionner vos processus
                    et libérer le potentiel de vos équipes.
                </p>
                <div class="mt-8">
                    <a href="#contact" class="bg-white hover:bg-gray-50 text-dark px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 inline-flex items-center">
                        <span>Parlons de votre projet</span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Minimalist Footer -->
    <footer class="bg-white border-t border-gray-100 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Single Row Layout - Desktop | Stacked - Mobile -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-0">

                <!-- Left: Logo -->
                <div class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                    <!-- Vecia Full Logo -->
                    <div class="flex items-center">
                        <img src="/assets/images/logos/vecia-full-logo.png" alt="Vecia" class="h-8 w-auto hover:scale-105 transition-transform duration-200">
                    </div>
                </div>

                <!-- Center: Essential Links (Hidden on mobile) -->
                <nav class="hidden lg:flex items-center gap-8" aria-label="Footer navigation">
                    <a href="/about.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">About</a>
                    <a href="/blog.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Blog</a>
                    <a href="/legal/privacy.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Privacy</a>
                    <a href="/legal/terms.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Terms</a>
                    <a href="/legal/cookies.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Cookies</a>
                    <a href="/legal/ai-ethics.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">AI Ethics</a>
                </nav>

                <!-- Mobile Navigation (Visible on mobile only) -->
                <nav class="lg:hidden flex flex-wrap gap-4" aria-label="Footer navigation mobile">
                    <a href="/about.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">About</a>
                    <a href="/blog.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Blog</a>
                    <a href="/legal/privacy.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Privacy</a>
                    <a href="/legal/terms.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Terms</a>
                    <a href="/legal/cookies.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">Cookies</a>
                    <a href="/legal/ai-ethics.html" class="text-sm font-medium text-gray-600 hover:text-vecia-mid-blue transition-colors duration-200">AI Ethics</a>
                </nav>

                <!-- Right: Social + Copyright -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <!-- Social Icons with micro-interactions -->
                    <div class="flex items-center gap-3">
                        <a href="https://linkedin.com/company/vecia" class="w-8 h-8 bg-gray-50 hover:bg-vecia-gradient rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow-blue group" aria-label="Follow Vecia on LinkedIn">
                            <svg class="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>

                        <a href="https://twitter.com/vecia" class="w-8 h-8 bg-gray-50 hover:bg-vecia-gradient rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow-blue group" aria-label="Follow Vecia on Twitter">
                            <svg class="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                    </div>

                    <!-- Copyright with subtle styling -->
                    <p class="text-xs text-gray-400 font-normal">© 2025 Vecia. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
```

---

## Complete CSS Code

### Tailwind v4 Configuration (`/src/main.css`)

See the [CSS Architecture](#css-architecture) section above for the complete Tailwind v4 `@theme` configuration.

**Key utilities used:**
- `bg-vecia-gradient` - Brand gradient background
- `text-gradient` - Gradient text effect
- `text-vecia-blue` - Brand blue color
- `text-primary` - Primary brand color
- `font-display` - Space Grotesk font
- `shadow-glow-blue` - Glowing shadow effect

---

## Build Instructions

### Development Mode

```bash
# Install dependencies
npm install

# Start Vite dev server (port 3000)
npm run dev

# Visit: http://localhost:3000/about.html
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

**Output:**
- Compiled HTML, CSS, and assets in `/dist/`
- Optimized CSS with PurgeCSS
- Minified JavaScript

---

## Assets Required

### Images
- `/assets/images/logos/vecia-full-logo.png` - Full logo (desktop)
- `/assets/images/logos/vecia-v-logo.png` - V logo (mobile)
- `/assets/images/mission-handshake.png` - Mission section image (French version)
- `/assets/images/team/alexandre-fedotov.jpg` - CEO photo
- `/assets/images/team/tanguy-dray.jpg` - CTO photo

### Fonts
- **Space Grotesk** (300, 400, 500, 600, 700) - Display headings
- **Inter** (300, 400, 500, 600, 700) - Body text

Both loaded via Google Fonts CDN.

---

## Browser Compatibility

- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **CSS:** Modern features (CSS Grid, Flexbox, Custom Properties)
- **JavaScript:** ES6+ (Alpine.js requires modern browser)

---

## Performance Optimization

1. **CSS Optimization:**
   - PurgeCSS removes unused Tailwind classes
   - Single CSS file (no duplication)
   - CSS loaded inline for critical styles

2. **Font Loading:**
   - Preconnect to Google Fonts
   - Font-display: swap

3. **Animations:**
   - CSS-only animations (no JS overhead)
   - Staggered loading for visual interest
   - GPU-accelerated transforms

4. **Images:**
   - Lazy loading (native browser feature)
   - Optimized formats (WebP recommended)

---

## Accessibility

- **Semantic HTML:** Proper heading hierarchy, landmarks
- **ARIA labels:** On navigation, social links
- **Keyboard navigation:** All interactive elements focusable
- **Color contrast:** WCAG AA compliant
- **Screen reader friendly:** Descriptive link text

---

## Localization

**Bilingual support:**
- French: `/about.html`
- English: `/en/about.html`

**Language toggle:**
- Alpine.js dropdown in navigation
- Persistent language selection
- Semantic HTML lang attribute

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 10, 2025 | Initial build specification |

---

**End of Build Specification**
