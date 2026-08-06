import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET() {
  // Read logo from public directory
  const logoPath = join(process.cwd(), 'public', 'logo-full-transparent.png');
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = logoBuffer.toString('base64');

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
        <img
          src={`data:image/png;base64,${logoBase64}`}
          width="500"
          height="500"
          alt="America First"
        />
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            marginTop: '20px',
          }}
        >
          Civic Education & Advocacy
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
