import { useLoaderData, NavLink } from "@remix-run/react";
import { getTaskInList, TaskInList } from "~/services/task.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { IconNavLink } from "~/components/styledParts/Links";
import { FlexContainer } from "~/components/styledParts/FlexContainer";

export const handle = {
  title: "Task",
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { listId, taskId } = params;
  if (!listId) {
    throw new Error("List ID is required");
  }
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  try {
    return await getTaskInList(request, { taskId, tasklist: listId });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function ViewTask() {
  const list = useLoaderData<TaskInList>();
  const task = list.task;

  if (!list) {
    return <p>No task found</p>;
  }

  return (
    <section>
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasklists">Task Lists</NavLink>
        <NavLink to={`/tasklists/${list.id}`}>{list.title}</NavLink>
        <NavLink
          to={`/tasklists/${list.id}/task/${task.id}`}
          className="current"
        >
          {task.title} - Edit
        </NavLink>
      </Breadcrumbs>
      <FlexContainer justifyContent="space-between" alignItems="center">
        <h1>{task.title}</h1>
        <div className="sectionRight">
          <IconNavLink to={`/tasklists/${list.id}/task/${task.id}`}>
            <img src="/icons/close.svg" alt="" />
          </IconNavLink>
        </div>
      </FlexContainer>
    </section>
  );
}
