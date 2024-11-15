import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import {
  Outlet,
  useLoaderData,
  useParams,
  useNavigate,
} from "@remix-run/react";
import { Event } from "~/components/Event";
import { getEvents } from "~/services/calendar.server";
import { getRangeMinMax, getPreviousDay, getNextDay } from "~/utils/time";
import { StyledCalenderHeader } from "~/components/styledParts/CalendarHeader";

export const handle = {
  title: "Calendar | Day",
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<
  { events: calendar_v3.Schema$Event[]; dayMin: Date; dayMax: Date } | undefined
> => {
  const { day, month, year } = params;

  if (!day || !month || !year) {
    return;
  }

  const { dayMin, dayMax } = getRangeMinMax(
    new Date(Number(year), Number(month) - 1, Number(day))
  );

  const events = await getEvents(request, {
    timeMin: dayMin.toISOString(),
    timeMax: dayMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return {
    events,
    dayMin,
    dayMax,
  };
};

export default function Calendar() {
  const navigate = useNavigate();
  const { events, dayMin, dayMax } = useLoaderData<
    | { events: calendar_v3.Schema$Event[]; dayMin: Date; dayMax: Date }
    | undefined
  >();
  const { day, month, year } = useParams();
  const tzFromUrl =
    new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "UTC"
    ).get("tz") || "UTC";

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(parseInt(day!));
  date.setMonth(parseInt(month!) - 1);
  date.setFullYear(parseInt(year!));

  const calendarTitle = new Intl.DateTimeFormat("en-US", {
    timeZone: tzFromUrl,
    dateStyle: "full",
  }).format(date);

  const goToPreviousDay = (e: React.MouseEvent) => {
    e.preventDefault();
    const previousDay = getPreviousDay(date);
    navigate(
      `/calendar/day/${previousDay.getDate()}/${previousDay.getMonth()}/${previousDay.getFullYear()}`
    );
  };

  const goToNextDay = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextDay = getNextDay(date);
    navigate(
      `/calendar/day/${nextDay.getDate()}/${nextDay.getMonth() + 1}/${nextDay.getFullYear()}`
    );
  };

  return (
    <div>
      <StyledCalenderHeader>
        <button onClick={goToPreviousDay}>
          <img src="/icons/arrow-left.svg" alt="previous" />
        </button>
        <h1>{calendarTitle}</h1>
        <button onClick={goToNextDay}>
          <img src="/icons/arrow-right.svg" alt="previous" />
        </button>
      </StyledCalenderHeader>
      {events && events.map((event) => <Event key={event.id} event={event} />)}
      <Outlet />
    </div>
  );
}
