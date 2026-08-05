import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { searchRateLimiter } from '@/lib/rate-limit';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { createSafeErrorResponse, SafeErrorMessages } from '@/lib/safe-error';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  // Rate limiting check
  const rateLimitResult = searchRateLimiter.check(request);
  if (rateLimitResult.limited) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Sanitize search query to prevent SQL injection
    const searchTerm = sanitizeSearchQuery(query);

    if (searchTerm.length === 0) {
      return NextResponse.json({
        error: 'Invalid search query',
        results: [],
        query: '',
        count: 0
      }, { status: 400 });
    }

    // Search articles (title, content, excerpt)
    const articles = await sql`
      SELECT
        id,
        title,
        excerpt,
        slug,
        'article' as type,
        published_at
      FROM articles
      WHERE status = 'published'
      AND (
        title ILIKE ${'%' + searchTerm + '%'}
        OR content ILIKE ${'%' + searchTerm + '%'}
        OR excerpt ILIKE ${'%' + searchTerm + '%'}
      )
      ORDER BY published_at DESC
      LIMIT 10
    `;

    // Static content search (resources, volunteer, about)
    const staticPages = [];

    // Resources
    const resources = [
      { title: 'The White House', description: 'Official information from the presidency', url: '/resources', category: 'Executive' },
      { title: 'Guides.vote', description: 'Nonpartisan candidate guide with researched comparisons', url: '/resources', category: 'Elections' },
      { title: 'GovTrack', description: 'Federal bill tracking, voting records, and legislative history', url: '/resources', category: 'Legislative' },
      { title: 'Congress.gov', description: 'Official federal bill site', url: '/resources', category: 'Legislative' },
      { title: 'Vote Smart', description: 'Candidates, voting records, issue positions, public comments', url: '/resources', category: 'Elections' },
      { title: 'National Constitution Center', description: 'Learn about the U.S. Constitution', url: '/resources', category: 'Education' },
      { title: 'Senate Floor Activity', description: 'Track real-time Senate legislative action', url: '/resources', category: 'Legislative' },
      { title: 'Ballotpedia Legislation Trackers', description: 'Tracking candidates and legislation across all 50 states', url: '/resources', category: 'Elections' },
    ];

    resources.forEach(resource => {
      if (
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        staticPages.push({
          id: `resource-${resource.title}`,
          title: resource.title,
          excerpt: resource.description,
          url: resource.url,
          type: 'resource',
        });
      }
    });

    // Volunteer opportunities
    const opportunities = [
      { title: 'Join Advisory Boards', description: 'Find empty government seats near you', url: '/get-involved', category: 'Civic Leadership' },
      { title: 'JustServe', description: 'Find local service projects', url: '/get-involved', category: 'Local Service' },
      { title: 'Volunteers of America', description: 'National nonprofit with local affiliates', url: '/get-involved', category: 'National Nonprofit' },
      { title: 'AmeriCorps', description: '100,000+ volunteer opportunities nationwide', url: '/get-involved', category: 'National Service' },
      { title: 'Volunteer.gov', description: 'Federal volunteer portal for national parks', url: '/get-involved', category: 'Federal Programs' },
    ];

    opportunities.forEach(opp => {
      if (
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        staticPages.push({
          id: `volunteer-${opp.title}`,
          title: opp.title,
          excerpt: opp.description,
          url: opp.url,
          type: 'volunteer',
        });
      }
    });

    // About page keywords
    const aboutKeywords = [
      'america first', 'civic education', 'advocacy', 'nonpartisan', 'mission', 'values',
      'logical reasoning', 'fairness', 'principled decision-making', 'constitution',
      'about us', 'organization', 'contact', '501(c)(4)'
    ];

    if (aboutKeywords.some(keyword => keyword.includes(searchTerm.toLowerCase()) || searchTerm.toLowerCase().includes(keyword))) {
      staticPages.push({
        id: 'about-page',
        title: 'About America First',
        excerpt: 'Learn about our mission, values, and commitment to civic education and advocacy.',
        url: '/about',
        type: 'page',
      });
    }

    // Combine and return results
    const allResults = [
      ...articles.rows.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        url: `/articles/${article.slug}`,
        type: 'article',
        date: article.published_at,
      })),
      ...staticPages,
    ];

    return NextResponse.json({
      query: searchTerm,
      results: allResults,
      count: allResults.length,
    });
  } catch (error) {
    // Create safe error response (logs internally, returns generic message to client)
    const safeError = createSafeErrorResponse(
      error,
      'Search API',
      SafeErrorMessages.SEARCH_FAILED
    );

    return NextResponse.json(
      {
        ...safeError,
        results: [],
        query: searchParams.get('q') || '',
        count: 0
      },
      { status: 500 }
    );
  }
}
