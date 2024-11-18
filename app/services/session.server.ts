import { createCookieSessionStorage, type Session } from "@remix-run/node";
// import { createDatabaseSessionStorage } from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});
/*
export const sessionStorage_database = await createDatabaseSessionStorage({
  cookie: {
    name: "__session",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
  host: "localhost",
  port: 5173,
});
*/

export const getSession = (request: Request) =>
  sessionStorage.getSession(request.headers.get("Cookie"));
export const commitSession = (session: Session) =>
  sessionStorage.commitSession(session);
