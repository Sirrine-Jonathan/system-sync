import { useLoaderData, NavLink } from '@remix-run/react'
import { getTaskInList, TaskInList, patchTask } from '~/services/task.server'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import UpdateTaskForm from '~/components/Tasks/UpdateTaskForm'

export const handle = {
    title: 'Edit Task',
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { listId, taskId } = params
    if (!listId) {
        throw new Error('List ID is required')
    }
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    try {
        return await getTaskInList(request, { taskId, tasklist: listId })
    } catch (error) {
        console.error(error)
        return null
    }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { listId, taskId } = params
    if (!listId) {
        throw new Error('List ID is required')
    }
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    const formDate = await request.formData()
    const title = formDate.get('title') as string
    const notes = formDate.get('notes') as string
    const due = formDate.get('due') as string
    const dueStr = due ? new Date(due).toISOString() : null
    return await patchTask(request, {
        tasklist: listId,
        taskId,
        title,
        notes,
        due: dueStr,
    })
}

export default function EditTask() {
    const list = useLoaderData<TaskInList>()
    const task = list.task

    if (!list) {
        return <p>No task found</p>
    }

    return (
        <section>
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to={`/tasklists/${list.id}`}>{list.title}</NavLink>
                <NavLink to={`/tasklists/${list.id}/task/${task.id}`}>
                    {task.title}
                </NavLink>
                <NavLink
                    to={`/tasklists/${list.id}/task/${task.id}/edit`}
                    className="current"
                >
                    Edit
                </NavLink>
            </Breadcrumbs>
            <UpdateTaskForm listId={list.id} task={task} />
        </section>
    )
}
