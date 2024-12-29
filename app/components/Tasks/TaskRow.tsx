import { useState } from "react";
import { TaskWithListTitle } from "~/services/task.server";
import {
  FlexContainer,
  type FlexContainerProps,
} from "../styledParts/FlexContainer";
import styled from "@emotion/styled";
import { Diminished, Small, Strikethrough } from "../styledParts/Text";
import { ToggleTaskCheckbox } from "./Toggle";
import { StyledIconButton } from "../styledParts/Buttons";
import { DeleteTaskConfirmation } from "./DeleteTaskConfirmation";
import { StyledNavLink } from "../styledParts/Links";

const StyledRow = styled(FlexContainer)`
  .taskListTitle {
    font-size: 0.8rem;
  }

  .taskContainer {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1),
      rgba(255, 255, 255, 0.2)
    );
    color: var(--color-white);
    text-decoration: none;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    text-align: right;
    margin-right: 1rem;
  }

  .deleteTask {
    flex-shrink: 0;
  }
`;

export const TaskRow = ({
  task,
  showListName,
  ...props
}: {
  task: TaskWithListTitle;
  showListName?: boolean;
} & FlexContainerProps) => {
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  return (
    <StyledRow justifyContent="space-between" alignItems="center" {...props}>
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
            {task.status === "completed" ? (
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
      <StyledIconButton
        onClick={() => setIsDeleteConfirmationOpen(true)}
        context="danger"
        className="deleteTask"
      >
        <img src="/icons/delete.svg" alt="" />
      </StyledIconButton>
      <DeleteTaskConfirmation
        isOpen={isDeleteConfirmationOpen}
        setIsOpen={setIsDeleteConfirmationOpen}
        task={task}
      />
    </StyledRow>
  );
};
