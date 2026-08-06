import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Fetch the logo from the public directory
    const { origin } = new URL(request.url);
    const logoResponse = await fetch(`${origin}/logo-dark-smaller.jpg`);

    if (!logoResponse.ok) {
      throw new Error('Failed to fetch logo');
    }

    const logoBuffer = await logoResponse.arrayBuffer();
    const logoBase64 = btoa(
      String.fromCharCode(...new Uint8Array(logoBuffer))
    );

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a1e42 0%, #1e3a8a 50%, #2563eb 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Your actual logo */}
          <img
            src={`data:image/jpeg;base64,${logoBase64}`}
            width="400"
            height="400"
            style={{
              marginBottom: '30px',
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              margin: 0,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            Civic Education & Advocacy
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    // Fallback if logo fails to load
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a1e42 0%, #1e3a8a 50%, #2563eb 100%)',
          }}
        >
          <h1 style={{ fontSize: 88, color: 'white', fontWeight: 900 }}>
            AMERICA FIRST
          </h1>
          <p style={{ fontSize: 42, color: 'rgba(255,255,255,0.9)' }}>
            Civic Education & Advocacy
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
