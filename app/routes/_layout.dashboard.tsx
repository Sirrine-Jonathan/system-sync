import { useLoaderData, useOutletContext } from '@remix-run/react'
import { authenticator, GoogleUser } from '~/services/auth.server'
import { LoaderFunction } from '@remix-run/node'
import { getRangeMinMax } from '~/utils/time'
import { getEvents } from '~/services/event.server'
import { calendar_v3 } from 'googleapis'
import { Event } from '~/components/Events/Event'
import {
    getListsWithTasks,
    type TaskListWithTasks,
} from '~/services/task.server'
import { Section, Large, Highlight, Small } from '~/components/styledParts/Text'
import { Well } from '~/components/styledParts/Well'
import { DateTime } from '~/components/DateTime'
import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { GridContainer } from '~/components/styledParts/GridContainer'
import { TaskRow } from '~/components/Tasks/TaskRow'
import { List } from '~/components/Tasks/List'
import { StyledIconLink, StyledNavLink } from '~/components/styledParts/Links'
import { CreateModalButton } from '~/components/CreateModal'

export const handle = {
    title: 'Dashboard',
}

export const loader: LoaderFunction = async ({ request }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: '/auth/signin',
    })

    const url = new URL(request.url)
    const timezone = url.searchParams.get('tz') || 'UTC'
    new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
    }).formatRange(new Date(), new Date())
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const { dayMin, dayMax } = getRangeMinMax(
        new Date(Number(year), Number(month) - 1, Number(day))
    )

    const events = await getEvents(request, {
        timeMin: dayMin.toISOString(),
        timeMax: dayMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })

    const lists = await getListsWithTasks(request)

    return { events, lists }
}

export default function Dashboard() {
    const { displayName } = useOutletContext<GoogleUser>()

    const { events, lists } = useLoaderData<{
        events: calendar_v3.Schema$Event[]
        lists: TaskListWithTasks[]
    }>()

    const numberOfTasks = lists
        ? lists.reduce((acc, list) => acc + list.tasks?.length, 0)
        : 0

    return (
        <main>
            <Section>
                <Well>
                    <FlexContainer
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <FlexContainer
                            flexDirection="column"
                            alignItems="flex-start"
                            gap="1em"
                        >
                            <Large>
                                <Small>Hello, </Small>
                                {displayName}
                            </Large>
                            <DateTime />
                        </FlexContainer>
                        <CreateModalButton lists={lists} />
                    </FlexContainer>
                </Well>
                <hr />
                <Well>
                    <FlexContainer
                        justifyContent="space-between"
                        alignItems="center"
                        fullWidth
                    >
                        <FlexContainer gap="1em">
                            <StyledIconLink to="/calendar/month">
                                <img src="/icons/calendar.svg" alt="" />
                            </StyledIconLink>
                            {events.length === 0 ? (
                                <div>You have no events today</div>
                            ) : (
                                <div>
                                    You have {events.length} event
                                    {events.length === 1 ? '' : 's'} today
                                </div>
                            )}
                        </FlexContainer>
                        <StyledNavLink to="/calendar/month">
                            <Highlight>View Calendar</Highlight>
                        </StyledNavLink>
                    </FlexContainer>
                    <hr />
                    <FlexContainer
                        justifyContent="space-between"
                        alignItems="center"
                        fullWidth
                    >
                        <FlexContainer gap="1em">
                            <StyledIconLink to="/tasklists">
                                <img src="/icons/task.svg" alt="" />
                            </StyledIconLink>
                            {numberOfTasks === 0 ? (
                                <div>You have no tasks</div>
                            ) : (
                                <div>
                                    You have {numberOfTasks} task
                                    {numberOfTasks === 1 ? '' : 's'}.
                                </div>
                            )}
                        </FlexContainer>
                        <StyledNavLink to="/tasklists">
                            <Highlight>View Tasks</Highlight>
                        </StyledNavLink>
                    </FlexContainer>
                </Well>
                <hr />
                {events.length > 0 && (
                    <div>
                        <FlexContainer
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <h2>Events</h2>
                            <div>{new Date().toLocaleDateString()}</div>
                        </FlexContainer>
                        <FlexContainer
                            flexDirection="column"
                            gap="1em"
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
                        <hr />
                    </div>
                )}
                {numberOfTasks && (
                    <div>
                        <FlexContainer
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <h2>
                                Tasks (
                                {lists.reduce(
                                    (acc, list) => acc + list.tasks?.length,
                                    0
                                )}
                                )
                            </h2>
                        </FlexContainer>
                        <GridContainer gap="1em">
                            {lists.map((list) => (
                                <List key={list.id} taskList={list}>
                                    {list.tasks.map((task) => (
                                        <li key={task.id}>
                                            <TaskRow task={task} showListName />
                                        </li>
                                    ))}
                                </List>
                            ))}
                        </GridContainer>
                    </div>
                )}
            </Section>
        </main>
    )
}
