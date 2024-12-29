import type { LoaderFunction } from "@remix-run/node";
import { calendar_v3 } from "googleapis";
import {
  Outlet,
  useLoaderData,
  useParams,
  useNavigate,
  NavLink,
} from "@remix-run/react";
import { useState } from "react";
import { EventDot } from "~/components/Events/EventDot";
import { Event } from "~/components/Events/Event";
import { getEvents } from "~/services/event.server";
import styled from "@emotion/styled";
import { getRangeMinMax, getNextMonth, getPreviousMonth } from "~/utils/time";
import { StyledCalenderHeader } from "~/components/styledParts/CalendarHeader";
import { useTimezone } from "~/hooks/useTimezone";
import { CreateEventModal } from "~/components/Events/CreateEventModal";
import { useIsMobile } from "~/hooks/useIsMobile";

export const handle = {
  title: "Calendar | Month",
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<
  | {
      events: calendar_v3.Schema$Event[] | undefined;
      monthMin: Date;
      monthMax: Date;
    }
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
    grid-template-columns: repeat(7, minmax(10px, 1fr));
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 3px;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: visible;

    .day {
      a.title {
        display: block;
        color: var(--color-white);
        text-decoration: none;
        text-align: center;
        margin: 0;
        padding: 10px 0;
        width: 100%;
        font-size: 12px;
        cursor: pointer;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;

        &:hover {
          background: var(--accent-color);
          color: var(--color-black);
        }
      }
    }

    .dayName {
      position: relative;
      text-align: center;
      box-sizing: border-box;
    }
  }
`;

const StyledCalendarDay = styled.li<{ gridColumnStart?: number | boolean }>(
  (props) => ({
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "5px",
    paddingBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "center",
    gridColumnStart: `${props.gridColumnStart || "unset"}`,
    position: "relative",
  })
);

const StyledCreateEventButton = styled.button`
  position: absolute;
  bottom: 0;
  padding: 0.5rem;
  border: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 100%;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--accent-color);
  color: var(--color-black);
  cursor: pointer;

  img {
    width: 1rem;
  }
`;

export default function Calendar() {
  const { events } = useLoaderData<{
    events: calendar_v3.Schema$Event[];
    monthMin: Date;
    monthMax: Date;
  }>();

  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(() => new Date());

  const { day, month, year } = useParams();
  const { tzFromUrl } = useTimezone();

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
        {eventsForDay.map((event) =>
          isMobile ? (
            <EventDot key={event.id} event={event} />
          ) : (
            <Event key={event.id} event={event} />
          )
        )}
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
                    {[thisSquaresDate.getDate()].filter(Boolean).join(" ")}
                  </NavLink>
                  {getDayContents(thisSquaresDate)}
                  <StyledCreateEventButton
                    onClick={() => {
                      setIsCreateModalOpen(true);
                      setModalDate(thisSquaresDate);
                    }}
                  >
                    <img src="/icons/add-dark.svg" alt="" />
                  </StyledCreateEventButton>
                </StyledCalendarDay>
              );
            })
          }
        </ol>
      </StyledCalendar>
      <CreateEventModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        startDate={modalDate}
        setStartDate={setModalDate}
      />
      <Outlet />
    </div>
  );
}
