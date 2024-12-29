import { Link } from "@remix-run/react";
import { Diminished, Small } from "../styledParts/Text";
import { Well } from "../styledParts/Well";
import { FlexContainer } from "../styledParts/FlexContainer";
import { TaskListWithTasks } from "~/services/task.server";
import { StyledNavLink } from "../styledParts/Links";

export const ListBlock = ({ list }: { list: TaskListWithTasks }) => {
  return (
    <Well>
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <FlexContainer
          justifyContent="space-between"
          alignItems="center"
          gap="1em"
          fullWidth
        >
          <StyledNavLink to={`/tasklists/${list.id}`}>
            {list.title}
          </StyledNavLink>
          <FlexContainer gap="1em">
            <StyledNavLink to={`/tasklists/${list.id}/edit`}>
              <img src="/icons/edit.svg" alt="" />
            </StyledNavLink>
            <StyledNavLink to={`/tasklists/${list.id}/new`}>
              <img src="/icons/plus.svg" alt="" />
            </StyledNavLink>
          </FlexContainer>
        </FlexContainer>
        {list.tasks.length > 0 && (
          <Diminished>
            <Small>{list.tasks.length} tasks</Small>
          </Diminished>
        )}
      </FlexContainer>
    </Well>
  );
};
