import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { NavLink, useLoaderData, useParams } from '@remix-run/react'
import { tasks_v1 } from 'googleapis'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { CreateTaskForm } from '~/components/Tasks/CreateTaskForm'
import { createTask, getLists } from '~/services/task.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const lists = await getLists(request)
    return { lists }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { listId } = params

    if (!listId) {
        throw new Error('List ID is required')
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const notes = formData.get('notes') as string
    const status = (formData.get('status') as string) || 'needsAction'
    if (!title) {
        throw new Error('Title is required')
    }

    const task = await createTask(request, {
        tasklist: listId,
        title,
        notes,
        status,
    })

    console.log('task', task)

    return task
}

export default function NewTask() {
    const { listId } = useParams()
    const { lists } = useLoaderData<{ lists: tasks_v1.Schema$TaskList[] }>()

    const listName = lists?.find((list) => list.id === listId)?.title
    return (
        <section>
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to={`/tasklists/${listId}`}>{listName}</NavLink>
                <span>New Task</span>
            </Breadcrumbs>
            <CreateTaskForm lists={lists} defaultListId={listId} />
        </section>
    )
}
