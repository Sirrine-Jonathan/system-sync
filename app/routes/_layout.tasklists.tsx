import { useLoaderData, NavLink } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { getListsWithTasks, TaskListWithTasks } from '~/services/task.server'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import { StyledIconLink } from '~/components/styledParts/Links'
import { ListBlock } from '~/components/Tasks/ListBlock'
import { GridContainer } from '~/components/styledParts/GridContainer'

export const handle = {
    title: 'Task Lists',
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return await getListsWithTasks(request)
}

export default function Tasklist() {
    const lists = useLoaderData<TaskListWithTasks[]>()

    return (
        <section id="tasklist">
            <Breadcrumbs
                actions={[
                    <StyledIconLink key="all" to="/tasklists/all">
                        <span>View All Tasks</span>
                        <img src="/icons/task.svg" alt="" />
                    </StyledIconLink>,
                    <StyledIconLink key="new" to={`/tasklists/new`}>
                        <span>Create List</span>
                        <img src="/icons/plus.svg" alt="" />
                    </StyledIconLink>,
                ]}
            >
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists" className="current">
                    Task Lists
                </NavLink>
            </Breadcrumbs>

            <GridContainer templateColumns="repeat(auto-fill, minmax(min(100%, 300px), 1fr))">
                {lists.map((list) => (
                    <ListBlock key={list.id} list={list} />
                ))}
            </GridContainer>
        </section>
    )
}
