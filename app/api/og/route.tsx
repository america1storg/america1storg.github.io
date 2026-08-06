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
          background: 'linear-gradient(135deg, #0a1931 0%, #1e3a8a 50%, #2563eb 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '80px',
            borderRadius: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            width: '100%',
          }}
        >
          {/* USA Flag Colors Accent */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            <div style={{ width: '80px', height: '8px', background: '#dc2626', borderRadius: '4px' }} />
            <div style={{ width: '80px', height: '8px', background: '#ffffff', borderRadius: '4px', border: '2px solid #e5e7eb' }} />
            <div style={{ width: '80px', height: '8px', background: '#1e40af', borderRadius: '4px' }} />
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 96,
              fontWeight: 900,
              margin: 0,
              marginBottom: '24px',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #0a1931 0%, #1e3a8a 50%, #2563eb 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            America First
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: '#475569',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            Civic Education & Advocacy
          </p>

          {/* Bottom Accent */}
          <div
            style={{
              marginTop: '40px',
              width: '300px',
              height: '4px',
              background: 'linear-gradient(90deg, #dc2626 0%, #1e40af 100%)',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
