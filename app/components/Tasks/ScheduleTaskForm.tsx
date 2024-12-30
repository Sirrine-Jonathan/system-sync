import styled from '@emotion/styled'
import { useFetcher } from '@remix-run/react'
import { StyledForm } from '../styledParts/Form'
import { StyledButton } from '../styledParts/Buttons'

export const StyledScheduleTaskForm = styled(StyledForm)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: transparent;
`

export const ScheduleTaskForm = ({
    listId,
    taskId,
    onSubmit,
}: {
    listId: string
    taskId: string
    onSubmit?: () => void
}) => {
    const fetcher = useFetcher()

    const handleCreateEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetcher.submit(e.currentTarget, {
            method: 'post',
            action: `/tasklists/${listId}/task/${taskId}/schedule`,
        })
        onSubmit?.()
    }

    return (
        <StyledScheduleTaskForm state={fetcher.state}>
            <fetcher.Form onSubmit={handleCreateEventSubmit}>
                <label htmlFor="date">
                    Date
                    <input
                        type="date"
                        name="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                    <img src="/icons/calendar.svg" alt="" />
                </label>
                <label htmlFor="time">
                    Time
                    <input
                        type="time"
                        name="time"
                        defaultValue={new Date().toISOString().slice(11, 16)}
                    />
                    <img src="/icons/clock.svg" alt="" />
                </label>
                <StyledButton type="submit">Schedule</StyledButton>
            </fetcher.Form>
        </StyledScheduleTaskForm>
    )
}
