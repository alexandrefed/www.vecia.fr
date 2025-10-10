#!/usr/bin/env node

/**
 * Blog Memory Updater
 *
 * Extracts metaphors, hooks, and CTAs from blog articles and stores them
 * in Memory KB to prevent repetition in future articles.
 *
 * Usage:
 *   npm run blog:update-memory <article-slug>
 *   npm run blog:update-memory ia-ne-marche-pas
 *
 * This tool:
 * 1. Reads the blog article markdown file
 * 2. Extracts key elements (metaphors, hooks, CTAs)
 * 3. Stores them in Memory KB with tags for future reference
 * 4. Prevents repetition across articles
 *
 * Important: Run this AFTER production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

/**
 * Parse markdown frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const frontmatterText = match[1];
  const frontmatter = {};

  // Simple YAML parser
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let isArray = false;
  let arrayItems = [];

  for (const line of lines) {
    // Handle objects
    if (line.match(/^(\w+):\s*$/)) {
      if (currentKey && isArray) {
        frontmatter[currentKey] = arrayItems;
        arrayItems = [];
      }
      currentKey = line.match(/^(\w+):/)[1];
      isArray = false;
      frontmatter[currentKey] = {};
      continue;
    }

    // Handle array items
    if (line.match(/^\s*-\s+(.+)/)) {
      const value = line.match(/^\s*-\s+(.+)/)[1].replace(/^['"]|['"]$/g, '');
      arrayItems.push(value);
      isArray = true;
      continue;
    }

    // Handle simple key-value pairs
    if (line.match(/^(\w+):\s*(.+)/)) {
      if (currentKey && isArray) {
        frontmatter[currentKey] = arrayItems;
        arrayItems = [];
        isArray = false;
      }
      const [, key, value] = line.match(/^(\w+):\s*(.+)/);
      currentKey = key;

      // Handle dates
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
        frontmatter[key] = new Date(value);
      }
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        frontmatter[key] = value === 'true';
      }
      // Handle strings
      else {
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  // Flush any remaining array
  if (currentKey && isArray) {
    frontmatter[currentKey] = arrayItems;
  }

  return frontmatter;
}

/**
 * Extract markdown content (without frontmatter)
 */
function extractMarkdownContent(content) {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  return content.replace(frontmatterRegex, '').trim();
}

/**
 * Find article file by slug
 */
function findArticleFile(slug) {
  const contentDir = path.join(__dirname, '../src/content/blog');
  const possiblePaths = [
    path.join(contentDir, 'fr', `${slug}.md`),
    path.join(contentDir, 'en', `${slug}.md`),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

/**
 * Extract metaphors from content
 * Looks for comparative language patterns
 */
function extractMetaphors(content) {
  const metaphors = [];

  // Pattern 1: "like" comparisons
  const likePattern = /([^.!?]+(?:like|comme|tel|pareil)(?:\s+\w+){1,10}[.!?])/gi;
  const likeMatches = content.match(likePattern);
  if (likeMatches) {
    metaphors.push(...likeMatches.map(m => m.trim()));
  }

  // Pattern 2: "is a" or "est un" comparisons
  const isAPattern = /([^.!?]+(?:is a|est un|est une|c'est)(?:\s+\w+){1,15}[.!?])/gi;
  const isAMatches = content.match(isAPattern);
  if (isAMatches) {
    metaphors.push(...isAMatches.map(m => m.trim()));
  }

  // Pattern 3: Analogies with colons or dashes
  const analogyPattern = /([^.!?]+:\s*[^.!?]+(?:like|similar|comme|similaire)[^.!?]+[.!?])/gi;
  const analogyMatches = content.match(analogyPattern);
  if (analogyMatches) {
    metaphors.push(...analogyMatches.map(m => m.trim()));
  }

  return [...new Set(metaphors)]; // Remove duplicates
}

/**
 * Extract hooks from content
 * Looks for compelling opening lines and questions
 */
function extractHooks(content) {
  const hooks = [];
  const lines = content.split('\n').filter(line => line.trim());

  // First 3 non-heading lines (likely intro hooks)
  let nonHeadingCount = 0;
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (nonHeadingCount < 3) {
      hooks.push(line.trim());
      nonHeadingCount++;
    } else {
      break;
    }
  }

  // Questions (strong hooks)
  const questionPattern = /([^.!?]+\?)/g;
  const questions = content.match(questionPattern);
  if (questions) {
    hooks.push(...questions.slice(0, 5).map(q => q.trim())); // First 5 questions
  }

  // Stat-based hooks (numbers in opening)
  const statPattern = /([^.!?]*\d{1,3}%[^.!?]*[.!?])/g;
  const stats = content.match(statPattern);
  if (stats) {
    hooks.push(...stats.slice(0, 3).map(s => s.trim())); // First 3 stat hooks
  }

  return [...new Set(hooks)]; // Remove duplicates
}

/**
 * Extract CTAs from content
 * Looks for calls-to-action patterns
 */
function extractCTAs(content) {
  const ctas = [];

  // Pattern 1: Action verbs at sentence start
  const actionPattern = /^((?:Contactez|Contact|Découvrez|Discover|Essayez|Try|Commencez|Start|Téléchargez|Download|Rejoignez|Join)[^.!?]+[.!?])/gmi;
  const actionMatches = content.match(actionPattern);
  if (actionMatches) {
    ctas.push(...actionMatches.map(m => m.trim()));
  }

  // Pattern 2: Links with action text (common CTA pattern)
  const linkPattern = /\[([^\]]+)\]\([^)]+\)/g;
  const linkMatches = content.matchAll(linkPattern);
  for (const match of linkMatches) {
    const linkText = match[1];
    // Filter for CTA-like link text
    if (linkText.match(/(?:contact|demo|essai|trial|gratuit|free|commenc|start|découvr|discover)/i)) {
      ctas.push(linkText.trim());
    }
  }

  // Pattern 3: Button/CTA blocks (markdown extensions)
  const ctaBlockPattern = /(?:button|cta|call).*?:\s*(.+)/gi;
  const ctaBlockMatches = content.match(ctaBlockPattern);
  if (ctaBlockMatches) {
    ctas.push(...ctaBlockMatches.map(m => m.trim()));
  }

  return [...new Set(ctas)]; // Remove duplicates
}

/**
 * Display extracted elements in terminal
 */
function displayExtractedElements(metaphors, hooks, ctas, articleTitle, slug) {
  console.log(`\n${colors.bright}${colors.magenta}📚 Extracted Elements from: ${articleTitle}${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Metaphors
  console.log(`${colors.bright}${colors.blue}🎭 Metaphors (${metaphors.length})${colors.reset}`);
  if (metaphors.length > 0) {
    metaphors.forEach((m, i) => {
      console.log(`${colors.yellow}${i + 1}.${colors.reset} ${m.substring(0, 100)}${m.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log(`${colors.yellow}   No metaphors detected${colors.reset}`);
  }
  console.log();

  // Hooks
  console.log(`${colors.bright}${colors.blue}🪝 Hooks (${hooks.length})${colors.reset}`);
  if (hooks.length > 0) {
    hooks.forEach((h, i) => {
      console.log(`${colors.yellow}${i + 1}.${colors.reset} ${h.substring(0, 100)}${h.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log(`${colors.yellow}   No hooks detected${colors.reset}`);
  }
  console.log();

  // CTAs
  console.log(`${colors.bright}${colors.blue}🎯 CTAs (${ctas.length})${colors.reset}`);
  if (ctas.length > 0) {
    ctas.forEach((c, i) => {
      console.log(`${colors.yellow}${i + 1}.${colors.reset} ${c.substring(0, 100)}${c.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log(`${colors.yellow}   No CTAs detected${colors.reset}`);
  }
  console.log();

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}💾 Ready to store in Memory KB${colors.reset}`);
  console.log(`${colors.yellow}📝 Tags: blog-${slug}, metaphors, hooks, ctas${colors.reset}\n`);
}

/**
 * Prepare memory entries for storage
 */
function prepareMemoryEntries(metaphors, hooks, ctas, articleTitle, slug, lang) {
  const entries = [];

  // Store metaphors
  if (metaphors.length > 0) {
    entries.push({
      content: `Blog Article "${articleTitle}" (${lang}) - Metaphors:\n${metaphors.map((m, i) => `${i + 1}. ${m}`).join('\n')}`,
      metadata: {
        tags: `blog-${slug},metaphors,${lang}`,
        type: 'blog-metaphors'
      }
    });
  }

  // Store hooks
  if (hooks.length > 0) {
    entries.push({
      content: `Blog Article "${articleTitle}" (${lang}) - Hooks:\n${hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}`,
      metadata: {
        tags: `blog-${slug},hooks,${lang}`,
        type: 'blog-hooks'
      }
    });
  }

  // Store CTAs
  if (ctas.length > 0) {
    entries.push({
      content: `Blog Article "${articleTitle}" (${lang}) - CTAs:\n${ctas.map((c, i) => `${i + 1}. ${c}`).join('\n')}`,
      metadata: {
        tags: `blog-${slug},ctas,${lang}`,
        type: 'blog-ctas'
      }
    });
  }

  return entries;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`${colors.red}❌ Error: Article slug required${colors.reset}`);
    console.log(`\n${colors.bright}Usage:${colors.reset}`);
    console.log(`  npm run blog:update-memory <article-slug>`);
    console.log(`\n${colors.bright}Example:${colors.reset}`);
    console.log(`  npm run blog:update-memory ia-ne-marche-pas`);
    process.exit(1);
  }

  const slug = args[0];

  console.log(`\n${colors.bright}${colors.blue}Blog Memory Updater${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  console.log(`🔍 Searching for article: ${colors.yellow}${slug}${colors.reset}`);

  // Find the article file
  const articlePath = findArticleFile(slug);

  if (!articlePath) {
    console.log(`${colors.red}❌ Article not found: ${slug}${colors.reset}`);
    console.log(`\n${colors.yellow}Searched in:${colors.reset}`);
    console.log(`  - src/content/blog/fr/${slug}.md`);
    console.log(`  - src/content/blog/en/${slug}.md`);
    process.exit(1);
  }

  console.log(`${colors.green}✓${colors.reset} Found: ${articlePath}\n`);

  // Read and parse the file
  const content = fs.readFileSync(articlePath, 'utf-8');
  const frontmatter = parseFrontmatter(content);
  const markdownContent = extractMarkdownContent(content);

  if (!frontmatter) {
    console.log(`${colors.red}❌ Failed to parse frontmatter${colors.reset}`);
    process.exit(1);
  }

  // Determine language
  const lang = articlePath.includes('/fr/') ? 'fr' : 'en';
  const articleTitle = frontmatter.title || slug;

  console.log(`${colors.bright}📖 Article: ${articleTitle}${colors.reset}`);
  console.log(`${colors.bright}🌍 Language: ${lang}${colors.reset}\n`);
  console.log(`${colors.yellow}⚡ Analyzing content...${colors.reset}\n`);

  // Extract elements
  const metaphors = extractMetaphors(markdownContent);
  const hooks = extractHooks(markdownContent);
  const ctas = extractCTAs(markdownContent);

  // Display extracted elements
  displayExtractedElements(metaphors, hooks, ctas, articleTitle, slug);

  // Prepare memory entries
  const memoryEntries = prepareMemoryEntries(metaphors, hooks, ctas, articleTitle, slug, lang);

  console.log(`${colors.bright}${colors.green}✓ Analysis Complete${colors.reset}`);
  console.log(`${colors.yellow}📊 Summary: ${metaphors.length} metaphors, ${hooks.length} hooks, ${ctas.length} CTAs${colors.reset}`);
  console.log(`${colors.yellow}💾 Ready to store ${memoryEntries.length} memory entries${colors.reset}\n`);

  console.log(`${colors.bright}${colors.magenta}⚠️  NEXT STEP (Manual):${colors.reset}`);
  console.log(`${colors.yellow}This script extracts the data but cannot directly call MCP tools.${colors.reset}`);
  console.log(`${colors.yellow}Please use Claude Code to store these entries in Memory KB:${colors.reset}\n`);

  // Output JSON for Claude Code to consume
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(JSON.stringify(memoryEntries, null, 2));
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
