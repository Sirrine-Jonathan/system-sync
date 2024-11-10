import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "./session.server";

type User = GoogleProfile & { id: string };

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5173/auth/callback",
      scope: "profile email",
    },
    async ({ profile }) => {
      console.log({ profile });
      return profile as User;
    }
  )
);
