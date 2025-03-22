import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: AuthOptions = {
  providers: [
    // GitHub OAuth provider
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
}

// This creates a handler for GET and POST requests to /api/auth/...
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };