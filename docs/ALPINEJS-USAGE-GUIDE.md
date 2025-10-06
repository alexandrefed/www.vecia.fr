# Alpine.js Usage Guide - Vecia Website V5

## 🚨 Critical Decision Rule

**Ask yourself: "Does this component need to maintain STATE or respond to USER INTERACTIONS beyond hover/focus?"**

- **YES** → Use Alpine.js
- **NO** → Use pure Tailwind CSS

---

## ✅ When to USE Alpine.js

### 1. **Dropdowns / Select Menus**
```html
<!-- Language switcher, user menus, etc. -->
<div x-data="{ open: false }" class="relative">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" @click.outside="open = false">
    <!-- Dropdown content -->
  </div>
</div>
```
**Why:** Needs to track open/closed state

### 2. **Mobile Hamburger Menus**
```html
<!-- Navigation mobile menu -->
<button x-data="{ mobileOpen: false }" @click="mobileOpen = !mobileOpen">
  <svg><!-- Hamburger icon --></svg>
</button>
<div x-show="mobileOpen" @click.outside="mobileOpen = false">
  <!-- Mobile menu items -->
</div>
```
**Why:** Needs toggle state and click-outside detection

### 3. **Tabs / Accordions**
```html
<!-- Tab component -->
<div x-data="{ activeTab: 'tab1' }">
  <button @click="activeTab = 'tab1'" :class="{ 'active': activeTab === 'tab1' }">Tab 1</button>
  <button @click="activeTab = 'tab2'" :class="{ 'active': activeTab === 'tab2' }">Tab 2</button>

  <div x-show="activeTab === 'tab1'">Tab 1 Content</div>
  <div x-show="activeTab === 'tab2'">Tab 2 Content</div>
</div>
```
**Why:** Needs to track which tab is active

### 4. **Forms with Conditional Fields**
```html
<!-- Show/hide fields based on selection -->
<div x-data="{ userType: 'individual' }">
  <select x-model="userType">
    <option value="individual">Individual</option>
    <option value="business">Business</option>
  </select>

  <div x-show="userType === 'business'">
    <input type="text" placeholder="Company Name" />
  </div>
</div>
```
**Why:** Needs to react to user input and show/hide elements

### 5. **Modals / Dialogs**
```html
<!-- Popup modal -->
<div x-data="{ modalOpen: false }">
  <button @click="modalOpen = true">Open Modal</button>

  <div x-show="modalOpen" @click.outside="modalOpen = false">
    <!-- Modal content -->
    <button @click="modalOpen = false">Close</button>
  </div>
</div>
```
**Why:** Needs open/close state management

---

## ❌ When NOT to Use Alpine.js

### 1. **Simple Buttons with Hover Effects**
```html
<!-- WRONG - Don't use Alpine for hover effects -->
<button x-data="{ isHovered: false }"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        :class="{ 'bg-blue-700': isHovered }">
  Button
</button>

<!-- RIGHT - Use Tailwind hover utilities -->
<button class="bg-blue-500 hover:bg-blue-700 hover:scale-105 transition-all">
  Button
</button>
```
**Why:** Tailwind's `hover:` variants are simpler and faster

### 2. **Static Animations**
```html
<!-- WRONG - Overly complex -->
<div x-data="{ animate: false }"
     x-init="setTimeout(() => animate = true, 100)"
     :class="{ 'opacity-100': animate }">
  Content
</div>

<!-- RIGHT - Use Tailwind animations -->
<div class="animate-fadeIn">Content</div>
```
**Why:** CSS animations are more performant

### 3. **Gradient Buttons**
```html
<!-- WRONG - Unnecessary complexity -->
<button x-data="{ isHovered: false }"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        :style="`background: ${isHovered ? '#111' : '#333'}`">
  Button
</button>

<!-- RIGHT - Pure Tailwind -->
<button class="bg-gradient-to-r from-primary to-secondary hover:shadow-xl transition-all">
  Button
</button>
```
**Why:** Tailwind gradients work perfectly without Alpine

### 4. **Link Hover States**
```html
<!-- WRONG -->
<a x-data="{ active: false }" @mouseenter="active = true">Link</a>

<!-- RIGHT -->
<a class="text-gray-700 hover:text-primary transition-colors">Link</a>
```
**Why:** CSS hover is built for this

---

## 🎯 Decision Flowchart

```
Does it need to remember state? (open/closed, selected, etc.)
├─ YES → Does it respond to clicks/interactions?
│         ├─ YES → Use Alpine.js ✅
│         └─ NO → Use Tailwind only ❌
└─ NO → Is it just hover/focus effects?
          ├─ YES → Use Tailwind hover:/focus: ❌
          └─ NO → Reconsider if you really need interactivity
```

---

## 📚 Working Examples from Our Codebase

### ✅ GOOD: Navigation Language Dropdown (Uses Alpine)
**File:** `src/components/Navigation.astro:56-99`

```html
<!-- Alpine is NEEDED here for state management -->
<div x-data="{ open: false }" class="relative">
  <button @click="open = !open">
    <span>fr</span>
    <svg :class="{ 'rotate-180': open }">...</svg>
  </button>

  <div x-show="open" @click.outside="open = false">
    <a href="/">Français</a>
    <a href="/en/">English</a>
  </div>
</div>
```
**Why it works:** Dropdown needs to track open/close state

### ✅ GOOD: Navigation CTA Buttons (Pure Tailwind)
**File:** `src/components/Navigation.astro:111-116`

```html
<!-- NO Alpine needed - just hover effects -->
<a href="/commencer"
   class="px-6 py-2.5 text-base font-semibold rounded-lg text-white
          bg-gradient-to-r from-primary to-secondary
          hover:scale-105 hover:shadow-lg transition-all">
  Commencer
</a>
```
**Why it works:** Simple hover effects don't need state

### ❌ BAD: Hero Buttons (Incorrectly Used Alpine)
**File:** `src/components/Hero.astro:38-50` (BEFORE FIX)

```html
<!-- WRONG - Alpine overkill for hover -->
<a x-data="{ isHovered: false }"
   @mouseenter="isHovered = true"
   @mouseleave="isHovered = false"
   :style="`background: ${isHovered ? '#7B3FC6' : '#9B59F6'}`">
  Button
</a>

<!-- FIXED - Pure Tailwind -->
<a href="#audit"
   class="px-8 py-4 font-semibold rounded-lg text-white
          bg-primary hover:bg-primary/90
          hover:shadow-xl hover:-translate-y-1 hover:scale-105
          transition-all">
  Button
</a>
```
**Why fixed version is better:** No Alpine dependency, works instantly

---

## 🔧 Troubleshooting

### "Alpine.js not working"
1. **Check if Alpine is loaded:**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js" defer></script>
   ```
2. **Ensure `defer` attribute is present**
3. **Check browser console for errors**

### "Buttons not rendering"
1. **Did you use Alpine for hover effects?** → Switch to Tailwind `hover:`
2. **Are you using `bg-gradient-to-r`?** → This works in our setup
3. **Check if colors are defined in `src/styles/global.css`**

### "Dropdown not closing"
1. **Make sure `@click.outside` is on the dropdown div, not the button**
2. **Check z-index conflicts**
3. **Verify `x-show` is on the correct element**

---

## 📋 Quick Reference: Common Patterns

### Button Patterns

```html
<!-- Primary solid button -->
<button class="bg-primary text-white px-6 py-3 rounded-lg
               hover:bg-primary/90 hover:scale-105 transition-all">
  Primary Button
</button>

<!-- Gradient button -->
<button class="bg-gradient-to-r from-primary to-secondary text-white
               px-6 py-3 rounded-lg hover:shadow-xl hover:scale-105
               transition-all">
  Gradient Button
</button>

<!-- Outlined button -->
<button class="border-2 border-primary text-primary px-6 py-3 rounded-lg
               hover:bg-primary hover:text-white transition-all">
  Outlined Button
</button>
```

### Alpine Patterns

```html
<!-- Toggle visibility -->
<div x-data="{ show: false }">
  <button @click="show = !show">Toggle</button>
  <div x-show="show">Content</div>
</div>

<!-- Click outside to close -->
<div x-data="{ open: false }">
  <button @click="open = true">Open</button>
  <div x-show="open" @click.outside="open = false">
    Dropdown
  </div>
</div>

<!-- Tab switching -->
<div x-data="{ tab: 'one' }">
  <button @click="tab = 'one'">Tab 1</button>
  <button @click="tab = 'two'">Tab 2</button>
  <div x-show="tab === 'one'">Tab 1 Content</div>
  <div x-show="tab === 'two'">Tab 2 Content</div>
</div>
```

---

## 🎨 Our Design Tokens (Use These!)

```css
/* Colors (defined in src/styles/global.css) */
--color-primary: #5B8BFF;      /* Use: bg-primary, text-primary */
--color-secondary: #9B59F6;    /* Use: bg-secondary, text-secondary */
--color-accent1: #3BB4FF;      /* Use: bg-accent1, text-accent1 */
--color-accent2: #7B6FDE;      /* Use: bg-accent2, text-accent2 */
--color-accent3: #E8F4FF;      /* Use: bg-accent3, text-accent3 */
```

**Gradient Examples:**
```html
<!-- Primary to Secondary (Blue to Purple) -->
<div class="bg-gradient-to-r from-primary to-secondary">...</div>

<!-- Secondary to Accent1 (Purple to Light Blue) -->
<div class="bg-gradient-to-r from-secondary to-accent1">...</div>

<!-- Accent2 to Primary (Purple-blue to Blue) -->
<div class="bg-gradient-to-r from-accent2 to-primary">...</div>
```

---

## 🚀 Pro Tips

1. **Default to Tailwind first** - Only add Alpine when absolutely necessary
2. **Test without Alpine** - If hover works with `hover:`, you don't need Alpine
3. **Keep state local** - Each `x-data` creates isolated component state
4. **Use `@click.outside`** - Perfect for closing dropdowns/modals
5. **Combine with Tailwind transitions** - Alpine shows/hides, Tailwind animates

---

## 📝 Summary

| Feature | Use | Don't Use Alpine |
|---------|-----|------------------|
| Dropdowns | ✅ Alpine | ❌ |
| Mobile menus | ✅ Alpine | ❌ |
| Tabs | ✅ Alpine | ❌ |
| Modals | ✅ Alpine | ❌ |
| Form conditionals | ✅ Alpine | ❌ |
| Button hovers | ❌ | ✅ Tailwind `hover:` |
| Gradient buttons | ❌ | ✅ Tailwind `bg-gradient-to-r` |
| Link hovers | ❌ | ✅ Tailwind `hover:` |
| Simple animations | ❌ | ✅ Tailwind `animate-` |

**Golden Rule:** If Tailwind can do it with `hover:`, `focus:`, or `group-hover:`, don't use Alpine.

---

*Last Updated: 2025-10-05*
*Vecia Website V5 - Alpine.js Usage Standards*
