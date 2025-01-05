import {
    Outlet,
    useLoaderData,
    useRouteError,
    useMatches,
} from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import { type LoaderFunctionArgs } from '@remix-run/node'
import { Header, FALLBACK_IMAGE_URL } from '~/components/Nav/Header'
import { useEffect } from 'react'
import { isValidTimeZone, getRangeMinMax } from '~/utils/time'
import { SignInButton } from '~/components/Auth/SignInButton'
import { DesktopNav } from '~/components/Nav/DesktopNav'
import { StyledIconLink } from '~/components/styledParts/Links'
import { MobileOnly } from '~/components/styledParts/MobileOnly'
import { FlexContainer } from '~/components/styledParts/FlexContainer'
import {
    CreateModal,
    CreateModalContextProvider,
} from '~/components/CreateModal'
import { getEvents } from '~/services/event.server'
import { getListsWithTasks } from '~/services/task.server'
import { getSession } from '~/services/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: '/auth/signin',
    })

    const session = await getSession(request)
    const user = session.get('user')

    const url = new URL(request.url)
    const timezone = url.searchParams.get('tz') || 'UTC'
    new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
    }).formatRange(new Date(), new Date())
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const { monthMin, monthMax } = getRangeMinMax(
        new Date(Number(year), Number(month) - 1, Number(day))
    )

    const events = await getEvents(request, {
        timeMin: monthMin.toISOString(),
        timeMax: monthMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })

    const lists = await getListsWithTasks(request)

    return { events, lists, user }
}

export default function Layout() {
    const { user, events, lists } = useLoaderData<ReturnType<typeof loader>>()

    // add timezone to the url
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            const tz = url.searchParams.get('tz')
            if (tz && isValidTimeZone(tz)) {
                return
            }

            // prefer timezone on user obj if any
            if (user.timezone && isValidTimeZone(user.timezone)) {
                url.searchParams.set('tz', user.timezone)
                window.history.replaceState({}, '', url)
                return
            }

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            url.searchParams.set('tz', timezone)
            window.history.replaceState({}, '', url)
        }
    }, [user.timezone])

    return (
        <CreateModalContextProvider>
            <main className="flex-col">
                <Header
                    imageUrl={user?.photos?.[0].value || FALLBACK_IMAGE_URL}
                />
                <DesktopNav user={user} />
                <Outlet context={{ events, lists, user }} />
                <CreateModal lists={lists} />
            </main>
        </CreateModalContextProvider>
    )
}

export const ErrorBoundary = () => {
    const error = useRouteError()
    const matches = useMatches()
    const leafNode = matches[matches.length - 1]
    const returnUrl = leafNode.pathname

    let Component = <div></div>
    if (
        (error &&
            typeof error === 'object' &&
            'message' in error &&
            error.message === 'User not authenticated') ||
        error.message === 'Unauthorized' ||
        error.message === 'Forbidden' ||
        error.message === 'Not Found' ||
        error.message === 'Invalid Credentials'
    ) {
        Component = (
            <section>
                <FlexContainer gap="1em" justifyContent="center">
                    <SignInButton successRedirect={returnUrl} />
                    <MobileOnly>
                        <StyledIconLink to="/auth/signout">
                            <img src="/icons/signout.svg" alt="" />
                        </StyledIconLink>
                    </MobileOnly>
                </FlexContainer>
            </section>
        )
    } else {
        Component = (
            <section>
                <p>{error?.message}</p>
            </section>
        )
    }
    return (
        <main className="flex-col">
            <Header />
            <DesktopNav />
            {Component}
        </main>
    )
}
