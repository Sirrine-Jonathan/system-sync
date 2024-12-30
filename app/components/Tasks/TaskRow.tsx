import { useState } from 'react'
import { TaskWithListTitle } from '~/services/task.server'
import {
    FlexContainer,
    type FlexContainerProps,
} from '../styledParts/FlexContainer'
import styled from '@emotion/styled'
import { Diminished, Small, Strikethrough } from '../styledParts/Text'
import { ToggleTaskCheckbox } from './Toggle'
import { StyledIconButton } from '../styledParts/Buttons'
import { DeleteTaskConfirmation } from './DeleteTaskConfirmation'
import { StyledIconLink, StyledNavLink } from '../styledParts/Links'

const StyledRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    .taskListTitle {
        font-size: 0.8rem;
    }

    .taskContainer {
        border-radius: 15px;
        color: var(--color-white);
        text-decoration: none;
        padding: 0.5rem 1rem;
        width: 100%;
        text-align: right;
        margin: 0 1rem;
    }
`

export const TaskRow = ({
    task,
    showListName,
}: {
    task: TaskWithListTitle
    showListName?: boolean
} & FlexContainerProps) => {
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
        useState(false)
    return (
        <StyledRow>
            <ToggleTaskCheckbox task={task} />
            <div className="taskContainer">
                <FlexContainer
                    flexDirection="column"
                    alignItems="flex-end"
                    justifyContent="stretch"
                >
                    <StyledNavLink
                        to={`/tasklists/${task.listId}/task/${task.id}`}
                        className="taskTitle"
                    >
                        {task.status === 'completed' ? (
                            <Strikethrough>{task.title}</Strikethrough>
                        ) : (
                            task.title
                        )}
                    </StyledNavLink>
                    {showListName && (
                        <StyledNavLink
                            to={`/tasklists/${task.listId}`}
                            className="taskListTitle"
                        >
                            <Small>
                                <Diminished>{task.listTitle}</Diminished>
                            </Small>
                        </StyledNavLink>
                    )}
                </FlexContainer>
            </div>
            <FlexContainer gap="1em" alignItems="center">
                <StyledIconLink
                    to={`/tasklists/${task.listId}/task/${task.id}/edit`}
                    block
                >
                    <img src="/icons/edit.svg" alt="" />
                </StyledIconLink>
                <StyledIconButton
                    onClick={() => setIsDeleteConfirmationOpen(true)}
                    context="danger"
                >
                    <img src="/icons/delete.svg" alt="" />
                </StyledIconButton>
                <DeleteTaskConfirmation
                    isOpen={isDeleteConfirmationOpen}
                    setIsOpen={setIsDeleteConfirmationOpen}
                    task={task}
                />
            </FlexContainer>
        </StyledRow>
    )
}
