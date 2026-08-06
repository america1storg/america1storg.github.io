import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  // Fetch the logo
  const logoUrl = new URL('/logo-dark.png', 'https://america1stusa.vercel.app').toString();

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
          background: 'linear-gradient(135deg, #000a2e 0%, #1e3a8a 100%)',
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
            width="400"
            height="400"
            style={{
              marginBottom: 40,
            }}
          />
          <p
            style={{
              fontSize: 48,
              color: 'rgba(255, 255, 255, 0.9)',
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
