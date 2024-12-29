import { Modal, ModalHeader } from "../Modal";
import { CreateEventForm } from "./CreateEventForm";

export const CreateEventModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalHeader>
        <div className="modalTitle">Create Event</div>
      </ModalHeader>
      <CreateEventForm />
    </Modal>
  );
};
