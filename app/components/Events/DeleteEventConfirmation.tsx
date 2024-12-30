import { Form } from '@remix-run/react'
import { Modal } from '../Modal'
import { StyledButton } from '../styledParts/Buttons'
import { calendar_v3 } from 'googleapis'
import styled from '@emotion/styled'
import { Center } from '../styledParts/Text'
import { FlexContainer } from '../styledParts/FlexContainer'

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
export const DeleteEventConfirmation = ({
    isOpen,
    setIsOpen,
    event,
}: {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    event: calendar_v3.Schema$Event
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className="deleteEventConfirmation"
            title="Delete Event"
            subtitle={event.summary}
        >
            <StyledDeleteConfirmation>
                <Center>
                    Are you sure you want to
                    <br />
                    delete this event?
                </Center>
                <FlexContainer justifyContent="flex-end" gap="1em">
                    <Form method="post" action={`/event/${event.id}/delete`}>
                        <StyledButton type="submit" context="danger">
                            Delete
                        </StyledButton>
                    </Form>
                    <StyledButton onClick={() => setIsOpen(false)}>
                        Cancel
                    </StyledButton>
                </FlexContainer>
            </StyledDeleteConfirmation>
        </Modal>
    )
}
