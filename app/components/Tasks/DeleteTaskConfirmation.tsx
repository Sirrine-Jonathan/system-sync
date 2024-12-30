import { Form, useFetcher } from '@remix-run/react'
import { Modal, ModalHeader } from '../Modal'
import { StyledButton } from '../styledParts/Buttons'
import { Center } from '../styledParts/Text'
import styled from '@emotion/styled'
import { TaskWithListTitle } from '~/services/task.server'

const StyledDeleteConfirmation = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`
export const DeleteTaskConfirmation = ({
    isOpen,
    setIsOpen,
    task,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    task: TaskWithListTitle
}) => {
    const fetcher = useFetcher()
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className="deleteTaskConfirmation"
            title="Delete Task"
            subtitle={task.title}
        >
            <StyledDeleteConfirmation>
                <Center>
                    Are you sure you want to
                    <br />
                    delete this task?
                </Center>
                <fetcher.Form
                    onSubmit={(e) => {
                        e.preventDefault()
                        fetcher.submit(e.currentTarget, {
                            method: 'post',
                            action: `/tasklists/${task.listId}/task/${task.id}/delete`,
                        })
                        setIsOpen(false)
                    }}
                >
                    <StyledButton type="submit">Yes</StyledButton>
                </fetcher.Form>
                <StyledButton onClick={() => setIsOpen(false)}>No</StyledButton>
            </StyledDeleteConfirmation>
        </Modal>
    )
}
