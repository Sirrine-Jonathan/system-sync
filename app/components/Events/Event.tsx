import { useState } from 'react'
import type { calendar_v3 } from 'googleapis'
import styled from '@emotion/styled'
import { NavLink, useLocation, useNavigate } from '@remix-run/react'
import { Well } from '../styledParts/Well'
import { FlexContainer } from '../styledParts/FlexContainer'
import {
    Callout,
    CalloutContent,
    CalloutTrigger,
    CalloutAction,
} from '../Callout'
import { DeleteEventConfirmation } from './DeleteEventConfirmation'
import { Strikethrough } from '../styledParts/Text'
import { useCreateModalContext } from '../CreateModal'
import { StyledNavLink } from '../styledParts/Links'

const StyledEvent = styled(Well)<{ past: boolean }>`
  position: relative;
  background: {({ past }) => (past ? "purple" : "red")} !important;

  .summary {
    display: block;
    font-size: 0.8rem;
    color: var(--accent-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .timeDetails {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    margin-right: 1.5rem;
    margin-bottom: 0.5rem;

    p {
      margin: 0;

      &.date,
      &.time {
        font-size: 0.6rem;
      }
    }
  }

  h2 {
    font-size: 1.2rem;
    margin: 15px 0 0;
    text-align: center;

    a {
      color: var(--color-white);
      text-decoration: none;
      color: var(--accent-color);
    }
  }

  .eventHeader {
    border-bottom: 1px solid var(--color-white);
    padding-bottom: 5px;
    margin-bottom: 5px;
  }

  .callout {
    position: absolute;
    top: 5px;
    right: 5px;
  }
`

const StyledDetails = styled.div`
    margin-top: 1rem;
    a {
        color: var(--color-white);
        word-break: break-all;

        &:hover {
            color: var(--accent-color);
        }

        img {
            margin-left: 0.5rem;
            width: 1rem;
        }
    }
`

export const Event = ({
    event,
    expanded = false,
    skipDate = false,
    calloutDirection = 'top',
}: {
    event: calendar_v3.Schema$Event
    expanded?: boolean
    skipDate?: boolean
    calloutDirection?: 'top' | 'bottom' | 'left' | 'right'
}) => {
    const { setIsCreateModalOpen } = useCreateModalContext()
    const location = useLocation()
    const navigate = useNavigate()
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
        useState(false)

    const start = new Date(event.start?.dateTime || event.start?.date || '')
    const end = new Date(event.end?.dateTime || event.end?.date || '')

    const isAllDay = !event.start?.dateTime && !event.end?.dateTime

    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const months = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
    ]
    const startDay = days[start.getDay()]
    const startMonth = months[start.getMonth()]

    const endDay = days[end.getDay()]
    const endMonth = months[end.getMonth()]

    const title = (
        isAllDay
            ? [
                  endDay?.toLocaleUpperCase(),
                  endMonth?.toLocaleUpperCase(),
                  end.getDate(),
              ]
            : [
                  startDay?.toLocaleUpperCase(),
                  startMonth?.toLocaleUpperCase(),
                  start.getDate(),
              ]
    )
        .filter(Boolean)
        .join(' ')

    const pastTime = new Date(end)
    pastTime.setHours(23, 59, 59, 999)
    pastTime.setMinutes(59, 59, 999)
    pastTime.setSeconds(59, 999)

    const isPastDate = pastTime.getTime() < Date.now()

    return (
        <StyledEvent className={`event ${startDay}`} past={isPastDate}>
            <DeleteEventConfirmation
                isOpen={isDeleteConfirmModalOpen}
                setIsOpen={setIsDeleteConfirmModalOpen}
                event={event}
            />
            <FlexContainer
                justifyContent="space-between"
                alignItems="center"
                className="eventHeader"
            >
                <div className="timeDetails">
                    {!skipDate && <p className="date">{title}</p>}
                    <p className="time">
                        {isAllDay
                            ? 'All day'
                            : [
                                  start.toLocaleTimeString(),
                                  end.toLocaleTimeString(),
                              ].join(' - ')}
                    </p>
                </div>
                <Callout>
                    <CalloutTrigger>
                        <img src="/icons/menu.svg" alt="" />
                    </CalloutTrigger>
                    <CalloutContent
                        preferredDirection={calloutDirection || 'top'}
                    >
                        <CalloutAction
                            onClick={() => setIsDeleteConfirmModalOpen(true)}
                        >
                            <img src="/icons/delete.svg" alt="" />
                            Delete
                        </CalloutAction>
                        <CalloutAction
                            onClick={() => navigate(`/event/${event.id}/edit`)}
                        >
                            <img src="/icons/edit.svg" alt="" />
                            Edit
                        </CalloutAction>
                        <CalloutAction
                            onClick={() =>
                                setIsCreateModalOpen(true, {
                                    type: 'event',
                                    defaultStart: new Date(
                                        event.start?.dateTime ||
                                            event.start?.date ||
                                            ''
                                    ),
                                })
                            }
                        >
                            <img src="/icons/add.svg" alt="" />
                            Create
                        </CalloutAction>
                    </CalloutContent>
                </Callout>
            </FlexContainer>
            <StyledNavLink
                to={`/event/${event.id}`}
                className="summary"
                state={{ returnUrl: location.pathname }}
            >
                {isPastDate && <Strikethrough>{event.summary}</Strikethrough>}
                {!isPastDate && event.summary}
            </StyledNavLink>
            {expanded && (
                <>
                    <StyledDetails
                        dangerouslySetInnerHTML={{
                            __html: event.description || '',
                        }}
                    />
                    <StyledDetails>
                        {event.htmlLink && (
                            <a href={event.htmlLink}>
                                View on Google Calendar{' '}
                                <img src="/icons/external-link.svg" alt="" />
                            </a>
                        )}
                    </StyledDetails>
                </>
            )}
        </StyledEvent>
    )
}
