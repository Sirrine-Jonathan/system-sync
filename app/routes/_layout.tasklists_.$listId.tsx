import { NavLink, useLoaderData } from '@remix-run/react'
import { getListByIdWithTasks, TaskListWithTasks } from '~/services/task.server'
import { LoaderFunctionArgs } from '@remix-run/node'
import { StyledIconLink } from '~/components/styledParts/Links'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { TaskRow } from '~/components/Tasks/TaskRow'
import { Well } from '~/components/styledParts/Well'

export const handle = {
    title: 'Tasks List',
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { listId } = params

    if (!listId) {
        throw new Error('List ID is required')
    }

    const list = await getListByIdWithTasks(request, listId)

    return { list }
}

export default function ViewTask() {
    const { list } = useLoaderData<{
        list: TaskListWithTasks
    }>()

    return (
        <section>
            <Breadcrumbs
                actions={[
                    <StyledIconLink
                        key="edit"
                        to={`/tasklists/${list.id}/edit`}
                    >
                        <span>Edit List</span>
                        <img src="/icons/edit.svg" alt="" />
                    </StyledIconLink>,
                    <StyledIconLink
                        key="create"
                        to={`/tasklists/${list.id}/new?listId=${list.id}`}
                    >
                        <span>Create Task</span>
                        <img src="/icons/plus.svg" alt="" />
                    </StyledIconLink>,
                    <StyledIconLink
                        key="delete"
                        to={`/tasklists/${list.id}/delete`}
                        context="danger"
                    >
                        <span>Delete List</span>
                        <img src="/icons/delete.svg" alt="" />
                    </StyledIconLink>,
                ]}
            >
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to={`/tasklists/${list.id}`} className="current">
                    {list.title}
                </NavLink>
            </Breadcrumbs>
            <Well>
                <FlexContainer
                    flexDirection="column"
                    alignItems="flex-end"
                    gap="0.5em"
                >
                    {list.tasks.length > 0 &&
                        list.tasks.map((task) => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                </FlexContainer>
            </Well>
        </section>
    )
}
