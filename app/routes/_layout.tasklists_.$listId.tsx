import { NavLink, useLoaderData } from "@remix-run/react";
import {
  getListByIdWithTasks,
  TaskListWithTasks,
} from "~/services/task.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { StyledBigLink } from "~/components/styledParts/Links";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { TaskRow } from "~/components/Tasks/TaskRow";
import { Well } from "~/components/styledParts/Well";

export const handle = {
  title: "Tasks List",
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { listId } = params;

  if (!listId) {
    throw new Error("List ID is required");
  }

  const list = await getListByIdWithTasks(request, listId);

  return { list };
};

export default function ViewTask() {
  const { list } = useLoaderData<{
    list: TaskListWithTasks;
  }>();

  return (
    <section>
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasklists">Task Lists</NavLink>
        <NavLink to={`/tasklists/${list.id}`} className="current">
          {list.title}
        </NavLink>
      </Breadcrumbs>
      <FlexContainer
        gap="1em"
        alignItems="center"
        justifyContent="flex-end"
        padding="0 0 1em 0"
      >
        <StyledBigLink to={`/tasklists/${list.id}/delete`}>
          <span>Delete List</span>
          <img src="/icons/delete.svg" alt="" />
        </StyledBigLink>
        <StyledBigLink to={`/tasklists/${list.id}/edit`}>
          <span>Edit List</span>
          <img src="/icons/edit.svg" alt="" />
        </StyledBigLink>
        <StyledBigLink to={`/tasklists/${list.id}/new`}>
          <span>Create Task</span>
          <img src="/icons/plus.svg" alt="" />
        </StyledBigLink>
      </FlexContainer>
      <Well>
        <FlexContainer flexDirection="column" alignItems="flex-end" gap="0.5em">
          {list.tasks.length > 0 &&
            list.tasks.map((task) => (
              <TaskRow key={task.id} task={task} fullWidth />
            ))}
          <StyledBigLink to={`/tasklists/${list.id}/new`}>
            <span>Create Task</span>
            <img src="/icons/plus.svg" alt="" />
          </StyledBigLink>
        </FlexContainer>
      </Well>
    </section>
  );
}
