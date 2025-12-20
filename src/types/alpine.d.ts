/**
 * Alpine.js Type Declarations
 *
 * Simplified declarations to avoid strict type checking on Alpine.js
 * internal data structures which are dynamically typed.
 */

declare module 'alpinejs' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Alpine: any;
  export default Alpine;
}

declare module '@alpinejs/intersect' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intersect: any;
  export default intersect;
}
