import type { TaskInList } from "~/services/task.server";
import { Well } from "~/components/styledParts/Well";
import styled from "@emotion/styled";

const StyledWell = styled(Well)`
  .taskName {
    font-weight: bold;
    font-size: 0.8em;
  }

  .taskDescription {
    font-size: 1.2em;
    font-style: italic;
  }
`;

export const Task = ({ task }: { task: TaskInList }) => {
  return (
    <StyledWell>
      <div className="taskName">{task.title}</div>
    </StyledWell>
  );
};
