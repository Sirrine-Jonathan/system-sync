import { useCallback, useState, useRef } from 'react'
import styled from '@emotion/styled'
import { useFetcher } from '@remix-run/react'
import { StyledForm } from '../styledParts/Form'
import { useTimezone } from '~/hooks/useTimezone'
import { StyledButton } from '../styledParts/Buttons'

const StyledCreateEventForm = styled(StyledForm)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: transparent;
`

export const CreateEventForm = ({
    defaultStart,
}: {
    defaultStart?: Date | null
}) => {
    const [startDate, setStartDate] = useState(
        (defaultStart ? defaultStart : new Date()).toISOString().slice(0, 16)
    )
    const [hasEndChanged, setHasEndChanged] = useState(false)
    const startInputRef = useRef<HTMLInputElement>(null)
    const endInputRef = useRef<HTMLInputElement>(null)
    const fetcher = useFetcher()
    const { tzFromUrl } = useTimezone()

    const handleCreateEventSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetcher.submit(e.currentTarget, {
            method: 'post',
            action: `/event/new?tz=${tzFromUrl}`,
        })
    }

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const start = new Date(e.target.value)
        setStartDate(start)
        const end = getEndDefault(start.toISOString().slice(0, 16))
        console.log({ start: start.toISOString(), end })
    }

    const getEndDefault = useCallback((iso: string) => {
        const end = new Date(iso)
        const minutes = 30
        end.setMinutes(end.getMinutes() + minutes)
        const endISO = end.toISOString().slice(0, 16)
        if (endInputRef.current) {
            endInputRef.current.value = endISO
        }
        return endISO
    }, [])

    return (
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
                    Start
                    <input
                        ref={startInputRef}
                        type="datetime-local"
                        id="startDateTime"
                        name="startDateTime"
                        defaultValue={startDate}
                        onChange={handleStartChange}
                        required
                    />
                    <img src="/icons/calendar.svg" alt="open datepicker" />
                </label>
                <label htmlFor="endDateTime">
                    End
                    <input
                        ref={endInputRef}
                        type="datetime-local"
                        id="endDateTime"
                        name="endDateTime"
                        defaultValue={getEndDefault(startDate)}
                        onChange={() => setHasEndChanged(true)}
                        required
                    />
                    <img src="/icons/calendar.svg" alt="open datepicker" />
                </label>
                <StyledButton type="submit">Create</StyledButton>
            </fetcher.Form>
        </StyledCreateEventForm>
    )
}
