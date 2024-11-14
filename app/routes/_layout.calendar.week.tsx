import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Event } from "~/components/Event";
import { getEvents } from "~/services/calendar.server";
import styled from "@emotion/styled";

export const handle = {
  title: "Calendar | Week",
};

const StyledWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1em;
`;

export const loader: LoaderFunction = async ({
  request,
}): Promise<calendar_v3.Schema$Event[] | undefined> => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date();
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  return getEvents(request, {
    timeMin: startOfWeek.toISOString(),
    timeMax: endOfWeek.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
};
export default function Calendar() {
  const events = useLoaderData<calendar_v3.Schema$Event[] | undefined>();
  return (
    <div>
      <StyledWeek>
        {events &&
          events.map((event) => <Event key={event.id} event={event} />)}
      </StyledWeek>
      <Outlet />
    </div>
  );
}
