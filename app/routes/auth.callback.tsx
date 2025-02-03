import type { LoaderFunctionArgs, Session } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'
import { commitSession } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = (await authenticator.authenticate(
        'google',
        request
    )) as Session
    const user = session.get('user')

    if (!session || !user) {
        return redirect('/auth/signin')
    }

    return redirect('/dashboard', {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    })
}
