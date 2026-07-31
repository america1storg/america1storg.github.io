import { sql } from '@vercel/postgres';

export const EmailAdapter = {
  async createVerificationToken(params: { identifier: string; expires: Date; token: string }) {
    const { identifier, expires, token } = params;
    await sql`
      INSERT INTO verification_token (identifier, expires, token)
      VALUES (${identifier}, ${expires.toISOString()}, ${token})
    `;
    return { identifier, expires, token };
  },

  async useVerificationToken(params: { identifier: string; token: string }) {
    try {
      const result = await sql`
        DELETE FROM verification_token
        WHERE identifier = ${params.identifier} AND token = ${params.token}
        RETURNING identifier, expires, token
      `;

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        identifier: row.identifier,
        expires: new Date(row.expires),
        token: row.token,
      };
    } catch (error) {
      console.error('Error using verification token:', error);
      return null;
    }
  },

  async getUserByEmail(email: string) {
    const result = await sql`
      SELECT id, email, name FROM users WHERE email = ${email}
    `;

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      emailVerified: null,
    };
  },
};
