import { type TaskListWithTasks } from "~/services/task.server";
import styled from "@emotion/styled";
import { useState } from "react";
import { Well } from "../styledParts/Well";
import { Diminished, Large, Small } from "../styledParts/Text";
import { tasks_v1 } from "googleapis";
import { Link } from "@remix-run/react";
import { StyledIconButton } from "../styledParts/Buttons";
import { FlexContainer } from "../styledParts/FlexContainer";

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  a:hover {
    text-decoration: underline;
    color: gold;
  }
`;

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
  }
`;

export const List = ({
  taskList,
  children,
}: {
  taskList: TaskListWithTasks | tasks_v1.Schema$TaskList;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Well>
      <FlexContainer
        flexDirection="column"
        gap={isOpen ? "1em" : "0"}
        justifyContent="space-between"
        alignItems="stretch"
      >
        <StyledHeader>
          <Link to={`/tasklists/${taskList.id}`}>
            <Small>
              <Diminished>Tasks from</Diminished>
            </Small>{" "}
            <Large>{taskList.title}</Large>
          </Link>
          <StyledIconButton onClick={() => setIsOpen(!isOpen)} transparent>
            <img src={isOpen ? "/icons/up.svg" : "/icons/down.svg"} alt="" />
          </StyledIconButton>
        </StyledHeader>
        <StyledList className={isOpen ? "open" : ""}>{children}</StyledList>
      </FlexContainer>
    </Well>
  );
};
