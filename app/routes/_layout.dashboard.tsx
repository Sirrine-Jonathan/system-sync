import { useOutletContext } from '@remix-run/react'
import { GoogleUser } from '~/services/auth.server'
import { LoaderFunction } from '@remix-run/node'
import { calendar_v3 } from 'googleapis'
import { Event } from '~/components/Events/Event'
import {
    TaskWithListTitle,
    type TaskListWithTasks,
} from '~/services/task.server'
import { Section } from '~/components/styledParts/Text'
import { Well } from '~/components/styledParts/Well'
import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { GridContainer } from '~/components/styledParts/GridContainer'
import { TaskRow } from '~/components/Tasks/TaskRow'
import { List } from '~/components/Tasks/List'
import { StyledIconLink } from '~/components/styledParts/Links'
import { CreateModalButton } from '~/components/CreateModal'
import { ProgressChart } from '~/components/Tasks/ProgressChart'
import { MonthView } from '~/components/Events/MonthView'

export const handle = {
    title: 'Dashboard',
}

export const loader: LoaderFunction = async () => {
    return null
}

export default function Dashboard() {
    const { events, lists } = useOutletContext<{
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
                <FlexContainer
                    justifyContent="space-between"
                    alignItems="center"
                    fullWidth
                >
                    <StyledIconLink to="/calendar/month">
                        <img src="/icons/calendar.svg" alt="" />
                        <span className="badge">
                            Events ({todayEvents.length})
                        </span>
                    </StyledIconLink>
                    <StyledIconLink to="/tasklists">
                        <img src="/icons/task.svg" alt="" />
                        <span className="badge">Tasks ({numberOfTasks})</span>
                    </StyledIconLink>
                    <CreateModalButton lists={lists}>
                        <span className="badge">Create</span>
                    </CreateModalButton>
                </FlexContainer>
                {numberOfTasks && (
                    <div>
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
                <MonthView events={events || []} />
            </Section>
        </main>
    )
}
