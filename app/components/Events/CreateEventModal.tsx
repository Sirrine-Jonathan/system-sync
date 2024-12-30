import { Modal } from '../Modal'
import { CreateEventForm } from './CreateEventForm'

export const CreateEventModal = ({
    isOpen,
    setIsOpen,
    defaultStart,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    defaultStart?: Date | null
}) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Create Event">
            <CreateEventForm defaultStart={defaultStart} />
        </Modal>
    )
}
