import type { LoaderFunction } from '@remix-run/node'
import { calendar_v3 } from 'googleapis'
import { Outlet, useLoaderData, useParams, useNavigate } from '@remix-run/react'
import { Event } from '~/components/Events/Event'
import { getEvents } from '~/services/event.server'
import { getRangeMinMax, getPreviousDay, getNextDay } from '~/utils/time'
import { StyledCalenderHeader } from '~/components/styledParts/CalendarHeader'
import { FlexContainer } from '~/components/styledParts/FlexContainer'

export const handle = {
    title: 'Calendar | Day',
}

export const loader: LoaderFunction = async ({
    request,
    params,
}): Promise<calendar_v3.Schema$Event[] | undefined> => {
    const { day, month, year } = params

    if (!day || !month || !year) {
        return
    }

    const { dayMin, dayMax } = getRangeMinMax(
        new Date(Number(year), Number(month) - 1, Number(day))
    )

    return await getEvents(request, {
        timeMin: dayMin.toISOString(),
        timeMax: dayMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })
}

export default function Calendar() {
    const navigate = useNavigate()
    const events = useLoaderData<calendar_v3.Schema$Event[] | undefined>()
    const { day, month, year } = useParams()
    const tzFromUrl =
        new URLSearchParams(
            typeof window !== 'undefined' ? window.location.search : 'UTC'
        ).get('tz') || 'UTC'

    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(parseInt(day!))
    date.setMonth(parseInt(month!) - 1)
    date.setFullYear(parseInt(year!))

    const calendarTitle = new Intl.DateTimeFormat('en-US', {
        timeZone: tzFromUrl,
        dateStyle: 'full',
    }).format(date)

    const goToPreviousDay = (e: React.MouseEvent) => {
        e.preventDefault()
        const previousDay = getPreviousDay(date)
        navigate(
            `/calendar/day/${previousDay.getDate()}/${previousDay.getMonth()}/${previousDay.getFullYear()}`
        )
    }

    const goToNextDay = (e: React.MouseEvent) => {
        e.preventDefault()
        const nextDay = getNextDay(date)
        navigate(
            `/calendar/day/${nextDay.getDate()}/${nextDay.getMonth() + 1}/${nextDay.getFullYear()}`
        )
    }

    return (
        <div>
            <StyledCalenderHeader>
                <button onClick={goToPreviousDay}>
                    <img src="/icons/arrow-left.svg" alt="previous" />
                </button>
                <h1>{calendarTitle}</h1>
                <button onClick={goToNextDay}>
                    <img src="/icons/arrow-right.svg" alt="previous" />
                </button>
            </StyledCalenderHeader>
            {events && (
                <FlexContainer
                    gap="1em"
                    flexDirection="column"
                    alignItems="stretch"
                >
                    {events.map((event) => (
                        <Event
                            key={event.id}
                            event={event}
                            calloutDirection="left"
                        />
                    ))}
                </FlexContainer>
            )}
            <Outlet />
        </div>
    )
}
