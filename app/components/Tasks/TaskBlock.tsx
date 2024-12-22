import { Well } from "../styledParts/Well";
import { FlexContainer } from "../styledParts/FlexContainer";
import { Diminished, Small } from "../styledParts/Text";
import { TaskWithListTitle } from "~/services/task.server";
import { StyledLink } from "../styledParts/Links";

export const TaskBlock = ({ task }: { task: TaskWithListTitle }) => {
  return (
    <Well key={task.id}>
      <FlexContainer
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="space-between"
        gap="1em"
        fullHeight
      >
        <StyledLink to={`/tasklists/${task.listId}/task/${task.id}`}>
          {task.title}
        </StyledLink>
        <StyledLink to={`/tasklists/${task.listId}`}>
          <Diminished>
            <Small>{task.listTitle}</Small>
          </Diminished>
        </StyledLink>
      </FlexContainer>
    </Well>
  );
};
