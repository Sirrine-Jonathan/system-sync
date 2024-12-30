import { NavLink, useLoaderData, useFetcher } from '@remix-run/react'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import {
    getListByIdWithTasks,
    type TaskListWithTasks,
} from '~/services/task.server'
import { StyledForm } from '~/components/styledParts/Form'
import { StyledButton } from '~/components/styledParts/Buttons'
import { updateTaskList } from '~/services/task.server'

export const handle = {
    title: 'Edit Task List',
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { listId } = params

    if (!listId) {
        throw new Error('List ID is required')
    }

    const list = await getListByIdWithTasks(request, listId)

    return { list }
}

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const { listId } = params
    if (!listId) {
        throw new Error('List ID is required')
    }
    const formData = await request.formData()
    const title = formData.get('title') as string
    if (!title) {
        throw new Error('Title is required')
    }
    await updateTaskList(request, { listId, title })
    return redirect(`/tasklists/${listId}`)
}

export default function EditTaskList() {
    const { list } = useLoaderData<{
        list: TaskListWithTasks
    }>()
    const fetcher = useFetcher()
    return (
        <section id="edit-tasklist">
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to={`/tasklists/${list.id}`}>{list.title}</NavLink>
                <NavLink to="/tasklists/edit" className="current">
                    Edit
                </NavLink>
            </Breadcrumbs>
            <StyledForm state={fetcher.state}>
                <fetcher.Form
                    method="post"
                    action={`/tasklists/${list.id}/edit`}
                >
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        defaultValue={list.title || ''}
                    />
                    <StyledButton type="submit">Save</StyledButton>
                </fetcher.Form>
            </StyledForm>
        </section>
    )
}
