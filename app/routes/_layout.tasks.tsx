import { useLoaderData, useActionData, json, Form } from "@remix-run/react";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  type THydratedTaskModel,
} from "~/services/task.server";
import { useEffect, useState, useRef, forwardRef } from "react";
import styled from "@emotion/styled";
import { authenticator } from "~/services/auth.server";
import { StyledSelect } from "~/components/styledParts/Select";

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1em;
`;

const StyledItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 1em;
  border-radius: 5px;
  padding: 1em;
  background: rgba(255, 255, 255, 0.1);

  .taskDisplay {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
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
  }

  .save,
  .delete {
    border: 1px solid white;
    background: transparent;
    border-radius: 5px;
    padding: 0.5em 1em;
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
    padding: 0.5em;
    color: white;
    font-size: 1.2rem;
  }
`;

export const handle = {
  title: "Tasks",
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
      <label className="taskDisplay">
        <div>{task.name}</div>
        {!isEditMode && (
          <button className="edit" onClick={() => setIsEditMode(true)}>
            <img src="/icons/edit.svg" alt="edit" />
          </button>
        )}
        {isEditMode && (
          <button className="close" onClick={() => setIsEditMode(false)}>
            <img src="/icons/up.svg" alt="close" />
          </button>
        )}
      </label>
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

export const loader = async () => {
  return json(await getTasks());
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const owner = authenticator.isAuthenticated(request);
  const formData = await request.formData();
  const action = formData.get("_action");
  const id = formData.get("_id");
  const name = formData.get("name");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const duration = formData.get("duration");
  const priority = formData.get("priority");

  switch (action) {
    case "addTask":
      return await addTask(
        {
          name,
          description,
          dueDate,
          duration,
          priority,
        },
        owner._id
      );
    case "updateTask":
      return await updateTask(id, name);
    case "deleteTask":
      return await deleteTask(id);
    default:
      throw new Error("Invalid action");
  }
};

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  border-radius: 5px;
  padding: 1em;
  background: rgba(255, 255, 255, 0.1);

  label {
    font-size: 0.7rem;
    color: white;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  input,
  textarea {
    background: transparent;
    border: none;
    border-bottom: 1px solid white;
    padding: 0.5em;
    color: white;
    font-size: 1.2rem;
  }

  input[type="number"] {
    &:webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    &:webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .inputWithSuffix {
    display: flex;
    align-items: end;
    gap: 0.5em;
  }

  button {
    border: 1px solid white;
    background: transparent;
    border-radius: 5px;
    padding: 0.5em 1em;
    cursor: pointer;
    margin: 15px 0 0;
    font-weight: bold;
    color: white;
  }
`;

const StyledControls = styled.section`
  display: flex;
  gap: 1em;

  select {
  }
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
      <section id="tasks">
        <StyledList>
          {tasks.map((task) => (
            <TaskEditor key={task._id.toString()} task={task} />
          ))}
        </StyledList>
      </section>
      <section id="add-task">
        <h2>Add Task</h2>
        <TaskForm ref={formRef}>
          <button onClick={() => formRef.current?.requestSubmit()}>
            Add Task
          </button>
        </TaskForm>
      </section>
    </section>
  );
}
