import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Force update God Mode user
    await sql`
      UPDATE users
      SET role = 'god_mode', is_super_admin = TRUE
      WHERE email = 'americafirstusateam@gmail.com'
    `;

    // Check the result
    const result = await sql`
      SELECT email, role, is_super_admin FROM users
      WHERE email = 'americafirstusateam@gmail.com'
    `;

    return NextResponse.json({
      success: true,
      message: 'God Mode user updated successfully. Please sign out and sign in again.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating God Mode user:', error);
    return NextResponse.json(
      { error: 'Failed to update God Mode user', details: error },
      { status: 500 }
    );
  }
}
