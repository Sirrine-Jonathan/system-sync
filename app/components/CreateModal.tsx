import { createContext, useContext, useState } from 'react'
import { Modal } from './Modal'
import { FlexContainer } from './styledParts/FlexContainer'
import { StyledButton, StyledIconButton } from './styledParts/Buttons'
import { CreateEventForm } from './Events/CreateEventForm'
import { CreateTaskForm } from './Tasks/CreateTaskForm'
import { tasks_v1 } from 'googleapis'

type CreateModalContextType = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    createType: 'event' | 'task'
    setCreateType: (createType: 'event' | 'task') => void
    defaultListId: string | null
    setDefaultListId: (defaultListId: string | null) => void
    defaultStart: Date | null
    setDefaultStart?: (defaultStart: Date | null) => void
}

const CreateModalContext = createContext<CreateModalContextType>({
    isOpen: false,
    setIsOpen: () => {},
    createType: 'task',
    setCreateType: () => {},
    defaultListId: null,
    setDefaultListId: () => {},
    defaultStart: new Date(),
    setDefaultStart: () => {},
})

export const CreateModalContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [createType, setCreateType] = useState<'event' | 'task'>('task')
    const [defaultListId, setDefaultListId] = useState<string | null>(null)
    const [defaultStart, setDefaultStart] = useState<Date | null>(null)
    return (
        <CreateModalContext.Provider
            value={{
                isOpen,
                setIsOpen,
                createType,
                setCreateType,
                defaultListId,
                setDefaultListId,
                defaultStart,
                setDefaultStart,
            }}
        >
            {children}
        </CreateModalContext.Provider>
    )
}

export const useCreateModalContext = () => {
    const {
        isOpen,
        setIsOpen,
        createType,
        setCreateType,
        defaultListId,
        setDefaultListId,
        defaultStart,
        setDefaultStart,
    } = useContext(CreateModalContext)

    const setIsCreateModalOpen = (
        isOpen: boolean,
        options?: {
            type?: 'event' | 'task' | null
            defaultTaskId?: string | null
            defaultStart?: Date | null
        }
    ) => {
        if (options?.type) {
            setCreateType(options.type)
        }
        if (options?.defaultTaskId) {
            setDefaultListId(options.defaultTaskId)
        }

        setIsOpen(isOpen)
    }

    return {
        isOpen,
        setIsCreateModalOpen,
        createType,
        setCreateType,
        defaultListId,
        setDefaultListId,
        defaultStart,
        setDefaultStart,
    }
}

export const CreateModal = ({
    lists,
}: {
    lists?: tasks_v1.Schema$TaskList[]
}) => {
    const {
        isOpen,
        setIsCreateModalOpen: setIsOpen,
        createType,
        setCreateType,
        defaultListId,
        defaultStart,
    } = useCreateModalContext()

    const createTypeTitleMap = {
        event: 'Event',
        task: 'Task',
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={(isOpen: boolean) => setIsOpen(isOpen)}
            title={`Create ${createTypeTitleMap[createType]}`}
            style={{
                minHeight: '70vh',
            }}
        >
            <FlexContainer justifyContent="center" gap="1em" padding="1em">
                <StyledButton
                    onClick={() => setCreateType('task')}
                    context={createType === 'task' ? 'attention' : undefined}
                >
                    Task
                </StyledButton>
                <div>or</div>
                <StyledButton
                    onClick={() => setCreateType('event')}
                    context={createType === 'event' ? 'attention' : undefined}
                >
                    Event
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
                    defaultListId={defaultListId}
                />
            )}
        </Modal>
    )
}

export const CreateModalButton = ({
    lists,
    defaultTaskId,
    defaultStart,
}: {
    lists?: tasks_v1.Schema$TaskList[]
    defaultTaskId?: tasks_v1.Schema$Task['id']
    defaultStart?: Date | null
}) => {
    const { setIsCreateModalOpen } = useCreateModalContext()
    return (
        <>
            <StyledIconButton
                onClick={() =>
                    setIsCreateModalOpen(true, {
                        type: 'task',
                        defaultTaskId,
                        defaultStart,
                    })
                }
                context="attention"
                size="large"
            >
                <img src="/icons/plus-dark.svg" alt="" />
            </StyledIconButton>
            <CreateModal lists={lists} />
        </>
    )
}
