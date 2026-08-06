import { MetadataRoute } from 'next';
import { sql } from '@vercel/postgres';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://america1stusa.com';

  // Static pages
  const routes = [
    '',
    '/articles',
    '/resources',
    '/get-involved',
    '/about',
    '/search',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic article pages
  try {
    const articles = await sql`
      SELECT slug, updated_at
      FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC
    `;

    const articleRoutes = articles.rows.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...articleRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
