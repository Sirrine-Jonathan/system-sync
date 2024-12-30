import type { LoaderFunction } from '@remix-run/node'
import { calendar_v3 } from 'googleapis'
import { Outlet, useLoaderData } from '@remix-run/react'
import { Event } from '~/components/Events/Event'
import { getEvents } from '~/services/event.server'
import styled from '@emotion/styled'
import { getRangeMinMax } from '~/utils/time'
import { StyledCalenderHeader } from '~/components/styledParts/CalendarHeader'

export const handle = {
    title: 'Calendar | Week',
}

const StyledWeek = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 100%;
    overflow: auto;
    padding-bottom: 1rem;
`

const StyledDay = styled.div<{ gridColumnStart?: number | boolean }>`
    position: relative;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    display: flex;
    padding: 25px 5px 0 5px;
    justify-content: center;
    flex-direction: column;
    min-height: 40px;

    .dayHeader {
        font-weight: bold;
        margin-bottom: 1rem;
        position: absolute;
        top: 5px;
        left: 5px;
        height: 20px;
    }
`

export const loader: LoaderFunction = async ({
    request,
    params,
}): Promise<
    | {
          events: calendar_v3.Schema$Event[] | undefined
          weekMin: Date
          weekMax: Date
      }
    | undefined
> => {
    const { day, month, year } = params

    if (!day || !month || !year) {
        return
    }

    const { weekMin, weekMax } = getRangeMinMax(
        new Date(`${year}-${month}-${day}`)
    )
    const events = await getEvents(request, {
        timeMin: weekMin.toISOString(),
        timeMax: weekMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })

    return {
        events,
        weekMin,
        weekMax,
    }
}

const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
    const { events, weekMin, weekMax } = useLoaderData<{
        events: calendar_v3.Schema$Event[]
        weekMin: Date
        weekMax: Date
    }>()

    const eventsWithStartDate = events.filter((event) => {
        return event.start?.dateTime
    })

    const goToNextWeek = () => {}

    const goToPreviousWeek = () => {}

    const calendarTitle = `${weekMin.toLocaleDateString()} - ${weekMax.toLocaleDateString()}`

    const addDayToDate = (date: Date, days: number) => {
        date.setDate(date.getDate() + days)
        return date
    }

    return (
        <div>
            <StyledCalenderHeader>
                <button onClick={goToPreviousWeek}>
                    <img src="/icons/arrow-left.svg" alt="previous" />
                </button>
                <h1>{calendarTitle}</h1>
                <button onClick={goToNextWeek}>
                    <img src="/icons/arrow-right.svg" alt="previous" />
                </button>
            </StyledCalenderHeader>
            <StyledWeek>
                {Array.from({ length: 7 }, (_, i) => {
                    const date = addDayToDate(weekMin, i)
                    return (
                        <StyledDay key={i} gridColumnStart={i + 1}>
                            <div className="dayHeader">
                                <span>{daysOfTheWeek[i]}</span>
                                {' | '}
                                <span>
                                    {addDayToDate(weekMin, i + 1).getDate()}
                                </span>
                            </div>
                            {eventsWithStartDate
                                .filter((event) => {
                                    const eventStart = new Date(
                                        event.start?.dateTime || ''
                                    )
                                    return (
                                        eventStart.getDate() ===
                                        weekMin.getDate() + i
                                    )
                                })
                                .map((event) => (
                                    <Event key={event.id} event={event} />
                                ))}
                        </StyledDay>
                    )
                })}
            </StyledWeek>
            <Outlet />
        </div>
    )
}
