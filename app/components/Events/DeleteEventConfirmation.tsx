import { Form } from "@remix-run/react";
import { Modal, ModalHeader } from "../Modal";
import { StyledButton } from "../styledParts/Buttons";
import { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { Center } from "../styledParts/Text";

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
export const DeleteEventConfirmation = ({
  isOpen,
  setIsOpen,
  event,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  event: calendar_v3.Schema$Event;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="deleteEventConfirmation"
    >
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
          <StyledButton type="submit">Yes</StyledButton>
        </Form>
        <StyledButton onClick={() => setIsOpen(false)}>No</StyledButton>
      </StyledDeleteConfirmation>
    </Modal>
  );
};
