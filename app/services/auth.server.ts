import { Authenticator } from 'remix-auth'
import { OAuth2Strategy } from 'remix-auth-oauth2'
import { getProfile } from './profile.server'
import { findOrCreateUser } from './user.server'
import { getSession } from './session.server'

export const authenticator = new Authenticator()

const googleStrategy = new OAuth2Strategy(
    {
        cookie: {
            name: 'oauth2',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/auth',
            httpOnly: true,
            sameSite: 'Lax',
            secure: true,
        },
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectURI:
            process.env.NODE_ENV === 'production'
                ? 'https://system-sync.netlify.app/auth/callback'
                : 'http://localhost:5173/auth/callback',
        authorizationEndpoint:
            'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        tokenRevocationEndpoint: 'https://oauth2.googleapis.com/revoke',
        scopes: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/tasks',
        ],
    },
    async ({ tokens, request }) => {
        const userTokens = {
            accessToken: tokens.accessToken(),
            refreshToken: tokens.hasRefreshToken()
                ? tokens.refreshToken()
                : null,
        }
        const profile = await getProfile(userTokens)

        const user = await findOrCreateUser({
            profile,
            tokens: userTokens,
        })

        const session = await getSession(request)
        session.set('user', user)

        return session
    }
)

authenticator.use(googleStrategy, 'google')

export async function refreshToken(refreshToken: string) {
    return await googleStrategy.refreshToken(refreshToken)
}
