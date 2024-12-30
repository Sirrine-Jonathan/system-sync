import { useState } from 'react'
import { Modal } from './Modal'
import { FlexContainer } from './styledParts/FlexContainer'
import { StyledButton, StyledIconButton } from './styledParts/Buttons'
import { CreateEventForm } from './Events/CreateEventForm'
import { CreateTaskForm } from './Tasks/CreateTaskForm'
import { tasks_v1 } from 'googleapis'

export const CreateModal = ({
    isOpen,
    setIsOpen,
    lists,
    defaultStart,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    lists?: tasks_v1.Schema$TaskList[]
    defaultStart?: Date | null
}) => {
    const [createType, setCreateType] = useState<'event' | 'task'>('event')

    const createTypeTitleMap = {
        event: 'Event',
        task: 'Task',
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Create ${createTypeTitleMap[createType]}`}
            style={{
                minHeight: '70vh',
            }}
        >
            <FlexContainer justifyContent="center" gap="1em" padding="1em">
                <StyledButton
                    onClick={() => setCreateType('event')}
                    context={createType === 'event' ? 'attention' : undefined}
                >
                    Event
                </StyledButton>
                <div>or</div>
                <StyledButton
                    onClick={() => setCreateType('task')}
                    context={createType === 'task' ? 'attention' : undefined}
                >
                    Task
                </StyledButton>
            </FlexContainer>

            {createType === 'event' && (
                <CreateEventForm defaultStart={defaultStart} />
            )}

            {createType === 'task' && (
                <CreateTaskForm
                    {...(lists ? { lists } : {})}
                    onSubmit={() => setIsOpen(false)}
                    defaultStart={defaultStart}
                />
            )}
        </Modal>
    )
}

export const CreateModalButton = ({
    lists,
    defaultStart,
}: {
    lists?: tasks_v1.Schema$TaskList[]
    defaultStart?: Date | null
}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <StyledIconButton
                onClick={() => setIsOpen(true)}
                context="attention"
                size="large"
            >
                <img src="/icons/plus-dark.svg" alt="" />
            </StyledIconButton>
            <CreateModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                lists={lists}
                defaultStart={defaultStart}
            />
        </>
    )
}
