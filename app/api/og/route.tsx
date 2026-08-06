import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          <h1
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: 'white',
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            America <span style={{ color: '#3b82f6' }}>First</span>
          </h1>
          <p
            style={{
              fontSize: 40,
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 600,
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
