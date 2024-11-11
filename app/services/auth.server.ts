import { Authenticator } from "remix-auth";
import { GoogleStrategy, GoogleProfile } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import { findOrCreateUser } from "./user.server";
import { google } from "googleapis";

type User = GoogleProfile;

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "user",
  sessionErrorKey: "error",
});

export const oauth2Client = new google.auth.OAuth2();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:5173/auth/callback",
    scope: "profile email https://www.googleapis.com/auth/calendar",
    includeGrantedScopes: true,
  },
  async ({ accessToken, profile }) => {
    console.log("setting access token");
    oauth2Client.setCredentials({ access_token: accessToken });
    try {
      await findOrCreateUser({
        ...profile,
        email: profile.emails?.[0].value,
        provider: "google",
        preferences: {},
        tasks: [],
      });
    } catch (error) {
      console.log({ error });
    }
    return profile as User;
  }
);

authenticator.use(googleStrategy);
