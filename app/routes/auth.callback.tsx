// app/routes/auth.callback.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
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
  oauth2Client.setCredentials(tokens);

  // Save tokens to session or user storage as needed (for now, just redirect)

  // Redirect the user to the home page
  return redirect("/");
};