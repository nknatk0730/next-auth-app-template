import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const config: NextAuthConfig = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },

  providers: [GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  })],
  callbacks: {
    authorized: ({ request, auth }) => {
      try {
        const pathname = request.nextUrl.pathname;
        if (pathname === '/protected-page') {
          return !!auth;
        }

        return true;
      } catch (error) {
        console.log(error);
      }
    },
    jwt: ({ token, trigger, session }) => {
      if (trigger === 'update') {
        token.name = session.user.name;
      }
      return token;
    }
  },
};

const nextAuthResult = NextAuth(config);


export const auth = nextAuthResult.auth;
export const handlers = nextAuthResult.handlers;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;