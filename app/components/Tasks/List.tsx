import { type TaskListWithTasks } from '~/services/task.server'
import styled from '@emotion/styled'
import { useState } from 'react'
import { Well } from '../styledParts/Well'
import { Small, Large, Highlight, Diminished } from '../styledParts/Text'
import { tasks_v1 } from 'googleapis'
import { Link } from '@remix-run/react'
import { StyledIconButton } from '../styledParts/Buttons'
import { FlexContainer } from '../styledParts/FlexContainer'
import { CreateModalButton } from '../CreateModal'
import { PieChart } from 'react-minimal-pie-chart'
import { ListChart } from './ProgressChart'

const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
        text-decoration: none;
        color: var(--color-white);
    }

    a:hover {
        text-decoration: underline;
        color: var(--accent-color);
    }
`

const StyledList = styled.ul`
    height: 0;
    overflow: hidden;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &.open {
        height: auto;
        overflow: visible;
    }
`

export const List = ({
    taskList,
    allLists,
    children,
}: {
    taskList: TaskListWithTasks
    allLists: TaskListWithTasks[]
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const totalTasks = taskList?.tasks.length || 0
    const completedTasks = taskList?.tasks.filter(
        (task: tasks_v1.Schema$Task) => task.status === 'completed'
    )
    const percentage = completedTasks?.length / totalTasks

    return (
        <Well>
            <FlexContainer
                flexDirection="column"
                gap={isOpen ? '1em' : '0'}
                justifyContent="space-between"
                alignItems="stretch"
            >
                <StyledHeader>
                    <FlexContainer gap="1em">
                        <ListChart list={taskList} />
                        <FlexContainer
                            flexDirection="column"
                            alignItems="flex-start"
                        >
                            <Link to={`/tasklists/${taskList.id}`}>
                                <Large style={{ marginRight: '0.5em' }}>
                                    {taskList.title}
                                </Large>
                                <Highlight key="percentage">
                                    {Math.round(percentage * 100)}%
                                </Highlight>
                            </Link>
                            <Small>
                                <Diminished>{totalTasks} tasks</Diminished>
                            </Small>
                        </FlexContainer>
                    </FlexContainer>
                    <StyledIconButton
                        onClick={() => setIsOpen(!isOpen)}
                        context="transparent"
                    >
                        <img
                            src={isOpen ? '/icons/up.svg' : '/icons/down.svg'}
                            alt=""
                        />
                    </StyledIconButton>
                </StyledHeader>
                <StyledList className={isOpen ? 'open' : ''}>
                    {children}
                    <FlexContainer justifyContent="flex-end">
                        <CreateModalButton
                            lists={allLists}
                            defaultTaskId={taskList.id}
                        />
                    </FlexContainer>
                </StyledList>
            </FlexContainer>
        </Well>
    )
}
