import type { LoaderFunction } from '@remix-run/node'
import { calendar_v3 } from 'googleapis'
import { useLoaderData } from '@remix-run/react'
import { getEvents } from '~/services/event.server'
import { getRangeMinMax } from '~/utils/time'
import { MonthView } from '~/components/Events/MonthView'

export const handle = {
    title: 'Calendar | Month',
}

export const loader: LoaderFunction = async ({
    request,
    params,
}): Promise<
    | {
          events: calendar_v3.Schema$Event[] | undefined
          monthMin: Date
          monthMax: Date
      }
    | undefined
> => {
    const { day, month, year } = params

    if (!day || !month || !year) {
        return
    }

    const { monthMin, monthMax } = getRangeMinMax(
        new Date(Number(year), Number(month) - 1, Number(day))
    )

    const events = await getEvents(request, {
        timeMin: monthMin.toISOString(),
        timeMax: monthMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })

    return {
        events,
        monthMin,
        monthMax,
    }
}

export default function MonthComponent() {
    const { events } = useLoaderData<{
        events: calendar_v3.Schema$Event[]
        monthMin: Date
        monthMax: Date
    }>()

    return <MonthView events={events} />
}
