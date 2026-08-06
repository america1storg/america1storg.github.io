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
          background: 'linear-gradient(135deg, #000a2e 0%, #1e3a8a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '60px',
          }}
        >
          {/* Large "A" emblem to represent America First */}
          <div
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '48px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              border: '8px solid rgba(220, 38, 38, 0.6)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  fontSize: 140,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #000a2e 0%, #1e3a8a 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  marginBottom: '-20px',
                }}
              >
                A
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#dc2626',
                  letterSpacing: '0.1em',
                }}
              >
                FIRST
              </div>
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            AMERICA FIRST
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)',
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
