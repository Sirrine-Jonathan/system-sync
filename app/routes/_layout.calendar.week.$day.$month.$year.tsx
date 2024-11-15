import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Event } from "~/components/Event";
import { getEvents } from "~/services/calendar.server";
import styled from "@emotion/styled";
import { getRangeMinMax } from "~/utils/time";

export const handle = {
  title: "Calendar | Week",
};

const StyledWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1em;
`;

const StyledDay = styled.div(
  (props: {
    gridColumnStart?: number | boolean;
    children?: React.ReactNode;
  }) => ({
    padding: 2,
    gridColumnStart: props.gridColumnStart,
  })
);

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<calendar_v3.Schema$Event[] | undefined> => {
  const { day, month, year } = params;

  if (!day || !month || !year) {
    return;
  }

  const { weekMin, weekMax } = getRangeMinMax(
    new Date(`${year}-${month}-${day}`)
  );
  const events = await getEvents(request, {
    timeMin: weekMin.toISOString(),
    timeMax: weekMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return {
    events,
    weekMin,
    weekMax,
  };
};

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const { events, weekMin, weekMax } = useLoaderData<{
    events: calendar_v3.Schema$Event[];
    weekMin: Date;
    weekMax: Date;
  }>();

  const eventsWithStartDate = events.filter((event) => {
    return event.start?.dateTime;
  });

  return (
    <div>
      <StyledWeek>
        {Array.from({ length: 7 }, (_, i) => (
          <StyledDay key={i} gridColumnStart={i + 1}>
            <span>{daysOfTheWeek[i]}</span>
            {" | "}
            <span>{weekMin.getDate() + i}</span>
          </StyledDay>
        ))}
        {eventsWithStartDate &&
          eventsWithStartDate.map((event) => (
            <StyledDay
              key={event.id}
              gridColumnStart={
                new Date(event.start?.dateTime || "").getDay() + 1
              }
            >
              <Event key={event.id} event={event} />
            </StyledDay>
          ))}
      </StyledWeek>
      <Outlet />
    </div>
  );
}
