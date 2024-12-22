import { useState } from "react";
import { useLoaderData, NavLink } from "@remix-run/react";
import {
  getTaskInList,
  TaskInList,
  markComplete,
  markIncomplete,
  deleteTask,
} from "~/services/task.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";
import {
  StyledNavLink,
  StyledLink,
  StyledExternalLink,
  StyledBigLink,
} from "~/components/styledParts/Links";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import {
  IconNavButton,
  StyledBigButton,
  StyledButton,
} from "~/components/styledParts/Buttons";
import { Modal } from "~/components/Modal";
import { StyledForm } from "~/components/styledParts/Form";
import { Diminished } from "~/components/styledParts/Text";
import { ClearWell, Well } from "~/components/styledParts/Well";

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

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const { listId, taskId, action } = params;
  if (!listId) {
    throw new Error("List ID is required");
  }
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  if (action === "delete") {
    await deleteTask(request, { taskId, tasklist: listId });
    return redirect(`/tasklists/${listId}`);
  }

  if (action === "toggleStatus") {
    const task = await getTaskInList(request, { taskId, tasklist: listId });
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.status === "completed") {
      return markIncomplete(request, { taskId, tasklist: listId });
    } else {
      return markComplete(request, { taskId, tasklist: listId });
    }
  }

  return null;
};

export default function ViewTask() {
  const list = useLoaderData<TaskInList>();
  const task = list.task;

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

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
          {task.title}
        </NavLink>
      </Breadcrumbs>
      <FlexContainer
        gap="1em"
        justifyContent="flex-end"
        alignItems="center"
        padding="0 0 1em 0"
      >
        <StyledBigButton
          onClick={() => setIsDeleteConfirmationModalOpen(true)}
          danger
        >
          <span>Delete Task</span>
          <img src="/icons/trash.svg" alt="" />
        </StyledBigButton>
        <StyledBigLink to={`/tasklists/${list.id}/task/${task.id}/edit`}>
          <span>Edit Task</span>
          <img src="/icons/edit.svg" alt="" />
        </StyledBigLink>
        <StyledBigButton onClick={() => setIsScheduleModalOpen(true)}>
          <span>Schedule Task</span>
          <img src="/icons/calendar.svg" alt="" />
        </StyledBigButton>
        <Modal isOpen={isScheduleModalOpen} setIsOpen={setIsScheduleModalOpen}>
          <h2>Schedule Task</h2>
          <p>Pick a date to schedule this task</p>
          <StyledForm
            method="post"
            action={`/tasklists/${list.id}/task/${task.id}`}
          >
            <input type="hidden" name="action" value="schedule" />
            <input type="date" name="date" />
            <FlexContainer
              gap="1em"
              justifyContent="flex-end"
              alignItems="center"
              fullWidth
            >
              <StyledButton
                type="submit"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                Schedule
              </StyledButton>
              <StyledButton onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </StyledButton>
            </FlexContainer>
          </StyledForm>
        </Modal>
        <Modal
          isOpen={isDeleteConfirmationModalOpen}
          setIsOpen={setIsDeleteConfirmationModalOpen}
        >
          <h2>Delete Task</h2>
          <p>Are you sure you want to delete this task?</p>
          <FlexContainer
            gap="1em"
            justifyContent="flex-end"
            alignItems="center"
          >
            <StyledLink to={`/tasklists/${list.id}/task/${task.id}/delete`}>
              Delete
            </StyledLink>
            <StyledButton
              onClick={() => setIsDeleteConfirmationModalOpen(false)}
            >
              Cancel
            </StyledButton>
          </FlexContainer>
        </Modal>
      </FlexContainer>

      <Well>
        <h2>{task.title}</h2>
        <Diminished>{list.title}</Diminished>
      </Well>
      <ClearWell>
        <div>
          Status:
          {task.status === "needsAction" && " Needs Action"}
          {task.status === "completed" && " Completed"}
          {task.status === "deleted" && " Deleted"}
        </div>
        <FlexContainer
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <h3>Links</h3>
          {(task.links || [])
            .filter((t) => Boolean(t.link) && Boolean(t.description))
            .map(({ link, type, description }) => (
              <StyledExternalLink key={link} href={link}>
                {type}: {description}
              </StyledExternalLink>
            ))}
        </FlexContainer>

        {task.webViewLink && (
          <StyledExternalLink href={task.webViewLink}>
            Webview Link
          </StyledExternalLink>
        )}

        <h3>Notes</h3>
        <p>{task.notes}</p>

        <h3>Tags</h3>
        <p>{task.tags}</p>

        <h3>Attachments</h3>
        <p>{task.attachments}</p>

        <h3>Due Date</h3>
        <p>{task.dueDate}</p>

        <h3>Created At</h3>
        <p>{task.createdAt}</p>

        <h3>Updated At</h3>
        <p>{task.updatedAt}</p>

        <h3>JSON</h3>
        <pre>{JSON.stringify(task, null, 2)}</pre>
      </ClearWell>
    </section>
  );
}
