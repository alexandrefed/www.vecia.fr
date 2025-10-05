# Alpine.js Reference
## Interactive Components for Vecia Website V5

**Source**: Context7 - Alpine.js Documentation
**Created**: 2025-10-05
**Purpose**: Quick reference for Alpine.js directives and patterns

---

## 📋 Table of Contents
1. [Core Directives](#core-directives)
2. [State Management](#state-management)
3. [Event Handling](#event-handling)
4. [Templating](#templating)
5. [Common Patterns](#common-patterns)

---

## Core Directives

### x-data - Declare Component State
```html
<!-- Basic state -->
<div x-data="{ open: false }">
  ...
</div>

<!-- With methods -->
<div x-data="{
  count: 0,
  increment() { this.count++ }
}">
  <button @click="increment()">Count: <span x-text="count"></span></button>
</div>

<!-- With getters (computed properties) -->
<div x-data="{
  open: false,
  get isOpen() { return this.open },
  toggle() { this.open = !this.open }
}">
  <button @click="toggle()">Toggle</button>
  <div x-show="isOpen">Content</div>
</div>
```

### x-show - Toggle Visibility
```html
<!-- Basic usage -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open">
    Content appears/disappears (display: none)
  </div>
</div>

<!-- With transitions -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-transition>
    Animated content
  </div>
</div>
```

### x-if - Conditional Rendering
```html
<!-- Must use <template> tag -->
<div x-data="{ show: false }">
  <button @click="show = !show">Toggle</button>

  <template x-if="show">
    <div>
      Element is added/removed from DOM
    </div>
  </template>
</div>
```

**Note**: `x-show` hides elements (display: none), `x-if` removes them from DOM.

### x-for - Loop Over Data
```html
<!-- Basic loop -->
<ul x-data="{ items: ['Apple', 'Banana', 'Orange'] }">
  <template x-for="item in items">
    <li x-text="item"></li>
  </template>
</ul>

<!-- With index -->
<ul x-data="{ items: ['Red', 'Green', 'Blue'] }">
  <template x-for="(item, index) in items">
    <li>
      <span x-text="index + 1"></span>: <span x-text="item"></span>
    </li>
  </template>
</ul>

<!-- Loop over objects -->
<div x-data="{ user: { name: 'John', age: 30 } }">
  <template x-for="(value, key) in user">
    <p><strong x-text="key"></strong>: <span x-text="value"></span></p>
  </template>
</div>
```

---

## State Management

### Local State (x-data)
```html
<div x-data="{ count: 0 }">
  <button @click="count++">Increment</button>
  <span x-text="count"></span>
</div>
```

### Nested Components (Scope Inheritance)
```html
<div x-data="{ foo: 'bar' }">
  <span x-text="foo"></span>  <!-- "bar" -->

  <div x-data="{ bar: 'baz' }">
    <span x-text="foo"></span>  <!-- "bar" (inherited) -->
    <span x-text="bar"></span>  <!-- "baz" -->

    <div x-data="{ foo: 'overridden' }">
      <span x-text="foo"></span>  <!-- "overridden" -->
    </div>
  </div>
</div>
```

### Using x-data Without State
```html
<!-- Useful for event handlers without reactive state -->
<button x-data @click="alert('Clicked!')">
  Click Me
</button>
```

---

## Event Handling

### x-on (Shorthand: @)
```html
<!-- Full syntax -->
<button x-on:click="count++">Increment</button>

<!-- Shorthand (recommended) -->
<button @click="count++">Increment</button>

<!-- Call methods -->
<button @click="increment()">Increment</button>

<!-- Multiple events -->
<div
  @mouseenter="hovered = true"
  @mouseleave="hovered = false"
>
  Hover me
</div>
```

### Event Modifiers
```html
<!-- Prevent default -->
<form @submit.prevent="handleSubmit()">
  ...
</form>

<!-- Stop propagation -->
<div @click.stop="handleClick()">
  Click won't bubble up
</div>

<!-- Only once -->
<button @click.once="initialize()">
  Runs once
</button>

<!-- Debounce (wait 500ms) -->
<input @input.debounce.500ms="search($event.target.value)">

<!-- Throttle (max once per 1000ms) -->
<div @scroll.throttle.1000ms="handleScroll()">
  ...
</div>
```

### Keyboard Events
```html
<!-- Specific keys -->
<input @keyup.enter="submit()">
<input @keyup.escape="close()">
<input @keyup.ctrl.s="save()">
```

### Click Outside
```html
<div x-data="{ open: false }">
  <button @click="open = true">Open</button>

  <div x-show="open" @click.outside="open = false">
    Click outside to close
  </div>
</div>
```

---

## Templating

### x-text - Set Text Content
```html
<div x-data="{ message: 'Hello World' }">
  <p x-text="message"></p>
  <!-- Output: <p>Hello World</p> -->
</div>
```

### x-html - Set HTML Content
```html
<div x-data="{ html: '<strong>Bold</strong>' }">
  <p x-html="html"></p>
  <!-- Output: <p><strong>Bold</strong></p> -->
</div>
```

### x-model - Two-Way Binding
```html
<!-- Text input -->
<div x-data="{ message: '' }">
  <input x-model="message" placeholder="Type...">
  <p x-text="message"></p>
</div>

<!-- Checkbox (boolean) -->
<div x-data="{ checked: false }">
  <input type="checkbox" x-model="checked">
  <span x-text="checked ? 'Checked' : 'Unchecked'"></span>
</div>

<!-- Radio buttons -->
<div x-data="{ color: 'red' }">
  <input type="radio" value="red" x-model="color"> Red
  <input type="radio" value="blue" x-model="color"> Blue
  <p>Selected: <span x-text="color"></span></p>
</div>

<!-- Textarea -->
<div x-data="{ message: '' }">
  <textarea x-model="message"></textarea>
  <p x-text="message"></p>
</div>
```

### x-bind (Shorthand: :)
```html
<!-- Bind attributes -->
<img x-bind:src="imageSrc" x-bind:alt="imageAlt">

<!-- Shorthand -->
<img :src="imageSrc" :alt="imageAlt">

<!-- Dynamic classes -->
<div :class="open ? 'bg-blue-500' : 'bg-gray-500'">
  ...
</div>

<!-- Multiple classes -->
<div :class="{ 'bg-blue-500': isActive, 'text-white': isActive }">
  ...
</div>

<!-- Bind styles -->
<div :style="{ color: textColor, fontSize: size + 'px' }">
  Styled text
</div>
```

---

## Common Patterns

### Dropdown Menu
```html
<div x-data="{ open: false }">
  <button @click="open = !open">
    Menu
  </button>

  <div
    x-show="open"
    @click.outside="open = false"
    x-transition
  >
    <a href="#">Item 1</a>
    <a href="#">Item 2</a>
    <a href="#">Item 3</a>
  </div>
</div>
```

### Modal
```html
<div x-data="{ modalOpen: false }">
  <button @click="modalOpen = true">Open Modal</button>

  <div
    x-show="modalOpen"
    @keydown.escape.window="modalOpen = false"
    class="fixed inset-0 bg-black bg-opacity-50"
  >
    <div
      @click.outside="modalOpen = false"
      class="bg-white p-6 rounded-lg"
    >
      <h2>Modal Title</h2>
      <p>Modal content</p>
      <button @click="modalOpen = false">Close</button>
    </div>
  </div>
</div>
```

### Tabs (Vecia AI Tabs Pattern)
```html
<div x-data="{
  activeTab: 0,
  tabs: [
    { title: 'Tab 1', content: 'Content 1' },
    { title: 'Tab 2', content: 'Content 2' },
    { title: 'Tab 3', content: 'Content 3' }
  ]
}">
  <!-- Tab buttons -->
  <div class="flex gap-2">
    <template x-for="(tab, index) in tabs" :key="index">
      <button
        @click="activeTab = index"
        :class="activeTab === index ? 'bg-primary text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
        x-text="tab.title"
      ></button>
    </template>
  </div>

  <!-- Tab content -->
  <div class="mt-4">
    <template x-for="(tab, index) in tabs" :key="index">
      <div x-show="activeTab === index" x-text="tab.content"></div>
    </template>
  </div>
</div>
```

### Auto-Rotating Tabs (Vecia Pattern)
```html
<div x-data="{
  activeTab: 0,
  totalTabs: 4,
  interval: null,
  startAutoRotate() {
    this.interval = setInterval(() => {
      this.activeTab = (this.activeTab + 1) % this.totalTabs;
    }, 8000);  // Rotate every 8 seconds
  },
  stopAutoRotate() {
    clearInterval(this.interval);
  }
}"
x-init="startAutoRotate()"
@mouseenter="stopAutoRotate()"
@mouseleave="startAutoRotate()"
>
  <!-- Tab content -->
  <div x-show="activeTab === 0">Tab 1</div>
  <div x-show="activeTab === 1">Tab 2</div>
  <div x-show="activeTab === 2">Tab 3</div>
  <div x-show="activeTab === 3">Tab 4</div>
</div>
```

### Carousel/Slider
```html
<div x-data="{
  currentSlide: 0,
  totalSlides: 5,
  next() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  },
  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }
}">
  <button @click="prev()">←</button>

  <div class="overflow-hidden">
    <div
      class="flex transition-transform duration-300"
      :style="`transform: translateX(-${currentSlide * 100}%)`"
    >
      <div class="w-full flex-shrink-0">Slide 1</div>
      <div class="w-full flex-shrink-0">Slide 2</div>
      <div class="w-full flex-shrink-0">Slide 3</div>
      <div class="w-full flex-shrink-0">Slide 4</div>
      <div class="w-full flex-shrink-0">Slide 5</div>
    </div>
  </div>

  <button @click="next()">→</button>

  <!-- Dot indicators -->
  <div class="flex gap-2 justify-center mt-4">
    <template x-for="i in totalSlides" :key="i">
      <button
        @click="currentSlide = i - 1"
        :class="currentSlide === i - 1 ? 'bg-primary' : 'bg-gray-300'"
        class="w-3 h-3 rounded-full"
      ></button>
    </template>
  </div>
</div>
```

### Mobile Menu Toggle
```html
<div x-data="{ mobileMenuOpen: false }">
  <!-- Hamburger button -->
  <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
    <svg class="w-6 h-6">...</svg>
  </button>

  <!-- Mobile menu -->
  <nav
    x-show="mobileMenuOpen"
    @click.outside="mobileMenuOpen = false"
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0 transform scale-90"
    x-transition:enter-end="opacity-100 transform scale-100"
    class="md:hidden"
  >
    <a href="/" @click="mobileMenuOpen = false">Home</a>
    <a href="/about" @click="mobileMenuOpen = false">About</a>
    <a href="/blog" @click="mobileMenuOpen = false">Blog</a>
  </nav>
</div>
```

### Language Switcher (Vecia Pattern)
```html
<div x-data="{ languageDropdownOpen: false }">
  <button
    @click="languageDropdownOpen = !languageDropdownOpen"
    class="flex items-center gap-2"
  >
    <span>🇫🇷 Français</span>
    <svg :class="{ 'rotate-180': languageDropdownOpen }" class="w-4 h-4 transition-transform">
      <!-- Chevron icon -->
    </svg>
  </button>

  <div
    x-show="languageDropdownOpen"
    @click.outside="languageDropdownOpen = false"
    x-transition
    class="absolute mt-2 bg-white shadow-lg rounded-lg"
  >
    <a href="/" class="block px-4 py-2 hover:bg-gray-100">
      🇫🇷 Français
    </a>
    <a href="/en/" class="block px-4 py-2 hover:bg-gray-100">
      🇬🇧 English
    </a>
  </div>
</div>
```

---

## Transitions

### Basic Transition
```html
<div x-show="open" x-transition>
  Fades in/out
</div>
```

### Custom Transition Durations
```html
<div
  x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0 transform scale-90"
  x-transition:enter-end="opacity-100 transform scale-100"
  x-transition:leave="transition ease-in duration-200"
  x-transition:leave-start="opacity-100 transform scale-100"
  x-transition:leave-end="opacity-0 transform scale-90"
>
  Custom transitions
</div>
```

### Slide Transitions
```html
<!-- Slide down -->
<div
  x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0 transform -translate-y-4"
  x-transition:enter-end="opacity-100 transform translate-y-0"
>
  Slides down
</div>

<!-- Slide up from bottom -->
<div
  x-show="open"
  x-transition:enter="transition ease-out duration-300"
  x-transition:enter-start="opacity-0 transform translate-y-4"
  x-transition:enter-end="opacity-100 transform translate-y-0"
>
  Slides up
</div>
```

---

## Lifecycle & Initialization

### x-init - Run Code on Initialize
```html
<div x-data="{ count: 0 }" x-init="count = 10">
  Count starts at: <span x-text="count"></span>
</div>

<!-- Fetch data on init -->
<div
  x-data="{ posts: [] }"
  x-init="posts = await (await fetch('/api/posts')).json()"
>
  <template x-for="post in posts">
    <div x-text="post.title"></div>
  </template>
</div>
```

---

## Best Practices for Vecia

### 1. Keep State Minimal
```html
<!-- ✅ GOOD -->
<div x-data="{ open: false }">
  ...
</div>

<!-- ❌ AVOID: Too much state -->
<div x-data="{
  open: false,
  title: 'My Title',
  description: 'Long description...',
  items: [...],
  ...
}">
  ...
</div>
```

### 2. Use Methods for Complex Logic
```html
<!-- ✅ GOOD -->
<div x-data="{
  count: 0,
  increment() {
    this.count++;
    this.log();
  },
  log() {
    console.log('Count:', this.count);
  }
}">
  <button @click="increment()">+</button>
</div>

<!-- ❌ AVOID: Inline complex logic -->
<button @click="count++; console.log('Count:', count); /* more logic */">+</button>
```

### 3. Combine with Tailwind
```html
<div x-data="{ active: false }">
  <button
    @click="active = !active"
    :class="{ 'bg-primary text-white': active, 'bg-gray-200': !active }"
    class="px-4 py-2 rounded transition-colors"
  >
    Toggle
  </button>
</div>
```

---

## Resources

- **Alpine.js Docs**: https://alpinejs.dev
- **CDN Include**:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  ```
- **Our Implementation**: See Vecia components for real examples

---

**Last Updated**: 2025-10-05
**Status**: Reference for Vecia V5 implementation
