import { type ActionFunctionArgs, redirect } from '@remix-run/node'
import { useFetcher, NavLink, useSearchParams } from '@remix-run/react'
import { StyledForm } from '~/components/styledParts/Form'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { createTaskList } from '~/services/task.server'

export const handle = {
    title: 'Add Task',
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const title = formData.get('title') as string

    const list = await createTaskList(request, title)

    if (!list || !list?.id) {
        throw new Error('Error creating task list')
    }

    return redirect(`/tasklists/${list.id}`)
}

export default function AddTask() {
    const fetcher = useFetcher()
    const [params] = useSearchParams()

    return (
        <section>
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to="/tasklists/new" className="current">
                    New
                </NavLink>
            </Breadcrumbs>
            <h2>Create a new task list</h2>
            <StyledForm state={fetcher.state}>
                <fetcher.Form
                    method="post"
                    action="/tasklists/new"
                    defaultTask={params.get('listId')}
                >
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" name="title" />
                    <button type="submit">Create</button>
                </fetcher.Form>
            </StyledForm>
        </section>
    )
}
