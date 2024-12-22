import { Link } from "@remix-run/react";
import { Diminished, Small } from "../styledParts/Text";
import { Well } from "../styledParts/Well";
import { FlexContainer } from "../styledParts/FlexContainer";
import { TaskListWithTasks } from "~/services/task.server";

export const ListBlock = ({ list }: { list: TaskListWithTasks }) => {
  return (
    <Well>
      <FlexContainer
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Link to={`/tasklists/${list.id}`}>{list.title}</Link>
        {list.tasks.length > 0 && (
          <Diminished>
            <Small>{list.tasks.length} tasks</Small>
          </Diminished>
        )}
      </FlexContainer>
    </Well>
  );
};
