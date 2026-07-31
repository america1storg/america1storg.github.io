import { sql } from '@vercel/postgres';
import type { Adapter, AdapterUser } from 'next-auth/adapters';

export function EmailAdapter(): Adapter {
  return {
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
        email: user.email!,
        name: user.name || null,
        emailVerified: null,
        image: null,
      } as AdapterUser;
    },

    async createUser(user: Omit<AdapterUser, 'id'>) {
      // For email login, user should already exist in our users table
      const existing = await sql`
        SELECT id, email, name FROM users WHERE email = ${user.email}
      `;

      if (existing.rows.length > 0) {
        const dbUser = existing.rows[0];
        return {
          id: dbUser.id.toString(),
          email: dbUser.email!,
          name: dbUser.name || null,
          emailVerified: new Date(),
          image: null,
        } as AdapterUser;
      }

      // This shouldn't happen for admin users
      throw new Error('User not authorized');
    },

    async getUser(id: string) {
      const result = await sql`
        SELECT id, email, name FROM users WHERE id = ${parseInt(id)}
      `;

      if (result.rows.length === 0) return null;

      const user = result.rows[0];
      return {
        id: user.id.toString(),
        email: user.email!,
        name: user.name || null,
        emailVerified: null,
        image: null,
      } as AdapterUser;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
      const result = await sql`
        UPDATE users
        SET name = ${user.name || null}
        WHERE id = ${parseInt(user.id)}
        RETURNING id, email, name
      `;

      if (result.rows.length === 0) throw new Error('User not found');

      const dbUser = result.rows[0];
      return {
        id: dbUser.id.toString(),
        email: dbUser.email!,
        name: dbUser.name || null,
        emailVerified: user.emailVerified || null,
        image: user.image || null,
      } as AdapterUser;
    },

    async linkAccount() {
      // Not used for email provider
      return null as any;
    },

    async createSession() {
      // Not used with JWT strategy
      return null as any;
    },

    async getSessionAndUser() {
      // Not used with JWT strategy
      return null as any;
    },

    async updateSession() {
      // Not used with JWT strategy
      return null as any;
    },

    async deleteSession() {
      // Not used with JWT strategy
      return;
    },

    async unlinkAccount() {
      // Not used for email provider
      return;
    },

    async getUserByAccount() {
      // Not used for email provider
      return null;
    },

    async deleteUser() {
      // Not implemented
      return;
    },
  };
}
