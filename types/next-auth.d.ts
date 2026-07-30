import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      name?: string | null;
      isSuperAdmin: boolean;
    };
  }

  interface User {
    id: number;
    email: string;
    name?: string | null;
    isSuperAdmin: boolean;
  }
}
