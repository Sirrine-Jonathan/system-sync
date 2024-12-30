import type { LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData, NavLink, useLocation } from '@remix-run/react'
import { getEvent } from '~/services/event.server'
import { calendar_v3 } from 'googleapis'
import { Event } from '~/components/Events/Event'
import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { useIsMobile } from '~/hooks/useIsMobile'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'

export const handle = {
    title: 'Event',
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const { eventId } = params
    if (!eventId) {
        return null
    }
    return await getEvent(request, { eventId })
}

export default function SingleEvent() {
    const event = useLoaderData<calendar_v3.Schema$Event>()
    const location = useLocation()
    const returnUrl = location.state?.returnUrl || '/calendar/month'
    const { isMobile } = useIsMobile()
    return (
        <section>
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to={returnUrl}>Calendar</NavLink>
                <span>Event</span>
            </Breadcrumbs>
            <FlexContainer
                id="event"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="flex-start"
                alignItems="stretch"
                gap="1em"
            >
                <div style={{ flex: '1' }}>
                    <Event event={event} expanded calloutDirection="left" />
                </div>
                <Outlet context={{ event }} />
            </FlexContainer>
        </section>
    )
}
