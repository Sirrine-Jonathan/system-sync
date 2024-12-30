import { useState } from 'react'
import { useLoaderData, NavLink } from '@remix-run/react'
import { getTaskInList, TaskInList } from '~/services/task.server'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Breadcrumbs } from '~/components/Nav/Breadcrumbs'
import {
    StyledExternalLink,
    StyledIconLink,
} from '~/components/styledParts/Links'
import { FlexContainer } from '~/components/styledParts/FlexContainer'
import { StyledIconButton } from '~/components/styledParts/Buttons'
import { Modal } from '~/components/Modal'
import { Diminished, Small } from '~/components/styledParts/Text'
import { Well } from '~/components/styledParts/Well'
import { DeleteTaskConfirmation } from '~/components/Tasks/DeleteTaskConfirmation'
import { ScheduleTaskForm } from '~/components/Tasks/ScheduleTaskForm'

export const handle = {
    title: 'Task',
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { listId, taskId } = params
    if (!listId) {
        throw new Error('List ID is required')
    }
    if (!taskId) {
        throw new Error('Task ID is required')
    }
    try {
        return await getTaskInList(request, { taskId, tasklist: listId })
    } catch (error) {
        console.error(error)
        return null
    }
}

export default function ViewTask() {
    const list = useLoaderData<TaskInList>()
    const task = list.task

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
        useState(false)

    console.log({ task })

    return (
        <section>
            <Breadcrumbs
                actions={[
                    <StyledIconButton
                        onClick={() => setIsDeleteConfirmationModalOpen(true)}
                        danger
                    >
                        <span>Delete Task</span>
                        <img src="/icons/delete.svg" alt="" />
                    </StyledIconButton>,
                    <StyledIconLink
                        to={`/tasklists/${list.id}/task/${task.id}/edit`}
                    >
                        <span>Edit Task</span>
                        <img src="/icons/edit.svg" alt="" />
                    </StyledIconLink>,
                    <StyledIconButton
                        onClick={() => setIsScheduleModalOpen(true)}
                    >
                        <span>Schedule Task</span>
                        <img src="/icons/calendar.svg" alt="" />
                    </StyledIconButton>,
                ]}
            >
                <DeleteTaskConfirmation
                    isOpen={isDeleteConfirmationModalOpen}
                    setIsOpen={setIsDeleteConfirmationModalOpen}
                    task={task}
                />
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/tasklists">Task Lists</NavLink>
                <NavLink to={`/tasklists/${list.id}`}>{list.title}</NavLink>
                <NavLink
                    to={`/tasklists/${list.id}/task/${task.id}`}
                    className="current"
                >
                    {task.title}
                </NavLink>
            </Breadcrumbs>
            <Modal
                isOpen={isScheduleModalOpen}
                setIsOpen={setIsScheduleModalOpen}
                title="Schedule Task"
            >
                <ScheduleTaskForm listId={list.id} taskId={task.id} />
            </Modal>
            <FlexContainer
                flexDirection="column"
                alignItems="stretch"
                gap="1em"
            >
                <Well>
                    <h2>{task.title}</h2>

                    <FlexContainer
                        flexDirection="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        gap="1rem"
                    >
                        <div>List: {list.title}</div>
                        <div>
                            Status:
                            {task.status === 'needsAction' && ' Needs Action'}
                            {task.status === 'completed' && ' Completed'}
                            {task.status === 'deleted' && ' Deleted'}
                        </div>
                        <div></div>
                        {(task.links || [])
                            .filter(
                                (t) => Boolean(t.link) && Boolean(t.description)
                            )
                            .map(({ link, type, description }) => (
                                <StyledExternalLink key={link} href={link}>
                                    {type}: {description}
                                </StyledExternalLink>
                            ))}
                        {task.webViewLink && (
                            <StyledExternalLink href={task.webViewLink}>
                                Webview Link
                            </StyledExternalLink>
                        )}
                        <Diminished>
                            <Small>{task.updated}</Small>
                        </Diminished>
                    </FlexContainer>
                </Well>

                <Well>
                    <p>{task.notes}</p>
                </Well>

                <h3>Due Date</h3>
                <p>{task.due}</p>
            </FlexContainer>
        </section>
    )
}
