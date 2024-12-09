import type { THydratedTaskModel } from "~/services/task.server";
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

export const Task = ({ task }: { task: THydratedTaskModel }) => {
  return (
    <StyledWell>
      <div className="taskName">{task.name}</div>
      <div className="taskDescription">{task.description}</div>
      <div className="taskDuration">{task.duration}</div>
    </StyledWell>
  );
};
