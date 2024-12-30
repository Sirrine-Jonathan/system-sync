import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { StyledButton } from '~/components/styledParts/Buttons'
import { StyledForm } from '~/components/styledParts/Form'
import { useFetcher } from '@remix-run/react'
import { calendar_v3 } from 'googleapis'
export const UpdateEventForm = ({
    event,
    startDateTime,
    endDateTime,
}: {
    event: calendar_v3.Schema$Event
    startDateTime?: string
    endDateTime?: string
}) => {
    const fetcher = useFetcher<calendar_v3.Schema$Event>()
    return (
        <StyledForm state={fetcher.state}>
            <fetcher.Form method="post" action={`/event/${event.id}/edit`}>
                <label>
                    Summary
                    <textarea
                        required
                        placeholder="Summary"
                        name="summary"
                        defaultValue={event.summary || ''}
                    ></textarea>
                </label>
                <label>
                    Description
                    <textarea
                        placeholder="Description"
                        name="description"
                        defaultValue={event.description || ''}
                    ></textarea>
                </label>
                <label>
                    Start Date
                    <input
                        type="datetime-local"
                        name="start"
                        defaultValue={startDateTime || ''}
                    />
                    <img src="/icons/calendar.svg" alt="open datepicker" />
                </label>
                <label>
                    End Date
                    <input
                        type="datetime-local"
                        name="end"
                        defaultValue={endDateTime || ''}
                    />
                    <img src="/icons/calendar.svg" alt="open datepicker" />
                </label>
                <FlexContainer justifyContent="flex-end">
                    <StyledButton type="submit">Save</StyledButton>
                </FlexContainer>
            </fetcher.Form>
        </StyledForm>
    )
}
