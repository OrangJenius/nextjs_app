import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        admin: { label: 'Admin', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Login lewat /admin/login hanya boleh untuk akun admin
        if (credentials.admin === 'true' && user.role !== 'admin') return null;

        const authUser = {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
        return authUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as typeof session.user & { id: string; role: string };
        u.id = token.id as string;
        u.role = (token.role as string) ?? 'user';
      }
      return session;
    },
  },
};