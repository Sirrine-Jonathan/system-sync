import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { SignInButton } from "~/components/SignInButton";
import { Event } from "~/components/Event";
import { getEvents } from "~/services/calendar.server";
import styled from "@emotion/styled";

export const handle = {
  title: "Calendar | Month",
};

const StyledCalendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1em;

  .event.mon {
  }

  .event.tues {
  }
`;

export const loader: LoaderFunction = async ({
  request,
}): Promise<calendar_v3.Schema$Event[] | undefined> => {
  return getEvents(request, {
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
};
export default function Calendar() {
  const events = useLoaderData<GoogleApis.Calendar_v3.Schema.Event[]>();
  return (
    <div>
      <StyledCalendar>
        {events &&
          events.map((event) => <Event key={event.id} event={event} />)}
      </StyledCalendar>
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
