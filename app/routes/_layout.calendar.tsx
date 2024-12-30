import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import { getListsWithTasks, TaskListWithTasks } from '~/services/task.server'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { FlexContainer } from '~/components/styledParts/FlexContainer'

export const handle = {
    title: 'Calendar',
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    authenticator.authenticate('google', request, {
        failureRedirect: `/auth/signin?redirect=${request.url}`,
    })

    // look for month day or week after /calendar/ in url path
    const url = new URL(request.url)
    const path = url.pathname.split('/')
    const isCalendarPageWithTime = path.some((pathSegment) => {
        if (
            pathSegment === 'month' ||
            pathSegment === 'week' ||
            pathSegment === 'day' ||
            pathSegment === 'event' ||
            pathSegment === 'events'
        ) {
            return true
        }
        return false
    })

    if (isCalendarPageWithTime) {
        return json(await getListsWithTasks(request))
    }

    return redirect('/calendar/month')
}

export default function Calendar() {
    useLoaderData<TaskListWithTasks[]>()

    return (
        <section>
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/calendar">Calendar</NavLink>
                <FlexContainer gap="1em">
                    <NavLink to="/calendar/month">Month</NavLink>
                    <NavLink to="/calendar/week">Week</NavLink>
                    <NavLink to="/calendar/day">Day</NavLink>
                </FlexContainer>
            </Breadcrumbs>
            <Outlet />
        </section>
    )
}
