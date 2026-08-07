import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://america1stusa.vercel.app';
    const response = await fetch(`${baseUrl}/api/articles?slug=${slug}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return data.article;
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  // If article has a cover image, return it
  if (article?.cover_image) {
    // Handle base64 data URLs
    if (article.cover_image.startsWith('data:image/')) {
      const base64Data = article.cover_image.split(',')[1];
      const mimeType = article.cover_image.match(/data:(image\/[a-z]+);/)?.[1] || 'image/jpeg';

      const imageBuffer = Buffer.from(base64Data, 'base64');
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Handle HTTP URLs
    if (article.cover_image.startsWith('http')) {
      try {
        const imageResponse = await fetch(article.cover_image);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          return new Response(imageBuffer, {
            headers: {
              'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching cover image:', error);
      }
    }

    // Handle relative URLs
    if (article.cover_image.startsWith('/')) {
      const coverImageUrl = `https://america1stusa.vercel.app${article.cover_image}`;
      try {
        const imageResponse = await fetch(coverImageUrl);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          return new Response(imageBuffer, {
            headers: {
              'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching cover image:', error);
      }
    }
  }

  // Fallback: Generate OG image with title
  const title = article?.title || 'Article';
  const excerpt = article?.content
    ? article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
    : 'Read more on America First';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000a2e 0%, #1e3a8a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              display: 'flex',
            }}
          >
            America First
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              maxWidth: '1000px',
              display: 'flex',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.4,
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex' }}>america1stusa.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
