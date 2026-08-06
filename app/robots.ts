import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/auth'],
      },
    ],
    sitemap: 'https://america1stusa.com/sitemap.xml',
  };
}
