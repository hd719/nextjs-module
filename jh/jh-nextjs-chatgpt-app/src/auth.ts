import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthConfig = {
  callbacks: {
    async signIn({ profile }) {
      // Change this to your username
      return profile?.login === "hd719";
    },

  },
  providers: [
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.NEXTAUTH_GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
