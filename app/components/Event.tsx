/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import type { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { Form, NavLink } from "@remix-run/react";
import { Modal, ModalHeader } from "./Modal";
import { Button } from "./styledParts/Button";
import { Well } from "./styledParts/Well";
import { Center } from "./styledParts/Text";
import { FlexContainer } from "./styledParts/FlexContainer";

const StyledEvent = styled(Well)`
  position: relative;

  .timeDetails {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;

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

const StyledEventActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-left: 10px;
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
  skipDate = false,
}: {
  event: calendar_v3.Schema$Event;
  expanded?: boolean;
  skipDate?: boolean;
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
          <Center>
            Are you sure you want to
            <br />
            delete this event?
          </Center>
          <Form method="post" action={`/calendar/event/${event.id}/delete`}>
            <Button type="submit">Yes</Button>
          </Form>
          <Button onClick={() => setIsDeleteConfirmModalOpen(false)}>No</Button>
        </StyledDeleteConfirmation>
      </Modal>
      <FlexContainer justifyContent="space-between" className="eventHeader">
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
        <StyledEventActions>
          <StyledActionButton href={`/calendar/event/${event.id}/edit`}>
            {<img src="/icons/edit.svg" alt="edit" />}
          </StyledActionButton>
          <StyledActionButton onClick={handleDelete}>
            {<img src="/icons/delete.svg" alt="delete" />}
          </StyledActionButton>
        </StyledEventActions>
      </FlexContainer>
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
