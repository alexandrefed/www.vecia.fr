import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { config } from '../config';

export async function GET(context: APIContext) {
  // Get all blog posts from both languages
  const allPosts = await getCollection('blog');

  // Sort by publish date (newest first)
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
  );

  return rss({
    // RSS feed metadata
    title: `${config.site.title} Blog - Process Automation Insights`,
    description: 'Discover how to automate your business processes with no-code tools. Practical guides, case studies, and expert insights.',
    site: context.site?.toString() || config.site.url,

    // RSS feed items
    items: sortedPosts.map((post) => {
      // Determine language from post ID
      const lang = post.id.startsWith('fr/') ? 'fr' : 'en';

      // Generate URL based on language
      const slug = post.id.replace(`${lang}/`, '').replace('.md', '');
      const url = lang === 'fr'
        ? `${config.site.url}/blog/${slug}`
        : `${config.site.url}/en/blog/${slug}`;

      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: url,
        author: post.data.author || config.site.title,
        categories: post.data.tags || [],

        // Custom namespaces for additional metadata
        customData: `
          <language>${lang}</language>
          <category>${post.data.category}</category>
          ${post.data.image ? `<enclosure url="${post.data.image.startsWith('http') ? post.data.image : `${config.site.url}${post.data.image}`}" type="image/jpeg" />` : ''}
        `.trim(),
      };
    }),

    // RSS feed customization
    customData: `
      <language>fr</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro v${import.meta.env.ASTRO_VERSION} + @astrojs/rss</generator>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <webMaster>contact@vecia.com (Vecia Team)</webMaster>
      <managingEditor>contact@vecia.com (Vecia Team)</managingEditor>
      <copyright>Copyright ${new Date().getFullYear()} Vecia. All rights reserved.</copyright>
      <ttl>60</ttl>
    `.trim(),

    // Styling for RSS readers
    stylesheet: '/rss-styles.xsl',
  });
}
