import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        payload: { label: "Payload", type: "text" },
      },
      async authorize(credentials) {
        try {
          const payload = JSON.parse(credentials?.payload || "{}");
          if (!payload?.id || !payload?.email || !payload?.role) return null;
          return payload;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user || null;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-this",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
