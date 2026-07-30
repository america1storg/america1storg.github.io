import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { sql } from '@vercel/postgres';

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
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
    async signIn({ user, account, profile, email: emailData }) {
      if (!user.email) return false;

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
    async session({ session, token }) {
      if (session.user && token.email) {
        // Add user data to session
        try {
          const result = await sql`
            SELECT id, email, name, is_super_admin FROM users
            WHERE email = ${token.email}
          `;

          if (result.rows.length > 0) {
            const user = result.rows[0];
            session.user.id = user.id;
            session.user.email = user.email;
            session.user.name = user.name;
            session.user.isSuperAdmin = user.is_super_admin;
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
