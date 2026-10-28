import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes = ['', '/sign-in', '/sign-up'].map((route) => ({
    url: `${baseUrl}${route}`,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}