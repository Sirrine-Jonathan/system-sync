import { NavLink, Outlet, useLoaderData, useParams } from "@remix-run/react";
import {
  getListByIdWithTasks,
  TaskListWithTasks,
} from "~/services/task.server";
import { tasks_v1 } from "googleapis";
import { LoaderFunctionArgs } from "@remix-run/node";
import styled from "@emotion/styled";
import { IconNavLink } from "~/components/styledParts/Links";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { FlexContainer } from "~/components/styledParts/FlexContainer";

export const handle = {
  title: "Tasks List",
};

const StyledTask = styled(NavLink)<{ status?: string | null | undefined }>`
  display: flex;
  align-items: center;

  label {
    span {
      display: none;
    }

    .visualCheck {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 100px;
      background: transparent;
      cursor: pointer;
      margin: 0 2rem 0 1rem;
      border: 1px solid #fff;

      &.checked {
        background: #fff;
      }
    }

    input[type="checkbox"] {
      display: none;
    }
  }

  .taskContainer {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: #000;
    color: #fff;
    text-decoration: none;

    .taskHeader,
    .taskMain,
    .taskFooter {
      padding: 0.5rem;
    }

    .taskHeader,
    .taskFooter {
      text-align: center;
    }

    .taskFooter {
      font-weight: bold;
      font-size: 0.8rem;
    }

    .taskTitle {
      margin: 0 0 1rem 0;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .dateUpdated {
      font-size: 0.8rem;
      text-align: right;
    }

    a {
      color: #fff;
    }
  }
`;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { listId } = params;

  if (!listId) {
    throw new Error("List ID is required");
  }

  const list = await getListByIdWithTasks(request, listId);

  return { list };
};

const TaskGridItem = ({ task }: { task: tasks_v1.Schema$Task }) => {
  const { listId } = useParams();
  const updated = task.updated ? new Date(task.updated) : null;

  let status = null;
  if (task.status === "needsAction") {
    status = "Needs Action";
  } else if (task.status === "completed") {
    status = "Completed";
  } else if (task.status === "deleted") {
    status = "Deleted";
  } else {
    status = "Unknown";
  }

  return (
    <StyledTask
      to={`/tasklists/${listId}/task/${task.id}`}
      status={task.status}
    >
      <label>
        <span>Toggle Status</span>
        <div
          className={`visualCheck ${task.status === "completed" && "checked"}`}
        />
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={() => {
            fetch(`/tasklists/${listId}/task/${task.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status:
                  task.status === "completed" ? "needsAction" : "completed",
              }),
            });
          }}
        />
      </label>
      <div className="taskContainer">
        <div className="taskMain">
          <h2 className="taskTitle">{task.title}</h2>
        </div>
        <div className="taskFooter">
          <div className="dateUpdated">
            Updated: {updated ? updated.toDateString() : "N/A"}
          </div>
        </div>
      </div>
    </StyledTask>
  );
};

const AddTaskButton = styled(StyledTask)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #000;
  color: #fff;
  text-decoration: none;
  width: 100%;
  max-width: 200px;
  margin-left: auto;

  img {
    width: 2rem;
    height: 2rem;
  }
`;

const CreateTaskButton = () => {
  return (
    <AddTaskButton to={`/tasklists/${useParams().listId}/new`}>
      <img src="/icons/plus.svg" alt="" />
    </AddTaskButton>
  );
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
        <IconNavLink to={`/tasklists/${list.id}/delete`} danger>
          <span>Delete List</span>
          <img src="/icons/delete.svg" alt="" />
        </IconNavLink>
        <IconNavLink to={`/tasklists/${list.id}/edit`}>
          <span>Edit List</span>
          <img src="/icons/edit.svg" alt="" />
        </IconNavLink>
        <IconNavLink to={`/tasklists/${list.id}/new`}>
          <span>Create Task</span>
          <img src="/icons/plus.svg" alt="" />
        </IconNavLink>
      </FlexContainer>
      <FlexContainer flexDirection="column" alignItems="stretch">
        {list.tasks.length > 0 &&
          list.tasks.map((task) => <TaskGridItem key={task.id} task={task} />)}
        <CreateTaskButton />
      </FlexContainer>
    </section>
  );
}
