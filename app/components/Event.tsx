/// <reference types="vite-plugin-svgr/client" />

import type { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { NavLink } from "@remix-run/react";

const StyledEvent = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 1rem;

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

    a {
      color: white;

      &:hover {
        color: gold;
      }
    }
  }
`;

const StyledDetails = styled.div`
  margin-top: 1rem;
  a {
    color: white;
    word-break: break-all;

    &:hover {
      color: gold;
    }

    img {
      margin-left: 0.5rem;
      width: 1rem;
    }
  }
`;

const StyledEditButton = styled.a`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 1em;
  }
`;

export const Event = ({
  event,
  expanded,
}: {
  event: calendar_v3.Schema$Event;
  expanded?: boolean;
}) => {
  console.log({ event });

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
      <StyledEditButton href={`/calendar/event/${event.id}/edit`}>
        {<img src="/icons/edit.svg" alt="edit" />}
      </StyledEditButton>
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
      <h2>
        <NavLink to={`/calendar/event/${event.id}`}>{event.summary}</NavLink>
      </h2>
      {expanded && (
        <>
          <StyledDetails
            dangerouslySetInnerHTML={{ __html: event.description || "" }}
          />
          <StyledDetails>
            {event.htmlLink && (
              <a href={event.htmlLink}>
                View on Google Calendar{" "}
                <img src="/icons/external-link.svg" alt="" />
              </a>
            )}
          </StyledDetails>
        </>
      )}
    </StyledEvent>
  );
};
