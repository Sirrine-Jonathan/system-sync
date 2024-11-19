/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import type { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { Form, NavLink } from "@remix-run/react";
import { Modal, ModalHeader } from "./Modal";
import { Button } from "./styledParts/Button";

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
        color: crimson;
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
      color: crimson;
    }

    img {
      margin-left: 0.5rem;
      width: 1rem;
    }
  }
`;

const StyledEventActions = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 25px;
  width: 100%;
  justify-content: flex-end;
  padding: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-sizing: border-box;
`;

const StyledActionButton = styled.a`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  border-radius: 60px;

  img {
    width: 1.2em;
  }

  &:hover {
    background: #333;
  }
`;

const StyledDeleteConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const Event = ({
  event,
  expanded,
}: {
  event: calendar_v3.Schema$Event;
  expanded?: boolean;
}) => {
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

  console.log({ start, end });

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

  const handleDelete = () => {
    setIsDeleteConfirmModalOpen(true);
  };

  return (
    <StyledEvent className={`event ${startDay}`}>
      <Modal isOpen={isDeleteConfirmModalOpen}>
        <ModalHeader>
          <div className="modalTitle">Delete Event</div>
          <div className="modalSubtitle">{event.summary}</div>
        </ModalHeader>
        <StyledDeleteConfirmation>
          <div>Are you sure you want to delete this event?</div>
          <Form method="post" action={`/calendar/event/${event.id}/delete`}>
            <Button type="submit">Yes</Button>
          </Form>
          <Button onClick={() => setIsDeleteConfirmModalOpen(false)}>No</Button>
        </StyledDeleteConfirmation>
      </Modal>
      <StyledEventActions>
        <StyledActionButton href={`/calendar/event/${event.id}/edit`}>
          {<img src="/icons/edit.svg" alt="edit" />}
        </StyledActionButton>
        <StyledActionButton onClick={handleDelete}>
          {<img src="/icons/delete.svg" alt="delete" />}
        </StyledActionButton>
      </StyledEventActions>
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
          {isAllDay
            ? [start.toLocaleTimeString(), end.toLocaleTimeString()].join(" - ")
            : "All day"}
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
