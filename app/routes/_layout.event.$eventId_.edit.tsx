import { type LoaderFunction } from '@remix-run/node'
import { NavLink, useLoaderData } from '@remix-run/react'
import { getEvent, updateEvent } from '~/services/event.server'
import { calendar_v3 } from 'googleapis'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { UpdateEventForm } from '~/components/Events/UpdateEventForm'

export const handle = {
    title: 'Edit event',
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const { eventId } = params
    if (!eventId) {
        return null
    }
    return await getEvent(request, { eventId })
}

export const action: LoaderFunction = async ({ request, params }) => {
    const { eventId } = params
    if (!eventId) {
        return null
    }

    const formData = await request.formData()

    const patch: Partial<calendar_v3.Schema$Event> = {
        id: eventId,
    }

    const summary = formData.get('summary') as string
    if (summary) {
        patch.summary = summary
    }

    const description = formData.get('description') as string
    if (description) {
        patch.description = description
    }

    return await updateEvent(request, patch)
}

export default function EventEdit() {
    const event = useLoaderData<calendar_v3.Schema$Event>()
    const startDateTime = event.start?.dateTime?.slice(0, 16)
    const endDateTime = event.end?.dateTime?.slice(0, 16)

    return (
        <section>
            <Breadcrumbs>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/events">Events</NavLink>
                <NavLink to={`/event/${event.id}`}>{event.summary}</NavLink>
                <NavLink to={`/event/${event.id}/edit`} className="current">
                    Edit
                </NavLink>
            </Breadcrumbs>
            <UpdateEventForm
                event={event}
                startDateTime={startDateTime}
                endDateTime={endDateTime}
            />
        </section>
    )
}
