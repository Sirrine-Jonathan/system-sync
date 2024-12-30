import { ActionFunctionArgs } from '@remix-run/node'
import { toggleTask } from '~/services/task.server'
export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { listId, taskId } = params
    if (!listId) {
        throw new Error('List ID is required')
    }
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    return await toggleTask(request, { taskId, tasklist: listId })
}
