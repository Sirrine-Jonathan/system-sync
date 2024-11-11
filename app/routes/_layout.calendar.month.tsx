import type { LoaderFunction } from "@remix-run/node";
import { google, calendar_v3 } from "googleapis";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { SignInButton } from "~app/components/SignInButton";
import { authenticator, oauth2Client } from "~app/services/auth.server";

export const handle = {
  title: "Calendar | Month",
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs): Promise<calendar_v3.Schema$Event[] | undefined> => {
  console.log("authenticating");
  authenticator.authenticate("google", request);
  authenticator.isAuthenticated(request);
  // Initialize Google Calendar API client
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Fetch primary calendar events
  const response = await calendar.events.list({
    calendarId: "primary",
    // start of current month
    timeMin: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString(),
    // end of current month
    timeMax: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items; // These are the user’s calendar events
};
export default function Calendar() {
  const events = useLoaderData<GoogleApis.Calendar_v3.Schema.Event[]>();
  console.log({ events });
  return (
    <div>
      {events &&
        events.map((event) => (
          <div key={event.id}>
            <h2>{event.summary}</h2>
            <p>{event.start?.dateTime}</p>
            <p>{event.end?.dateTime}</p>
          </div>
        ))}
      <Outlet />
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    error.message === "User not authenticated"
  ) {
    return (
      <section>
        <SignInButton type="Google" />
      </section>
    );
  }
  return (
    <section>
      <h1>Error</h1>
      <p>Something went wrong</p>
    </section>
  );
};
