import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  // Use logo-dark-smaller.jpg (525KB) - optimized for Edge runtime
  const logoUrl = new URL('/logo-dark-smaller.jpg', 'https://america1stusa.vercel.app').toString();

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
          background: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Logo Image */}
          <img
            src={logoUrl}
            alt="America First"
            width="500"
            height="500"
            style={{
              marginBottom: 20,
            }}
          />
          <p
            style={{
              fontSize: 42,
              color: '#1e3a8a',
              fontWeight: 700,
              marginTop: 0,
            }}
          >
            Civic Education & Advocacy
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
