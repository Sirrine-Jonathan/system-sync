import { useParams, useNavigate, NavLink } from '@remix-run/react'
import { EventDot } from '~/components/Events/EventDot'
import { Event } from '~/components/Events/Event'
import styled from '@emotion/styled'
import { getNextMonth, getPreviousMonth } from '~/utils/time'
import { StyledCalenderHeader } from '~/components/styledParts/CalendarHeader'
import { useIsMobile } from '~/hooks/useIsMobile'
import { EventPill } from '~/components/Events/EventPill'
import { useCreateModalContext } from '../CreateModal'
import { calendar_v3 } from 'googleapis'

const StyledCalendar = styled.div`
    .calendar {
        display: grid;
        grid-template-columns: repeat(7, minmax(10px, 1fr));
        list-style: none;
        padding: 0;
        margin: 0 -var(--horizontal-padding);
        max-width: 100%;
        overflow-x: auto;
        overflow-y: visible;

        .day {
            a.title {
                display: block;
                color: var(--color-white);
                text-decoration: none;
                text-align: center;
                margin: 0;
                padding: 10px 0;
                width: 100%;
                font-size: 12px;
                cursor: pointer;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;

                &:hover {
                    background: var(--accent-color);
                    color: var(--color-black);
                }
            }
        }

        .dayName {
            position: relative;
            text-align: center;
            box-sizing: border-box;
        }
    }
`

const StyledCalendarDay = styled.li<{
    gridColumnStart?: number | boolean
    past: boolean
}>`
    background: var(--color-black);
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    text-align: center;
    grid-column-start: ${(props) => props.gridColumnStart || 'unset'};
    position: relative;
    opacity: ${({ past }) => (past ? 0.5 : 1)};
`

const StyledCreateEventButton = styled.button`
    position: absolute;
    bottom: 0;
    padding: 0.5rem;
    border: none;
    width: 100%;
    height: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--accent-color);
    color: var(--color-black);
    cursor: pointer;

    img {
        width: 1rem;
    }
`

export function MonthView({ events }: { events: calendar_v3.Schema$Event[] }) {
    const { isMobile } = useIsMobile()
    const navigate = useNavigate()

    const { day, month, year } = useParams()
    const { setIsCreateModalOpen } = useCreateModalContext()

    const date = new Date()
    if (day) {
        date.setDate(parseInt(day!))
    }
    if (month) {
        date.setMonth(parseInt(month!) - 1)
    }
    if (year) {
        date.setFullYear(parseInt(year!))
    }

    // month
    const calendarTitle = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    })

    // number of days in this month
    const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate()

    console.log({ daysInMonth })

    // first day of this month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)

    // day of the week of the first day of this month
    const dayOfWeek = firstDay.getDay()

    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]

    const getDayContents = (date: Date) => {
        const eventsForDay = events.filter((event) => {
            const start = new Date(
                event.start!.dateTime || event.start!.date || ''
            )
            const hasStartTime = event.start?.dateTime
            const end = new Date(event.end!.dateTime || event.end!.date || '')
            const hasEndTime = event.end?.dateTime

            const startsOnDate = isSameDay(start, date) && hasStartTime
            const endsOnDate = isSameDay(end, date) && hasEndTime
            const isAllDay = !hasStartTime && !hasEndTime
            const isAllDayToday = isAllDay && isSameDay(end, date)

            return startsOnDate || endsOnDate || isAllDayToday
        })

        const MobileComponent = eventsForDay.length > 3 ? EventDot : EventPill

        return (
            <div style={{ padding: '3px' }}>
                {eventsForDay.map((event) =>
                    isMobile ? (
                        <MobileComponent key={event.id} event={event} />
                    ) : (
                        <Event
                            key={event.id}
                            event={event}
                            calloutDirection="left"
                        />
                    )
                )}
            </div>
        )
    }

    const goToNextMonth = (e: React.MouseEvent) => {
        e.preventDefault()
        const nextMonth = getNextMonth(date)
        navigate(
            `/calendar/month/${nextMonth.getDate()}/${nextMonth.getMonth() + 1}/${nextMonth.getFullYear()}`
        )
    }

    const goToPreviousMonth = (e: React.MouseEvent) => {
        e.preventDefault()
        const previousMonth = getPreviousMonth(date)
        navigate(
            `/calendar/month/${previousMonth.getDate()}/${previousMonth.getMonth() + 1}/${previousMonth.getFullYear()}`
        )
    }

    const getDateAtEndOfDay = (date: Date) => {
        date.setHours(23, 59, 59, 999)
        return date
    }

    const getIsPast = (date: Date) => {
        return getDateAtEndOfDay(date).getTime() < new Date().getTime()
    }

    const getIsToday = (date: Date) =>
        date.toDateString() === new Date().toDateString()

    const isSameDay = (dateOne: Date, dateTwo: Date) => {
        return (
            dateOne.getFullYear() === dateTwo.getFullYear() &&
            dateOne.getMonth() === dateTwo.getMonth() &&
            dateOne.getDate() === dateTwo.getDate()
        )
    }

    return (
        <div>
            <StyledCalenderHeader>
                <button onClick={goToPreviousMonth}>
                    <img src="/icons/arrow-left.svg" alt="" />
                </button>
                <h1 title={date.toLocaleString('en-US')}>{calendarTitle}</h1>
                <button onClick={goToNextMonth} aria-label="Next month">
                    <img src="/icons/arrow-right.svg" alt="" />
                </button>
            </StyledCalenderHeader>
            <StyledCalendar>
                <ol className="calendar">
                    {
                        // print out day names
                        dayNames.map((dayName) => (
                            <li className="dayName" key={dayName}>
                                {isMobile ? dayName.slice(0, 3) : dayName}
                            </li>
                        ))
                    }
                    {
                        // print out list items for each day of the month
                        [...Array(daysInMonth).keys()].map((day) => {
                            const thisSquaresDate = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                day + 1,
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds()
                            )
                            return (
                                <StyledCalendarDay
                                    key={thisSquaresDate.toISOString()}
                                    className={
                                        day === 0 ? 'first-day day' : 'day'
                                    }
                                    gridColumnStart={day === 0 && dayOfWeek + 1}
                                    past={getIsPast(thisSquaresDate)}
                                >
                                    <NavLink
                                        className="title"
                                        to={`/calendar/day/${thisSquaresDate.getDate()}/${thisSquaresDate.getMonth() + 1}/${thisSquaresDate.getFullYear()}`}
                                    >
                                        <span
                                            style={{
                                                border: getIsToday(
                                                    thisSquaresDate
                                                )
                                                    ? '2px solid var(--color-white)'
                                                    : 'none',
                                                borderRadius: '50px',
                                                padding: '5px',
                                                width: '10px',
                                                height: '10px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '0 auto',
                                            }}
                                        >
                                            {[thisSquaresDate.getDate()]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </span>
                                    </NavLink>
                                    {getDayContents(thisSquaresDate)}
                                    {!getIsPast(thisSquaresDate) && (
                                        <StyledCreateEventButton
                                            onClick={() => {
                                                setIsCreateModalOpen(true, {
                                                    defaultStart:
                                                        thisSquaresDate,
                                                })
                                            }}
                                        >
                                            <img
                                                src="/icons/add-dark.svg"
                                                alt=""
                                            />
                                        </StyledCreateEventButton>
                                    )}
                                </StyledCalendarDay>
                            )
                        })
                    }
                </ol>
            </StyledCalendar>
        </div>
    )
}
