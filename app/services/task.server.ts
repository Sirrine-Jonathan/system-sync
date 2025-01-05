import { createEvent } from './event.server'
import { getSession } from './session.server'
import { google, tasks_v1 } from 'googleapis'

export type TaskWithListTitle = tasks_v1.Schema$Task & {
    listTitle: tasks_v1.Schema$TaskList['title']
    listId: tasks_v1.Schema$TaskList['id']
}

export type TaskListWithTasks = tasks_v1.Schema$TaskList & {
    tasks: TaskWithListTitle[]
}

export type TaskInList = tasks_v1.Schema$TaskList & {
    task: TaskWithListTitle
}

const getService = async (request: Request) => {
    // Get session and access token
    const session = await getSession(request)
    const accessToken = session.get('accessToken')

    if (!accessToken) throw new Error('User not authenticated')

    // Set up the OAuth2 client with access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    // Initialize Google Calendar API client
    return google.tasks({ version: 'v1', auth: oauth2Client })
}

export const getLists = async (request: Request) => {
    const googleService = await getService(request)
    return await googleService.tasklists.list().then((res) => res.data.items)
}

export const getListById = async (request: Request, id: string) => {
    const googleService = await getService(request)
    return await googleService.tasklists
        .get({
            tasklist: id,
        })
        .then((res) => res.data)
}

export const getTasksForList = async (
    request: Request,
    options?: { tasklist: string }
) => {
    let tasklist = null
    if (options?.tasklist) {
        tasklist = options.tasklist
    } else {
        const lists = await getLists(request)
        tasklist = lists?.[0].id
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)
    return await googleService.tasks
        .list({
            maxResults: 10,
            tasklist,
        })
        .then((res) => res.data.items)
}

export const getTaskById = async (
    request: Request,
    options: { taskId: string; tasklist: string }
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)
    return await googleService.tasks
        .get({
            tasklist,
            task: taskId,
        })
        .then((res) => res.data)
}

export type GetListsOptions = {
    tasklist?: string
    limit?: number
    search?: string
}

export const getListsWithTasks = async (
    request: Request,
    options?: GetListsOptions
) => {
    let filteredLists: TaskListWithTasks[] = []

    if (options?.tasklist) {
        const list = await getListByIdWithTasks(request, options.tasklist)
        if (list) {
            filteredLists.push({
                ...list,
            })
        }
    } else {
        const lists = await getLists(request)

        for (const list of lists || []) {
            if (!list.id) {
                continue
            }
            const listWithTasks = await getListByIdWithTasks(request, list.id)
            if (listWithTasks) {
                filteredLists.push({
                    ...listWithTasks,
                })
            }
        }
    }

    if (options?.search) {
        filteredLists = filteredLists.map((list) => ({
            ...list,
            tasks: list.tasks.filter((task) =>
                task.title.toLowerCase().includes(options.search.toLowerCase())
            ),
        }))
    }

    return filteredLists
}

export const getListByIdWithTasks = async (
    request: Request,
    id: string
): Promise<TaskListWithTasks> => {
    const list = await getListById(request, id)
    const tasks = await getTasksForList(request, { tasklist: id })
    const tasksWithListTitle = tasks?.map((task) => ({
        ...task,
        listTitle: list.title,
        listId: list.id,
    }))
    return { ...list, tasks: tasksWithListTitle || [] }
}

export const getTaskInList = async (
    request: Request,
    options: { taskId: string; tasklist: string }
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)
    const list = await getListById(request, tasklist)
    const task = await googleService.tasks
        .get({
            tasklist,
            task: taskId,
        })
        .then((res) => res.data)

    return { ...list, task }
}

export const createTaskList = async (request: Request, title: string) => {
    const googleService = await getService(request)
    const list = await googleService.tasklists
        .insert({
            resource: {
                title,
            },
        })
        .then((res) => res.data)

    return list
}

export const updateTaskList = async (
    request: Request,
    options: { listId: string; title: string }
) => {
    const { listId, title } = options
    if (!listId) {
        throw new Error('List ID is required')
    }
    const googleService = await getService(request)
    const list = await googleService.tasklists
        .update({
            tasklist: listId,
            resource: {
                id: listId,
                title,
            },
        })
        .then((res) => res.data)

    return list
}

export const createTask = async (
    request: Request,
    options: {
        tasklist: string
        title: string
        notes?: string
        status?: string
    }
) => {
    const { tasklist, title, notes, status } = options
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)
    const task = await googleService.tasks
        .insert({
            tasklist,
            resource: {
                title,
                notes,
                status,
            },
        })
        .then((res) => res.data)

    return task
}

export const patchTask = async (
    request: Request,
    options: {
        taskId: string
        tasklist: string
    } & Partial<tasks_v1.Schema$Task>
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)

    const resource: tasks_v1.Schema$Task = {}
    if (options.title) {
        resource.title = options.title
    }
    if (options.notes) {
        resource.notes = options.notes
    }

    const task = await googleService.tasks
        .patch({
            tasklist,
            task: taskId,
            resource,
        })
        .then((res) => res.data)

    return task
}

export const updateTaskStatus = async (
    request: Request,
    options: {
        taskId: string
        tasklist: string
        status: 'completed' | 'needsAction'
    }
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)
    const task = await googleService.tasks
        .patch({
            tasklist,
            task: taskId,
            resource: {
                status: options.status,
            },
        })
        .then((res) => res.data)

    return task
}

export const markComplete = async (
    request: Request,
    options: { taskId: string; tasklist: string }
) => updateTaskStatus(request, { ...options, status: 'completed' })

export const markIncomplete = async (
    request: Request,
    options: { taskId: string; tasklist: string }
) => updateTaskStatus(request, { ...options, status: 'needsAction' })

export const toggleTask = async (
    request: Request,
    options: { taskId: string; tasklist: string }
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const task = await getTaskById(request, { taskId, tasklist })
    if (!task) {
        throw new Error('Task not found')
    }
    if (task.status === 'completed') {
        return markIncomplete(request, { taskId, tasklist })
    } else {
        return markComplete(request, { taskId, tasklist })
    }
}

export const deleteTask = async (
    request: Request,
    options: { taskId: string; tasklist: string }
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const googleService = await getService(request)
    const task = await googleService.tasks
        .delete({
            tasklist,
            task: taskId,
        })
        .then((res) => res.data)

    return task
}

// deletes the task from the tasklist
// creates a calendar event with the task title
export const scheduleTask = async (
    request: Request,
    options: {
        taskId: string
        tasklist: string
        date: string
    }
) => {
    const { taskId, tasklist } = options
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    if (!tasklist) {
        throw new Error('Tasklist ID is required')
    }
    const task = await getTaskInList(request, { taskId, tasklist })
    const startDateTime = options.date
    const duration = 0.5 * 60 * 60 * 1000
    const endDateTimeDate = new Date(
        new Date(startDateTime).getTime() + duration
    )
    const endDateTime = endDateTimeDate.toISOString()
    const event = {
        summary: task.title,
        start: {
            dateTime: startDateTime,
        },
        end: {
            dateTime: endDateTime,
        },
    }
    return createEvent(request, event)
}
