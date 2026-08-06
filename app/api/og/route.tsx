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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a1e42 0%, #1e3a8a 50%, #2563eb 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Star emblem */}
          <div
            style={{
              fontSize: 180,
              marginBottom: '30px',
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
            }}
          >
            ⭐
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              marginBottom: '20px',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            AMERICA FIRST
          </h1>

          {/* Divider */}
          <div
            style={{
              width: '400px',
              height: '4px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              marginBottom: '20px',
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              letterSpacing: '0.02em',
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
