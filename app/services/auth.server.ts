import { Authenticator } from "remix-auth";
import { GoogleStrategy, GoogleProfile } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import { google } from "googleapis";

export type User = GoogleProfile & {
  accessToken: string;
};

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "user",
  sessionErrorKey: "error",
});

export const oauth2Client = new google.auth.OAuth2();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:
      process.env.NODE_ENV === "production"
        ? "https://become-you.netlify.app/auth/callback"
        : "http://localhost:5173/auth/callback",
    scope: "profile email https://www.googleapis.com/auth/calendar",
    includeGrantedScopes: true,
  },
  async ({ profile, accessToken }) => {
    return { ...profile, accessToken } as User;
  }
);

authenticator.use(googleStrategy);
