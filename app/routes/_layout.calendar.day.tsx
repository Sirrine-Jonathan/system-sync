import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Event } from "~app/components/Event";
import { getEvents } from "~/app/services/calendar.server";

export const handle = {
  title: "Calendar | Day",
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<calendar_v3.Schema$Event[] | undefined> => {
  const startOfCurrentDay = new Date();
  startOfCurrentDay.setHours(0, 0, 0, 0);
  const endOfCurrentDay = new Date();
  endOfCurrentDay.setHours(23, 59, 59, 999);

  return getEvents(request, {
    timeMin: startOfCurrentDay.toISOString(),
    timeMax: endOfCurrentDay.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
};
export default function Calendar() {
  const events = useLoaderData<calendar_v3.Schema$Event[] | undefined>();
  return (
    <div>
      {events && events.map((event) => <Event key={event.id} event={event} />)}
      <Outlet />
    </div>
  );
}
