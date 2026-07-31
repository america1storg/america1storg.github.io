import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { sql } from '@vercel/postgres';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from 'pg';

// Create Postgres connection pool for Neon
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool) as any,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // For development, we'll use a custom sendVerificationRequest
      // that just logs the magic link to console
      ...(process.env.NODE_ENV === 'development' && {
        sendVerificationRequest: async ({ identifier, url }) => {
          console.log('\n=================================');
          console.log('🔐 MAGIC LINK FOR:', identifier);
          console.log('🔗 LINK:', url);
          console.log('=================================\n');
        },
      }),
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      // Check if user is in our admins table
      try {
        const result = await sql`
          SELECT id, email, is_super_admin FROM users
          WHERE email = ${user.email}
        `;

        // Only allow sign in if user exists in admins table
        return result.rows.length > 0;
      } catch (error) {
        console.error('Error checking user permissions:', error);
        return false;
      }
    },
    async session({ session, user }) {
      // user object from adapter contains database user info
      if (session?.user && user?.email) {
        try {
          const result = await sql`
            SELECT id, email, name, is_super_admin FROM users
            WHERE email = ${user.email}
          `;

          if (result.rows.length > 0) {
            const dbUser = result.rows[0];
            session.user.id = dbUser.id;
            session.user.email = dbUser.email;
            session.user.name = dbUser.name || null;
            session.user.isSuperAdmin = dbUser.is_super_admin;
          }
        } catch (error) {
          console.error('Error fetching user session data:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
