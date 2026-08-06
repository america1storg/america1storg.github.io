import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      name?: string | null;
      isSuperAdmin: boolean;
      role: 'god_mode' | 'king' | 'captain' | 'soldier';
    };
  }

  interface User {
    id: number;
    email: string;
    name?: string | null;
    isSuperAdmin: boolean;
    role: 'god_mode' | 'king' | 'captain' | 'soldier';
  }
}
