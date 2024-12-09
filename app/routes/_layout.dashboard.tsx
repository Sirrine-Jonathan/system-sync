import type { THydratedUserModel } from "~/services/user.server";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { getRangeMinMax } from "~/utils/time";
import { getEvents } from "~/services/event.server";
import { authenticator } from "~/services/auth.server";
import { calendar_v3 } from "googleapis";
import { Event } from "~/components/Event";

export const handle = {
  title: "Dashboard",
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const timezone = url.searchParams.get("tz") || "UTC";
  new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
  }).formatRange(new Date(), new Date());
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { dayMin, dayMax } = getRangeMinMax(
    new Date(Number(year), Number(month) - 1, Number(day))
  );

  const events = await getEvents(request, {
    timeMin: dayMin.toISOString(),
    timeMax: dayMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return events;
};

export default function Dashboard() {
  const user = useOutletContext<THydratedUserModel>();
  const events = useLoaderData<calendar_v3.Schema$Event[]>();


  return (
    <main>
      <section>
        {user && <div>{user.displayName}</div>}
        {user && <div>{user.email}</div>}
        <div>
          <h1>{events.length > 0 ? "You day" : "No events today"}</h1>
          {events.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
