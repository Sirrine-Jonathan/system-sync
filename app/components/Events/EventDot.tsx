import { NavLink, useLocation } from '@remix-run/react'
import { calendar_v3 } from 'googleapis'

export const colorIdMap: { [key: string]: string } = {
    1: '#FF0000',
    2: '#00FF00',
    3: '#0000FF',
    4: '#FFFF00',
    5: '#FF00FF',
    6: '#00FFFF',
    7: '#000000',
    8: '#FFFFFF',
}
export const EventDot = ({ event }: { event: calendar_v3.Schema$Event }) => {
    const location = useLocation()
    return (
        <NavLink
            to={`/event/${event.id}`}
            state={{ returnUrl: location.pathname }}
            style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: event.colorId
                    ? `${colorIdMap[event.colorId]}`
                    : 'black',
            }}
        />
    )
}
