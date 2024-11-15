import type { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";

const StyledEvent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 1em;

  .timeDetails {
    min-height: 40px;
    border-bottom: 1px solid white;

    p {
      margin: 2px 0;

      &.date,
      &.time {
        font-size: 0.8rem;
      }
    }
  }

  h2 {
    font-size: 1.2rem;
    margin: 15px 0 0;
  }
`;

export const Event = ({ event }: { event: calendar_v3.Schema$Event }) => {
  const start = new Date(event.start?.dateTime || "");
  const end = new Date(event.end?.dateTime || "");

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
  const startDay = days[start.getDay()];
  const startMonth = months[start.getMonth()];
  return (
    <StyledEvent className={`event ${startDay}`}>
      <div className="timeDetails">
        <p className="date">
          {[
            startDay?.toLocaleUpperCase(),
            startMonth?.toLocaleUpperCase(),
            start.getDate(),
          ]
            .filter(Boolean)
            .join(" ")}
        </p>
        <p className="time">
          {[start.toLocaleTimeString(), end.toLocaleTimeString()].join(" - ")}
        </p>
      </div>
      <h2>{event.summary}</h2>
    </StyledEvent>
  );
};
