import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import {
  Outlet,
  useLoaderData,
  useRouteError,
  useParams,
  useNavigate,
  NavLink,
} from "@remix-run/react";
import { SignInButton } from "~/components/SignInButton";
import { Event } from "~/components/Event";
import { getEvents } from "~/services/calendar.server";
import styled from "@emotion/styled";
import { getRangeMinMax, getNextMonth, getPreviousMonth } from "~/utils/time";
import { StyledCalenderHeader } from "~/components/styledParts/CalendarHeader";

export const handle = {
  title: "Calendar | Month",
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<
  | { events: calendar_v3.Schema$Event[]; monthMin: Date; monthMax: Date }
  | undefined
> => {
  const { day, month, year } = params;

  if (!day || !month || !year) {
    return;
  }

  const { monthMin, monthMax } = getRangeMinMax(
    new Date(Number(year), Number(month) - 1, Number(day))
  );

  const events = await getEvents(request, {
    timeMin: monthMin.toISOString(),
    timeMax: monthMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return {
    events,
    monthMin,
    monthMax,
  };
};

const StyledCalendar = styled.div`
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 5px;

    .day {
      a.title {
        display: block;
        color: white;
        text-decoration: none;
        text-align: center;
        margin: 0;
        padding: 10px 0;
        width: 100%;
        font-size: 0.8rem;
        cursor: pointer;

        &:hover {
          background: gold;
          color: black;
        }
      }
    }

    .dayName {
      margin-left: 30px;
      margin-bottom: 30px;
      position: relative;

      // &:after {
      //   content: "";
      //   position: absolute;
      //   border-top: 1px solid #eee;
      //   border-right: 1px solid #eee;
      //   width: calc(100% - 50px);
      //   height: 7px;
      //   top: 50%;
      //   right: 0;
      // }
    }
  }
`;

const StyledCalendarDay = styled.li(
  (props: { gridColumnStart?: number | boolean }) => ({
    background: "rgba(255, 255, 255, 0.1)",
    padding: 2,
    textAlign: "center",
    gridColumnStart: `${props.gridColumnStart || "unset"}`,
  })
);

export default function Calendar() {
  const { events, monthMin, monthMax } = useLoaderData<{
    events: GoogleApis.Calendar_v3.Schema.Event[];
    monthMin: Date;
    monthMax: Date;
  }>();

  const navigate = useNavigate();

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

  // number of days in this month
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  // first day of this month
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  // day of the week of the first day of this month
  const dayOfWeek = firstDay.getDay();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDayContents = (date: Date) => {
    const eventsForDay = events.filter((event) => {
      const eventStart = new Date(event.start?.dateTime || "");
      const eventEnd = new Date(event.end?.dateTime || "");
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear() &&
        eventEnd.getDate() === date.getDate() &&
        eventEnd.getMonth() === date.getMonth() &&
        eventEnd.getFullYear() === date.getFullYear()
      );
    });

    return (
      <>
        {eventsForDay.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </>
    );
  };

  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextMonth = getNextMonth(date);
    navigate(
      `/calendar/month/${nextMonth.getDate()}/${nextMonth.getMonth() + 2}/${nextMonth.getFullYear()}`
    );
  };

  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    const previousMonth = getPreviousMonth(date);
    navigate(
      `/calendar/month/${previousMonth.getDate()}/${previousMonth.getMonth()}/${previousMonth.getFullYear()}`
    );
  };

  return (
    <div>
      <StyledCalenderHeader>
        <button onClick={goToPreviousMonth}>
          <img src="/icons/arrow-left.svg" alt="" />
        </button>
        <h1>{calendarTitle}</h1>
        <button onClick={goToNextMonth} aria-label="Next month">
          <img src="/icons/arrow-right.svg" alt="" />
        </button>
      </StyledCalenderHeader>

      <StyledCalendar>
        <ol className="calendar">
          {
            // print out day names
            dayNames.map((dayName) => (
              <li className="dayName" key={dayName}>
                {dayName}
              </li>
            ))
          }
          {
            // print out list items for each day of the month
            [...Array(daysInMonth).keys()].map((day) => {
              const thisSquaresDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                day + 1
              );

              const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
              const months = [
                "jan",
                "feb",
                "mar",
                "apr",
                "may",
                "jun",
                "jul",
                "aug",
                "sep",
                "oct",
                "nov",
                "dec",
              ];
              const startDay = days[thisSquaresDate.getDay()];
              const startMonth = months[thisSquaresDate.getMonth()];
              return (
                <StyledCalendarDay
                  key={thisSquaresDate.toISOString()}
                  className={day === 0 ? "first-day day" : "day"}
                  gridColumnStart={day === 0 && dayOfWeek + 1}
                >
                  <NavLink
                    className="title"
                    to={`/calendar/day/${thisSquaresDate.getDate()}/${thisSquaresDate.getMonth() + 1}/${thisSquaresDate.getFullYear()}`}
                  >
                    {[
                      startDay?.toLocaleUpperCase(),
                      startMonth?.toLocaleUpperCase(),
                      thisSquaresDate.getDate(),
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </NavLink>
                  {getDayContents(thisSquaresDate)}
                </StyledCalendarDay>
              );
            })
          }
        </ol>
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
