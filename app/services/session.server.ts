import { redirect } from '@remix-run/node'
import { createCookieSessionStorage, type Session } from '@remix-run/node'
import { refreshToken } from './auth.server'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error('SESSION_SECRET must be set')

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '__session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: [process.env.SESSION_SECRET],
        secure: process.env.NODE_ENV === 'production',
    },
})

export const getSession = (request: Request) =>
    sessionStorage.getSession(request.headers.get('Cookie'))

export const commitSession = (session: Session) =>
    sessionStorage.commitSession(session)

export const destroySession = (session: Session) =>
    sessionStorage.destroySession(session)

export function isTokenExpired(accessToken: string): boolean {
    const tokenParts = accessToken.split('.')
    if (tokenParts.length !== 3) return true // Invalid token format
    try {
        const payload = JSON.parse(atob(tokenParts[1])) // Decode JWT payload
        const exp = payload.exp // Expiration time (Unix timestamp)
        return Date.now() >= exp * 1000 // Compare with current time
    } catch (error) {
        console.error('Error decoding access token:', error)
        return true // Assume expired if decoding fails
    }
}

export const requireUser = async (request: Request) => {
    const session = await getSession(request)
    const user = session.get('user')
    if (!user) throw redirect('/auth/signin')
    if (
        (!user.accessToken || isTokenExpired(user.accessToken)) &&
        user.refreshToken
    ) {
        console.log('==== REFRESH TOKEN')
        const result = await refreshToken(user.refreshToken)
        console.log('==== REFRESH TOKEN result', result)
        user.accessToken = result.accessToken
        user.refreshToken = result.refreshToken
        session.set('user', user)
        throw redirect(request.url, {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        })
    }
    return user
}
