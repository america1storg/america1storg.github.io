import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { sql } from '@vercel/postgres';
import { EmailAdapter } from './email-adapter';

export const authOptions: NextAuthOptions = {
  adapter: EmailAdapter as any,
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
    async jwt({ token, user }) {
      // Add user info to JWT when signing in
      if (user?.email) {
        try {
          const result = await sql`
            SELECT id, email, name, is_super_admin FROM users
            WHERE email = ${user.email}
          `;

          if (result.rows.length > 0) {
            const dbUser = result.rows[0];
            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.isSuperAdmin = dbUser.is_super_admin;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (token && session.user) {
        session.user.id = token.id as number;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt', // Use JWT instead of database sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
};
