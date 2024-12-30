import { ActionFunctionArgs } from '@remix-run/node'
import { scheduleTask } from '~/services/task.server'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { listId, taskId } = params
    if (!listId) {
        throw new Error('List ID is required')
    }
    if (!taskId) {
        throw new Error('Task ID is required')
    }

    const formData = await request.formData()
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const dateTime = new Date(`${date}T${time}`)

    const event = await scheduleTask(request, {
        taskId,
        tasklist: listId,
        date: dateTime.toISOString(),
    })

    return event
}
