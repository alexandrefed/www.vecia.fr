#!/usr/bin/env node

/**
 * LinkedIn Post Generator for Vecia Blog
 *
 * Generates LinkedIn-ready posts from blog article metadata
 * Following 2025 best practices:
 * - Well-spaced text with visual breaks
 * - 3-5 targeted hashtags (optimal for LinkedIn algorithm)
 * - Manual posting recommended (authenticity > automation)
 * - Engagement tips for maximum reach
 *
 * Usage:
 *   npm run linkedin:generate <article-slug>
 *   npm run linkedin:generate automatisation-5-signes
 *
 * Reads frontmatter fields:
 *   - linkedin.caption: Main post text
 *   - linkedin.hashtags: Array of hashtags (max 5 recommended)
 *   - title: Article title
 *   - description: Article description
 *
 * Outputs formatted post ready to copy-paste to LinkedIn
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

  // Simple YAML parser for our needs
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let isArray = false;
  let arrayItems = [];

  for (const line of lines) {
    // Handle objects (like linkedin:)
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

    // Handle nested properties (like  caption:)
    if (line.match(/^\s{2,}(\w+):\s*(.+)/)) {
      const [, nestedKey, value] = line.match(/^\s{2,}(\w+):\s*(.+)/);
      if (currentKey && typeof frontmatter[currentKey] === 'object') {
        // Check if it's an array value
        if (value.startsWith('[')) {
          // Parse array: ["item1", "item2"]
          const arrayMatch = value.match(/\[(.*)\]/);
          if (arrayMatch) {
            frontmatter[currentKey][nestedKey] = arrayMatch[1]
              .split(',')
              .map(item => item.trim().replace(/['"]/g, ''));
          }
        } else {
          frontmatter[currentKey][nestedKey] = value.replace(/^['"]|['"]$/g, '');
        }
      }
      continue;
    }

    // Handle array items (lines starting with -)
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
 * Generate LinkedIn post from article metadata
 */
function generateLinkedInPost(frontmatter, articleUrl) {
  const { title, description, linkedin } = frontmatter;

  // Build the LinkedIn post
  let post = '';

  // 1. Custom caption or fallback to description
  if (linkedin && linkedin.caption) {
    post += linkedin.caption;
  } else {
    post += `📢 Nouvel article sur le blog Vecia !\n\n`;
    post += `${title}\n\n`;
    post += `${description}`;
  }

  // 2. Add call-to-action
  post += `\n\n👉 Lire l'article complet : ${articleUrl}`;

  // 3. Add hashtags (max 5 for 2025 LinkedIn best practices)
  if (linkedin && linkedin.hashtags && linkedin.hashtags.length > 0) {
    post += `\n\n`;
    // Limit to 5 hashtags (2025 best practice)
    const hashtagsToUse = linkedin.hashtags.slice(0, 5);
    const hashtags = hashtagsToUse
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
      .join(' ');
    post += hashtags;
  } else {
    // Default hashtags (3-5 is optimal for LinkedIn algorithm)
    post += `\n\n#Automatisation #IA #ProductivitéEntreprise`;
  }

  return post;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`${colors.red}❌ Error: Article slug required${colors.reset}`);
    console.log(`\n${colors.bright}Usage:${colors.reset}`);
    console.log(`  npm run linkedin:generate <article-slug>`);
    console.log(`\n${colors.bright}Example:${colors.reset}`);
    console.log(`  npm run linkedin:generate automatisation-5-signes`);
    process.exit(1);
  }

  const slug = args[0];

  console.log(`\n${colors.bright}${colors.blue}LinkedIn Post Generator${colors.reset}`);
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

  if (!frontmatter) {
    console.log(`${colors.red}❌ Failed to parse frontmatter${colors.reset}`);
    process.exit(1);
  }

  // Determine language and URL
  const lang = articlePath.includes('/fr/') ? 'fr' : 'en';
  const baseUrl = 'https://vecia.com'; // Update with actual site URL
  const articleUrl = lang === 'fr'
    ? `${baseUrl}/blog/${slug}`
    : `${baseUrl}/en/blog/${slug}`;

  // Generate the LinkedIn post
  const linkedInPost = generateLinkedInPost(frontmatter, articleUrl);

  // Output the result
  console.log(`${colors.bright}${colors.green}✓ LinkedIn Post Generated${colors.reset}\n`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(linkedInPost);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`${colors.bright}📋 Copy the text above and paste it to LinkedIn${colors.reset}\n`);

  // 2025 LinkedIn Best Practices
  console.log(`${colors.bright}${colors.blue}🚀 2025 LinkedIn Best Practices:${colors.reset}`);
  console.log(`${colors.blue}  • First hour is critical${colors.reset} - Post when your audience is most active`);
  console.log(`${colors.blue}  • Respond to comments within 60 minutes${colors.reset} - Signals active engagement to algorithm`);
  console.log(`${colors.blue}  • Ask a question${colors.reset} - Invite responses to boost interaction`);
  console.log(`${colors.blue}  • Tag relevant people strategically${colors.reset} - Not spammy, adds value`);
  console.log(`${colors.blue}  • 3-5 hashtags is optimal${colors.reset} - More hurts discoverability\n`);

  console.log(`${colors.yellow}💡 Customization Tip:${colors.reset}`);
  console.log(`${colors.yellow}  Edit linkedin.caption and linkedin.hashtags in the article frontmatter for tailored posts${colors.reset}\n`);

  // Optionally write to clipboard (requires 'clipboardy' package)
  // For now, just print to console
}

// Run the script
main();
