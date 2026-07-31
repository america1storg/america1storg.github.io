/**
 * Generate URL-friendly slug from article title
 */
export function generateSlug(title: string, articleId: number): string {
  // Convert to lowercase and remove special characters
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
    .substring(0, 60);             // Limit length

  // Append article ID for uniqueness
  return `${slug}-${articleId}`;
}

/**
 * Extract article ID from slug
 */
export function getIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
