import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Fetch the HTML of the target URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AmericaFirstBot/1.0; +https://america1stusa.vercel.app)',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: response.status });
    }

    const html = await response.text();

    // Extract Open Graph image
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

    if (ogImageMatch && ogImageMatch[1]) {
      let imageUrl = ogImageMatch[1];

      // Handle relative URLs
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }

      return NextResponse.json({ imageUrl });
    }

    // Fallback: Try twitter:image
    const twitterImageMatch = html.match(/<meta\s+(?:name|property)=["']twitter:image["']\s+content=["']([^"']+)["']/i);

    if (twitterImageMatch && twitterImageMatch[1]) {
      let imageUrl = twitterImageMatch[1];

      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }

      return NextResponse.json({ imageUrl });
    }

    // No social image found
    return NextResponse.json({ error: 'No social image found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching OG image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
