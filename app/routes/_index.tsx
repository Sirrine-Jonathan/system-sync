import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, redirect } from '@remix-run/react'
import { requireUser } from '~/services/session.server'

export const meta: MetaFunction = () => {
    return [
        { title: 'System Sync' },
        { name: 'description', content: 'Welcome to System Sync' },
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUser(request)
    throw redirect('/dashboard')
}

export default function Index() {
    return <Outlet />
}
