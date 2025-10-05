# Astro Components Reference (2025)
**Source**: Context7 - Astro Official Documentation
**Created**: 2025-10-05
**Purpose**: Latest component patterns for Vecia V5

---

## Component Props (TypeScript)

### Basic Props Interface
```astro
---
// src/components/Greeting.astro
interface Props {
  name: string;
  greeting?: string;  // Optional with ?
}

const { greeting = "Hello", name } = Astro.props;  // Default values
---
<h2>{greeting}, {name}!</h2>
```

### Props with HTML Attributes
```astro
---
import type { HTMLAttributes } from "astro/types";

// Extend HTML attributes
interface Props extends HTMLAttributes<"a"> {
  myProp?: boolean;
}

const { href, ...attrs } = Astro.props;
---
<a href={href} {...attrs}>
  <slot />
</a>
```

### Polymorphic Components
```astro
---
import type { HTMLTag, Polymorphic } from "astro/types";

type Props<Tag extends HTMLTag> = Polymorphic<{ as: Tag }>;

const { as: Tag, ...props } = Astro.props;
---
<Tag {...props} />
```

### Reference Props from Other Components
```astro
---
import type { ComponentProps } from "astro/types";
import Button from "./Button.astro";

type ButtonProps = ComponentProps<typeof Button>;
---
```

---

## Slots

### Default Slot
```astro
---
// Wrapper.astro
const { title } = Astro.props;
---
<div>
  <h1>{title}</h1>
  <slot />  <!-- Children go here -->
</div>
```

### Named Slots
```astro
---
// Layout.astro
---
<div>
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot />  <!-- Default slot -->
  </main>
  <footer>
    <slot name="footer" />
  </footer>
</div>
```

**Usage:**
```astro
<Layout>
  <h1 slot="header">Page Title</h1>
  <p>Main content here</p>
  <p slot="footer">Copyright 2025</p>
</Layout>
```

---

## Component Patterns for Vecia

### 1. Navigation Component
```astro
---
// src/components/Navigation.astro
interface Props {
  lang: 'fr' | 'en';
}

const { lang } = Astro.props;
---
```

### 2. Hero with Props
```astro
---
// src/components/Hero.astro
interface Props {
  headline: string;
  highlight: string;
  subheadline: string;
  body: string;
  cta1Text: string;
  cta2Text: string;
}

const { headline, highlight, subheadline, body, cta1Text, cta2Text } = Astro.props;
---
```

### 3. Layout with Slots
```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  lang: 'fr' | 'en';
}

const { title, description, lang } = Astro.props;
---
<!DOCTYPE html>
<html lang={lang}>
  <head>
    <title>{title}</title>
    <meta name="description" content={description}>
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Best Practices (2025)

1. ✅ **Always define Props interface** for TypeScript safety
2. ✅ **Use destructuring with defaults** for optional props
3. ✅ **Extend HTMLAttributes** when wrapping HTML elements
4. ✅ **Use named slots** for flexible content injection
5. ✅ **Keep components focused** - single responsibility

---

**Last Updated**: 2025-10-05
**Status**: Ready for Phase 4 implementation
