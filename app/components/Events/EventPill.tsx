import { NavLink, useLocation } from '@remix-run/react'
import { calendar_v3 } from 'googleapis'
import { colorIdMap } from './EventDot'
import styled from '@emotion/styled'
const StyledEventPill = styled(NavLink)<{
    backgroundColor: string
    textColor: string
}>`
    width: 100%;
    max-width: 100%;
    border-radius: 5px;
    background-color: ${({ backgroundColor }) => backgroundColor};
    color: ${({ textColor }) => textColor};
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 9px;
    text-decoration: none;
    padding: 1px 5px;
    box-sizing: border-box;
    overflow: hidden;
`

const contrastingColor = (color: string) => {
    const r = parseInt(color.substring(1, 3), 16)
    const g = parseInt(color.substring(3, 5), 16)
    const b = parseInt(color.substring(5, 7), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? '#000000' : '#FFFFFF'
}

export const EventPill = ({ event }: { event: calendar_v3.Schema$Event }) => {
    const location = useLocation()
    const backgroundColor = event.colorId
        ? colorIdMap?.[event.colorId] || '#FFFFFF'
        : '#FFFFFF'
    const textColor = contrastingColor(backgroundColor)
    return (
        <StyledEventPill
            to={`/event/${event.id}`}
            backgroundColor={backgroundColor}
            textColor={textColor}
            state={{ returnUrl: location.pathname }}
        >
            {event.summary}
        </StyledEventPill>
    )
}
