import { Authenticator } from "remix-auth";
import { GoogleStrategy, GoogleProfile } from "remix-auth-google";
import { sessionStorage } from "./session.server";
import { findOrCreateUser } from "./user.server";
import { mongoose } from "./db.server";

export type GoogleUser = GoogleProfile & {
  _id: mongoose.Types.ObjectId;
  tokens: {
    accessToken: string | null | undefined;
    refreshToken: string | null | undefined;
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
    scope:
      "profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks",
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
      _id: dbUser._id,
      ...profile,
      tokens: {
        accessToken,
        refreshToken,
      },
    };

    console.log({ user });

    return user;
  }
);

authenticator.use(googleStrategy);
