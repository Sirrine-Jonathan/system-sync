import { useLoaderData, NavLink, useFetcher } from "@remix-run/react";
import { getTaskInList, TaskInList } from "~/services/task.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { StyledForm } from "~/components/styledParts/Form";
import { StyledButton } from "~/components/styledParts/Buttons";

export const handle = {
  title: "Edit Task",
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

  const fetcher = useFetcher();

  if (!list) {
    return <p>No task found</p>;
  }

  return (
    <section>
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasklists">Task Lists</NavLink>
        <NavLink to={`/tasklists/${list.id}`}>{list.title}</NavLink>
        <NavLink to={`/tasklists/${list.id}/task/${task.id}`}>
          {task.title}
        </NavLink>
        <NavLink
          to={`/tasklists/${list.id}/task/${task.id}/edit`}
          className="current"
        >
          Edit
        </NavLink>
      </Breadcrumbs>
      <StyledForm state={fetcher.state}>
        <fetcher.Form method="post" action={`/tasklists/${list.id}/task`}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={task.title || ""}
          />
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            defaultValue={task.notes || ""}
          ></textarea>
          <FlexContainer justifyContent="flex-end">
            <StyledButton type="submit">Save</StyledButton>
          </FlexContainer>
        </fetcher.Form>
      </StyledForm>
    </section>
  );
}
