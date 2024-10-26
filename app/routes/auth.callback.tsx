// app/routes/auth.callback.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/app/utils/session.server";
import { google } from "googleapis";

// Handle the callback from Google OAuth
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("Authorization code missing");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5173/auth/callback"
  );

  // Exchange the authorization code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  const session = await getSession(request);
  session.set("accessToken", tokens.access_token);
  session.set("refreshToken", tokens.refresh_token);

  // Redirect the user to the home page
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};