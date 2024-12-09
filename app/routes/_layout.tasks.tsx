import { useLoaderData, useActionData, json, Form } from "@remix-run/react";
import { useEffect, useState, useRef, forwardRef } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  getTasksByOwner,
  addTask,
  updateTask,
  deleteTask,
  type THydratedTaskModel,
} from "~/services/task.server";
import styled from "@emotion/styled";
import { authenticator } from "~/services/auth.server";
import { StyledSelect } from "~/components/styledParts/Select";
import { StyledForm } from "~/components/styledParts/Form";

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  gap: 1rem;
`;

const StyledItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 5px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);

  .taskDisplay {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
    cursor: pointer;
  }

  img {
    cursor: pointer;
    width: 1rem;
  }

  .edit,
  .close {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0;
  }

  .save,
  .delete {
    border: 1px solid white;
    background: transparent;
    border-radius: 5px;
    padding: 0.5em 1rem;
    cursor: pointer;
    margin: 15px 0 0;
  }

  .delete {
    border: 1px solid crimson;
    color: crimson;
    margin: 15px 0 0;
    font-weight: bold;
  }

  .save {
    color: white;
  }

  label {
    font-size: 0.7rem;
  }

  input {
    background: transparent;
    border: none;
    border-bottom: 1px solid white;
    padding: 0.5rem;
    color: white;
    font-size: 1.2rem;
  }
`;

export const handle = {
  title: "Tasks",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return json(await getTasksByOwner({ _id: user._id }));
};

const TaskForm = forwardRef(function taskForm(
  { task, children }: { task?: THydratedTaskModel; children: React.ReactNode },
  ref: React.ForwardedRef<HTMLFormElement>
) {
  return (
    <StyledForm method="post" ref={ref}>
      <input type="hidden" name="_action" value="addTask" />
      <label>
        Task Name
        <input
          type="text"
          placeholder="Task Name"
          name="name"
          defaultValue={task?.name || ""}
        />
      </label>
      <label>
        Task Description
        <textarea
          placeholder="Task Description"
          name="description"
          defaultValue={task?.description || ""}
          rows={5}
          cols={30}
        ></textarea>
      </label>
      <label>
        Due Date
        <input type="date" name="dueDate" />
      </label>
      <label htmlFor="taskPriority">
        Priority
        <StyledSelect id="taskPriority" name="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </StyledSelect>
      </label>
      <label>
        Duration
        <div className="inputWithSuffix">
          <input type="number" name="duration" step="0.5" /> Hours
        </div>
      </label>
      {children}
    </StyledForm>
  );
});

export const TaskEditor = ({ task }: { task: THydratedTaskModel }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const onDelete = () => {
    setIsEditMode(false);
  };

  return (
    <StyledItem>
      {!isEditMode && (
        <label className="taskDisplay">
          <div>{task.name}</div>
          <button className="edit" onClick={() => setIsEditMode(!isEditMode)}>
            <img src="/icons/edit.svg" alt="edit" />
          </button>
        </label>
      )}
      {isEditMode && (
        <label className="taskDisplay">
          <div>{task.name}</div>
          <button className="close" onClick={() => setIsEditMode(!isEditMode)}>
            <img src="/icons/up.svg" alt="close" />
          </button>
        </label>
      )}
      {isEditMode && (
        <div className="editFormContainer">
          <TaskForm task={task}>
            <input type="hidden" name="_action" value="updateTask" />
            <input type="hidden" name="_id" value={task._id.toString()} />
            <button className="save" type="submit">
              Save
            </button>
          </TaskForm>
          <Form method="post" onSubmit={onDelete}>
            <input type="hidden" name="_action" value="deleteTask" />
            <input type="hidden" name="_id" value={task._id.toString()} />
            <button className="delete" type="submit">
              Delete
            </button>
          </Form>
        </div>
      )}
    </StyledItem>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const owner = await authenticator.isAuthenticated(request);
  const formData = await request.formData();
  const action = formData.get("_action");
  const id = formData.get("_id");
  const name = formData.get("name");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const duration = formData.get("duration");
  const priority = formData.get("priority");

  console.log({ owner });

  let priorityNumber = 0;

  switch (priority) {
    case "hight":
      priorityNumber = 0;
      break;
    case "medium":
      priorityNumber = 1;
      break;
    case "low":
      priorityNumber = 2;
      break;
  }

  switch (action) {
    case "addTask":
      return await addTask(owner._id, {
        name,
        description,
        dueDate,
        duration,
        priority: priorityNumber,
      });
    case "updateTask":
      return await updateTask(id, name);
    case "deleteTask":
      return await deleteTask(id);
    default:
      throw new Error("Invalid action");
  }
};

const StyledControls = styled.section`
  display: flex;
  gap: 1rem;
`;

export default function Tasks() {
  const tasks = useLoaderData() as THydratedTaskModel[];
  const actionData = useActionData();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.reset();
  }, [actionData]);

  return (
    <section id="tasks">
      {/* sorting and filtering controls*/}
      <StyledControls id="controls">
        <StyledSelect>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
          <option value="overdue">Overdue</option>
          <option value="dueToday">Due Today</option>
          <option value="dueThisWeek">Due This Week</option>
          <option value="dueThisMonth">Due This Month</option>
        </StyledSelect>
      </StyledControls>
      <div id="tasks">
        <StyledList>
          {tasks.map((task) => (
            <TaskEditor key={task._id.toString()} task={task} />
          ))}
        </StyledList>
      </div>
      <div id="add-task">
        <TaskForm ref={formRef}>
          <button onClick={() => formRef.current?.requestSubmit()}>
            Add Task
          </button>
        </TaskForm>
      </div>
    </section>
  );
}
