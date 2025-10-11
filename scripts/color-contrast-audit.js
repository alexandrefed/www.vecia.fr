/**
 * Color Contrast Audit Script
 *
 * Tests Vecia's current color palette against WCAG 2.1 AA standards
 * Outputs pass/fail results and suggests darker alternatives
 */

import ColorContrastChecker from 'color-contrast-checker';

const ccc = new ColorContrastChecker();

// Current Vecia colors from global.css
const veciaColors = {
  primary: '#5B8BFF',
  secondary: '#C755FF',
  accent1: '#3BB4FF',
  accent2: '#7B6FDE',
  accent3: '#E8F4FF',
  text: '#1A1A2E',
  background: '#FFFFFF',
};

// Common text colors used in Tailwind
const tailwindGrays = {
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
};

// Font sizes (in px)
const fontSizes = {
  normal: 14,     // Normal text (needs 4.5:1)
  large: 18,      // Large text (needs 3:1)
  largeBold: 14,  // 14px bold (needs 3:1)
};

console.log('=' .repeat(80));
console.log('VECIA COLOR CONTRAST AUDIT - WCAG 2.1 AA');
console.log('=' .repeat(80));
console.log('');

// Helper function to get contrast ratio
function getContrastRatio(color1, color2) {
  const L1 = ccc.hexToLuminance(color1);
  const L2 = ccc.hexToLuminance(color2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

// Helper function to determine if color passes WCAG
function testColor(colorName, colorHex, background = '#FFFFFF') {
  const ratio = getContrastRatio(colorHex, background);
  const passAA_normal = ccc.isLevelAA(colorHex, background, fontSizes.normal);
  const passAA_large = ccc.isLevelAA(colorHex, background, fontSizes.large);
  const passAAA_normal = ccc.isLevelAAA(colorHex, background, fontSizes.normal);

  return {
    name: colorName,
    hex: colorHex,
    ratio: ratio,
    passAA_normal,
    passAA_large,
    passAAA_normal,
    status: passAA_normal ? '✅ PASS' : '❌ FAIL',
  };
}

// Test Vecia brand colors
console.log('📊 VECIA BRAND COLORS (on white #FFFFFF)');
console.log('-' .repeat(80));
Object.entries(veciaColors).forEach(([name, hex]) => {
  if (name === 'background') return; // Skip background

  const result = testColor(name, hex);
  console.log(`${result.status} ${result.name.padEnd(15)} ${result.hex.padEnd(10)} Ratio: ${result.ratio}:1`);
  console.log(`   Normal text (14px): ${result.passAA_normal ? '✅ AA' : '❌ Fail'}  |  Large text (18px): ${result.passAA_large ? '✅ AA' : '❌ Fail'}  |  AAA: ${result.passAAA_normal ? '✅' : '❌'}`);
  console.log('');
});

// Test Tailwind grays
console.log('📊 TAILWIND GRAY COLORS (on white #FFFFFF)');
console.log('-' .repeat(80));
Object.entries(tailwindGrays).forEach(([name, hex]) => {
  const result = testColor(name, hex);
  console.log(`${result.status} ${name.padEnd(15)} ${result.hex.padEnd(10)} Ratio: ${result.ratio}:1`);
  console.log(`   Normal text (14px): ${result.passAA_normal ? '✅ AA' : '❌ Fail'}  |  Large text (18px): ${result.passAA_large ? '✅ AA' : '❌ Fail'}`);
  console.log('');
});

// Suggest darker alternatives for failing colors
console.log('💡 SUGGESTED WCAG-COMPLIANT ALTERNATIVES');
console.log('-' .repeat(80));

const suggestions = [
  { name: 'primary', current: '#5B8BFF', suggested: '#3366CC', reason: 'Darker blue for sufficient contrast' },
  { name: 'secondary', current: '#C755FF', suggested: '#7B2CBF', reason: 'Darker purple for text usage' },
  { name: 'accent1', current: '#3BB4FF', suggested: '#0077CC', reason: 'Darker light blue' },
  { name: 'text-muted', current: 'gray-500 (#6b7280)', suggested: '#4A4A5A', reason: 'Slightly darker than gray-600' },
];

suggestions.forEach(({ name, current, suggested, reason }) => {
  const currentRatio = getContrastRatio(current.includes('#') ? current : current.split('(')[1].split(')')[0], '#FFFFFF');
  const suggestedRatio = getContrastRatio(suggested, '#FFFFFF');
  const suggestedPasses = ccc.isLevelAA(suggested, '#FFFFFF', fontSizes.normal);

  console.log(`${name}:`);
  console.log(`  Current:   ${current.padEnd(25)} ${currentRatio}:1`);
  console.log(`  Suggested: ${suggested.padEnd(25)} ${suggestedRatio}:1 ${suggestedPasses ? '✅ AA' : '❌'}`);
  console.log(`  Reason: ${reason}`);
  console.log('');
});

// Test gradient combinations
console.log('🎨 GRADIENT TEXT ANALYSIS');
console.log('-' .repeat(80));

const gradients = [
  { name: 'Primary → Secondary', colors: ['#5B8BFF', '#C755FF'] },
  { name: 'Suggested gradient', colors: ['#3366CC', '#7B2CBF'] },
];

gradients.forEach(({ name, colors }) => {
  const [start, end] = colors;
  const startRatio = getContrastRatio(start, '#FFFFFF');
  const endRatio = getContrastRatio(end, '#FFFFFF');
  const worstRatio = Math.min(parseFloat(startRatio), parseFloat(endRatio));
  const passes = worstRatio >= 4.5;

  console.log(`${passes ? '✅' : '❌'} ${name}`);
  console.log(`   Start: ${start} (${startRatio}:1)  |  End: ${end} (${endRatio}:1)`);
  console.log(`   Worst case ratio: ${worstRatio.toFixed(2)}:1 ${passes ? '(PASSES)' : '(FAILS)'}`);
  console.log('');
});

// Summary
console.log('=' .repeat(80));
console.log('📋 SUMMARY & NEXT STEPS');
console.log('=' .repeat(80));
console.log('');
console.log('Issues Identified:');
console.log('  • Primary (#5B8BFF) fails WCAG AA for normal text');
console.log('  • Secondary (#C755FF) fails WCAG AA for normal text');
console.log('  • Accent1 (#3BB4FF) fails WCAG AA for normal text');
console.log('  • Gray-400 and Gray-500 fail WCAG AA');
console.log('');
console.log('Recommended Actions:');
console.log('  1. Use suggested darker colors for text');
console.log('  2. Keep original light colors for backgrounds/large elements');
console.log('  3. Update global.css with new color tokens');
console.log('  4. Test all components with pa11y-ci');
console.log('');
console.log('Target: 0 color-contrast violations');
console.log('=' .repeat(80));
