import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Event } from "~/components/Events/Event";
import { getEvents } from "~/services/event.server";
import styled from "@emotion/styled";
import { getRangeMinMax } from "~/utils/time";
import { StyledCalenderHeader } from "~/components/styledParts/CalendarHeader";
import { DesktopOnly } from "~/components/styledParts/DesktopOnly";

export const handle = {
  title: "Calendar | Week",
};

const StyledWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem
  max-width: 100%;
  overflow: auto;
  padding-bottom: 1rem
`;

const StyledDay = styled.div<{ gridColumnStart?: number | boolean }>`
  padding: 2;
  grid-column-start: ${(props) => props.gridColumnStart};
`;

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<
  | {
      events: calendar_v3.Schema$Event[] | undefined;
      weekMin: Date;
      weekMax: Date;
    }
  | undefined
> => {
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

  const goToNextWeek = () => {};

  const goToPreviousWeek = () => {};

  const calendarTitle = `${weekMin.toLocaleDateString()} - ${weekMax.toLocaleDateString()}`;

  return (
    <div>
      <StyledCalenderHeader>
        <button onClick={goToPreviousWeek}>
          <img src="/icons/arrow-left.svg" alt="previous" />
        </button>
        <h1>{calendarTitle}</h1>
        <button onClick={goToNextWeek}>
          <img src="/icons/arrow-right.svg" alt="previous" />
        </button>
      </StyledCalenderHeader>
      <StyledWeek>
        {Array.from({ length: 7 }, (_, i) => (
          <StyledDay key={i} gridColumnStart={i + 1}>
            <DesktopOnly>
              <span>{daysOfTheWeek[i]}</span>
              {" | "}
            </DesktopOnly>
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
