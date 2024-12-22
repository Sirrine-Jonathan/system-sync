import { Form } from "@remix-run/react";
import { Modal, ModalHeader } from "../Modal";
import { StyledButton } from "../styledParts/Buttons";
import { Center } from "../styledParts/Text";
import styled from "@emotion/styled";
import { TaskWithListTitle } from "~/services/task.server";

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
export const DeleteTaskConfirmation = ({
  isOpen,
  setIsOpen,
  task,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: TaskWithListTitle;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="deleteTaskConfirmation"
    >
      <ModalHeader>
        <div className="modalTitle">Delete Task</div>
        <div className="modalSubtitle">{task.title}</div>
      </ModalHeader>
      <StyledDeleteConfirmation>
        <Center>
          Are you sure you want to
          <br />
          delete this task?
        </Center>
        <Form method="post" action={`/tasks/${task.id}/delete`}>
          <StyledButton type="submit">Yes</StyledButton>
        </Form>
        <StyledButton onClick={() => setIsOpen(false)}>No</StyledButton>
      </StyledDeleteConfirmation>
    </Modal>
  );
};
