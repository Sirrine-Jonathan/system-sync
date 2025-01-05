import { useOutletContext } from '@remix-run/react'
import { GoogleUser } from '~/services/auth.server'
import { LoaderFunction } from '@remix-run/node'
import { calendar_v3 } from 'googleapis'
import { Event } from '~/components/Events/Event'
import {
    TaskWithListTitle,
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
import { ProgressChart } from '~/components/Tasks/ProgressChart'

export const handle = {
    title: 'Dashboard',
}

export const loader: LoaderFunction = async () => {
    return null
}

export default function Dashboard() {
    const { user, events, lists } = useOutletContext<{
        user: GoogleUser
        events: calendar_v3.Schema$Event[]
        lists: TaskListWithTasks[]
    }>()

    const todayEvents = events.filter((event) => {
        const todaysDate = new Date()

        const start = new Date(event.start!.dateTime || event.start!.date || '')
        const end = new Date(event.end!.dateTime || event.end!.date || '')

        const startsOnToday =
            start.getDate() === todaysDate.getDate() &&
            start.getMonth() === todaysDate.getMonth() &&
            start.getFullYear() === todaysDate.getFullYear()

        const endsOnToday =
            end.getDate() === todaysDate.getDate() &&
            end.getMonth() === todaysDate.getMonth() &&
            end.getFullYear() === todaysDate.getFullYear()

        return startsOnToday || endsOnToday
    })

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
                                {user.displayName}
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
                                    You have {todayEvents.length} event
                                    {todayEvents.length === 1 ? '' : 's'} today
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
                {todayEvents.length > 0 && (
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
                            {todayEvents.map((event) => (
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
                        <h2>
                            Tasks (
                            {lists.reduce(
                                (acc, list) => acc + list.tasks?.length,
                                0
                            )}
                            )
                        </h2>
                        <ProgressChart lists={lists as TaskListWithTasks[]} />
                        <GridContainer gap="1em">
                            {lists.map((list) => (
                                <List
                                    key={list.id}
                                    taskList={list as TaskListWithTasks}
                                    allLists={lists}
                                >
                                    {list.tasks.map((task) => (
                                        <li key={task.id}>
                                            <TaskRow
                                                task={task as TaskWithListTitle}
                                                showListName
                                            />
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
