import { useCallback } from "react";
import { Modal, ModalHeader } from "../Modal";
import { useFetcher } from "@remix-run/react";
import styled from "@emotion/styled";
import { StyledForm } from "../styledParts/Form";
import { useTimezone } from "~/hooks/useTimezone";
import { FlexContainer } from "../styledParts/FlexContainer";
import { StyledButton } from "../styledParts/Buttons";

const StyledCreateEventForm = styled(StyledForm)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: transparent;
`;

export const CreateEventModal = ({
  isOpen,
  setIsOpen,
  startDate,
  setStartDate,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  startDate: Date;
  setStartDate: (startDate: Date) => void;
}) => {
  const { tzFromUrl } = useTimezone();
  const fetcher = useFetcher();
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setStartDate(date);
  };

  const getEndDefault = useCallback(() => {
    const end = new Date(startDate);
    const minutes = 30;
    end.setMinutes(end.getMinutes() + minutes);
    return end.toISOString().slice(0, 16);
  }, [startDate]);

  const handleCreateEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher.submit(e.currentTarget, {
      method: "post",
      action: `/calendar/event/create?tz=${tzFromUrl}`,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader>
        <div className="modalTitle">Create Event</div>
        <div className="modalSubtitle">Enter event details</div>
      </ModalHeader>
      <StyledCreateEventForm state={fetcher.state}>
        <fetcher.Form method="post" onSubmit={handleCreateEventSubmit}>
          <label htmlFor="summary">
            Summary
            <textarea
              id="summary"
              name="summary"
              placeholder="Summary"
              required
            />
          </label>
          <label htmlFor="description">
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Description"
            />
          </label>
          <label htmlFor="startDateTime">
            Start Time
            <input
              type="datetime-local"
              id="startDateTime"
              name="startDateTime"
              defaultValue={startDate.toISOString().slice(0, 16)}
              onChange={handleStartChange}
              required
            />
          </label>
          <label htmlFor="endDateTime">
            End Time
            <input
              type="datetime-local"
              id="endDateTime"
              name="endDateTime"
              defaultValue={getEndDefault()}
              required
            />
          </label>
          <FlexContainer justifyContent="flex-end" gap="1em">
            <StyledButton type="submit">Create</StyledButton>
            <StyledButton type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </StyledButton>
          </FlexContainer>
        </fetcher.Form>
      </StyledCreateEventForm>
    </Modal>
  );
};
