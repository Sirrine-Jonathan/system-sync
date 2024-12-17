import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { deleteTask } from "~/services/task.server";
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { listId, taskId } = params;
  if (!listId) {
    throw new Error("List ID is required");
  }
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  await deleteTask(request, { taskId, tasklist: listId });
  return redirect(`/tasklists/${listId}`);
};
