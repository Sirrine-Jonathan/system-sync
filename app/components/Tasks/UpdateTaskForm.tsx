import { useFetcher } from '@remix-run/react'
import { FlexContainer } from '../styledParts/FlexContainer'
import { StyledButton } from '../styledParts/Buttons'
import { StyledForm } from '../styledParts/Form'
import { TaskWithListTitle } from '~/services/task.server'

const UpdateTaskForm = ({
    listId,
    task,
}: {
    listId: string
    task: TaskWithListTitle
}) => {
    const fetcher = useFetcher()

    return (
        <StyledForm state={fetcher.state}>
            <fetcher.Form
                method="post"
                action={`/tasklists/${listId}/task/${task.id}/edit`}
            >
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    defaultValue={task.title || ''}
                />
                <label htmlFor="due">
                    Due
                    <input
                        type="date"
                        name="due"
                        defaultValue={task.due || ''}
                    />
                    <img src="/icons/calendar.svg" alt="" />
                </label>
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    defaultValue={task.notes || ''}
                ></textarea>
                <FlexContainer justifyContent="flex-end">
                    <StyledButton type="submit">Save</StyledButton>
                </FlexContainer>
            </fetcher.Form>
        </StyledForm>
    )
}
export default UpdateTaskForm
