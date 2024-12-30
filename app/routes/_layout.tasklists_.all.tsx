import { NavLink } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import {
    getLists,
    getListsWithTasks,
    type GetListsOptions,
} from '~/services/task.server'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { TaskGrid } from '~/components/Tasks/TaskGrid'
export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    const options: GetListsOptions = {}

    if (searchParams.has('list')) {
        options['tasklist'] = searchParams.get('list') || ''
    }

    if (searchParams.has('limit') && searchParams.get('limit')) {
        const limit = parseInt(searchParams.get('limit') || '0')
        if (limit > 0) {
            options['limit'] = limit
        }
    }

    if (searchParams.has('search') && searchParams.get('search')) {
        options['search'] = searchParams.get('search') || ''
    }

    const lists = await getListsWithTasks(request, options)
    const listsForFilter = await getLists(request)

    console.log({ lists, options })

    if (!lists) {
        throw new Response('Not Found', { status: 404 })
    }

    return { lists, listsForFilter }
}

export default function Tasks() {
    return (
        <section id="tasks">
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to="/tasks" className="current">
                    All Tasks
                </NavLink>
            </Breadcrumbs>
            <TaskGrid />
        </section>
    )
}
