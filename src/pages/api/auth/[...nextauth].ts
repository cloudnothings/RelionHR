import NextAuth, { type NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { env } from "../../../env/server.mjs";
async function refreshAccessToken(token: any) {
  try {
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `client_id=${env.AZURE_CLIENT_ID}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=${env.AZURE_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${token.refreshToken}`,
    });
    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  // Include user.id on session
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires:
            Date.now() + (account.expires_at as number) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.accessToken !== undefined) {
        session.accessToken = token.accessToken as string;
      }
      if (token.user !== undefined) {
        session.user = token.user as any;
      }
      session.error = (token.error as string) ?? null;
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    AzureADProvider({
      clientId: env.AZURE_CLIENT_ID,
      clientSecret: env.AZURE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email offline_access https://graph.microsoft.com/.default",
        },
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
