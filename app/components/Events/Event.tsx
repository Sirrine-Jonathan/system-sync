/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import type { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { NavLink, useNavigate } from "@remix-run/react";
import { Well } from "../styledParts/Well";
import { FlexContainer } from "../styledParts/FlexContainer";
import {
  Callout,
  CalloutContent,
  CalloutTrigger,
  CalloutAction,
} from "../Callout";
import { DeleteEventConfirmation } from "./DeleteEventConfirmation";

const StyledEvent = styled(Well)`
  position: relative;

  .summary {
    display: block;
    font-size: 0.8rem;
    color: gold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 10vw;
  }

  .timeDetails {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    margin-right: 1.5rem;
    margin-bottom: 0.5rem;

    p {
      margin: 0;

      &.date,
      &.time {
        font-size: 0.6rem;
      }
    }
  }

  h2 {
    font-size: 1.2rem;
    margin: 15px 0 0;
    text-align: center;

    a {
      color: white;
      text-decoration: none;
      color: gold;
    }
  }

  .eventHeader {
    border-bottom: 1px solid white;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }

  .callout {
    position: absolute;
    top: 5px;
    right: 5px;
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

export const Event = ({
  event,
  expanded = false,
  skipDate = false,
}: {
  event: calendar_v3.Schema$Event;
  expanded?: boolean;
  skipDate?: boolean;
}) => {
  const navigate = useNavigate();
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  let start = new Date(event.start?.dateTime || "");
  let end = new Date(event.end?.dateTime || "");

  if (start.toString() === "Invalid Date") {
    start = new Date(event.start?.date || "");
  }
  if (end.toString() === "Invalid Date") {
    end = new Date(event.end?.date || "");
  }

  const isAllDay = start.toLocaleDateString() === end.toLocaleDateString();

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
      <DeleteEventConfirmation
        isOpen={isDeleteConfirmModalOpen}
        setIsOpen={setIsDeleteConfirmModalOpen}
        event={event}
      />
      <FlexContainer
        justifyContent="space-between"
        alignItems="center"
        className="eventHeader"
      >
        <div className="timeDetails">
          {!skipDate && (
            <p className="date">
              {[
                startDay?.toLocaleUpperCase(),
                startMonth?.toLocaleUpperCase(),
                start.getDate(),
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
          )}

          <p className="time">
            {isAllDay
              ? [start.toLocaleTimeString(), end.toLocaleTimeString()].join(
                  " - "
                )
              : "All day"}
          </p>
        </div>
        <Callout>
          <CalloutTrigger>
            <img src="/icons/menu.svg" alt="" />
          </CalloutTrigger>
          <CalloutContent preferredDirection="bottom">
            <CalloutAction onClick={() => setIsDeleteConfirmModalOpen(true)}>
              <img src="/icons/delete.svg" alt="" />
              Delete
            </CalloutAction>
            <CalloutAction onClick={() => navigate(`/event/${event.id}/edit`)}>
              <img src="/icons/edit.svg" alt="" />
              Edit
            </CalloutAction>
          </CalloutContent>
        </Callout>
      </FlexContainer>
      <NavLink to={`/event/${event.id}`} className="summary">
        {event.summary}
      </NavLink>
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
