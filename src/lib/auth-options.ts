import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: { scope: "read:user user:email repo" },
      },
    }),
  ],
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development"
      ? "cloudship-local-development-only-secret"
      : undefined),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) token.githubAccessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
};

export function isGitHubOAuthConfigured() {
  return Boolean(
    process.env.NEXTAUTH_SECRET &&
    process.env.GITHUB_ID &&
    process.env.GITHUB_SECRET,
  );
}