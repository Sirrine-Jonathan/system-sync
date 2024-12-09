import { Authenticator } from "remix-auth";
import { GoogleStrategy, GoogleProfile } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import { findOrCreateUser } from "./user.server";

export type GoogleUser = GoogleProfile & {
  tokens: {
    accessToken: string;
    refreshToken: string | undefined;
  };
  timeZone?: string;
};

export const authenticator = new Authenticator<GoogleUser>(sessionStorage, {
  sessionKey: "user",
  sessionErrorKey: "error",
});

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:
      process.env.NODE_ENV === "production"
        ? "https://system-sync.netlify.app/auth/callback"
        : "http://localhost:5173/auth/callback",
    scope: "profile email https://www.googleapis.com/auth/calendar",
    includeGrantedScopes: true,
  },
  async ({ profile, accessToken, refreshToken }) => {
    const dbUser = await findOrCreateUser({
      email: profile.emails?.[0]?.value,
      displayName: profile.displayName,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    const user: GoogleUser = {
      ...profile,
      tokens: {
        accessToken,
        refreshToken,
      },
    };

    return user;
  }
);

authenticator.use(googleStrategy);
