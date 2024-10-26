import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const googleAuthURL = new URL("https://accounts.google.com/o/oauth2/auth");
  googleAuthURL.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  googleAuthURL.searchParams.set("redirect_uri", "http://localhost:5173/auth/callback");
  googleAuthURL.searchParams.set("response_type", "code");
  googleAuthURL.searchParams.set("scope", "https://www.googleapis.com/auth/calendar");
  googleAuthURL.searchParams.set("prompt", "select_account");

  // Redirect the user to the Google OAuth URL
  return redirect(googleAuthURL.toString());
};