import { useLoaderData, NavLink, useFetcher } from "@remix-run/react";
import { getListById, createTask } from "~/services/task.server";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";
import { StyledForm } from "~/components/styledParts/Form";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { tasks_v1 } from "googleapis";
import { StyledButton } from "~/components/styledParts/Buttons";

export const handle = {
  title: "Task",
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { listId } = params;
  if (!listId) {
    throw new Error("List ID is required");
  }
  try {
    return await getListById(request, listId);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { listId } = params;
  if (!listId) {
    throw new Error("List ID is required");
  }
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;
    if (!title) {
      throw new Error("Title is required");
    }
    await createTask(request, { tasklist: listId, title, notes });

    return redirect(`/tasklists/${listId}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function ViewTask() {
  const list = useLoaderData<tasks_v1.Schema$TaskList>();
  const fetcher = useFetcher();
  return (
    <section>
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasklists">Task Lists</NavLink>
        <NavLink to={`/tasklists/${list.id}`}>{list.title}</NavLink>
        <NavLink to={`/tasklists/${list.id}/task/new`} className="current">
          New
        </NavLink>
      </Breadcrumbs>
      <h2>Create a new task for {list.title}</h2>
      <StyledForm state={fetcher.state}>
        <fetcher.Form method="post" action={`/tasklists/${list.id}/new`}>
          <label htmlFor="title">Title</label>
          <input id="title" type="text" name="title" />
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" />
          <StyledButton type="submit">Create</StyledButton>
        </fetcher.Form>
      </StyledForm>
    </section>
  );
}
