import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  // Fetch logo directly in Edge function
  const logoResponse = await fetch(
    new URL('/logo-dark-smaller.jpg', 'https://america1stusa.vercel.app')
  );
  const logoArrayBuffer = await logoResponse.arrayBuffer();
  const logoBase64 = Buffer.from(logoArrayBuffer).toString('base64');
  const logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;

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
          {/* Logo as base64 data URL */}
          <img
            src={logoDataUrl}
            alt="America First"
            width="450"
            height="450"
            style={{
              marginBottom: 30,
            }}
          />
          <p
            style={{
              fontSize: 48,
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 700,
              margin: 0,
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
