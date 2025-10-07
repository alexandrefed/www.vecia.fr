import Alpine from 'alpinejs';
import intersect from '@alpinejs/intersect';

// Register Intersect plugin
Alpine.plugin(intersect);

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.start();
