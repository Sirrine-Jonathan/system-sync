import { LoaderFunction, redirect } from '@remix-run/node'
import { getSession, destroySession } from '~/services/session.server'

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request)
    return redirect('/', {
        headers: {
            'Set-Cookie': await destroySession(session),
        },
    })
}
