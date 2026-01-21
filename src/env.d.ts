/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    "x-data"?: string;
    "x-show"?: string;
    "x-init"?: string;
    "x-text"?: string;
    "x-html"?: string;
    "x-model"?: string;
    "x-bind"?: string;
    "x-on"?: string;
    "x-ref"?: string;
    "x-cloak"?: string | boolean;
    "x-transition"?: string | boolean;
    "@click"?: string;
    "@submit"?: string;
    "@mouseenter"?: string;
    "@mouseleave"?: string;
    "@touchstart"?: string;
    "@touchend"?: string;
    "@keydown"?: string;
    "@change"?: string;
    "@input"?: string;
    ":class"?: string;
    ":disabled"?: string;
    ":id"?: string;
    ":value"?: string;
    ":href"?: string;
    ":src"?: string;
    ":style"?: string;
    ":aria-expanded"?: string;
    ":aria-hidden"?: string;
  }
}

// Alpine.js magic properties
interface AlpineComponent {
  $el?: HTMLElement;
  $refs?: Record<string, HTMLElement>;
  [key: string]: any;
}
