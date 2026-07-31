import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('Altering cover_image column to TEXT...');

    await sql`
      ALTER TABLE articles
      ALTER COLUMN cover_image TYPE TEXT
    `;

    console.log('✓ Successfully changed cover_image from VARCHAR(1000) to TEXT');

    return NextResponse.json({
      success: true,
      message: 'Successfully changed cover_image column to TEXT. Base64 images will now be saved properly.',
    });
  } catch (error) {
    console.error('Error altering column:', error);
    return NextResponse.json(
      { error: 'Failed to migrate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
