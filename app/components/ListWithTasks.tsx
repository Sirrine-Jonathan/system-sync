import { type TaskListWithTasks } from "~/services/task.server";
import styled from "@emotion/styled";
import { useState } from "react";
import { Well } from "./styledParts/Well";
import { FlexContainer } from "./styledParts/FlexContainer";
import { NavLink } from "@remix-run/react";
import { Diminished, Small } from "./styledParts/Text";

const ListWithTasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  li {
    display: none;
    .taskTitle {
      font-weight: bold;
    }

    .taskFooter {
      font-size: 0.6rem;
    }
  }

  ul.show li {
    display: block;
  }

  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: white;

    img {
      width: 1rem;
    }
  }

  a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    width: 100%;

    &:hover {
      text-decoration: underline;
    }
  }

  input[type="checkbox"] {
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

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .taskContainer {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1),
      rgba(255, 255, 255, 0.2)
    );
    color: #fff;
    text-decoration: none;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
`;

export const ListWithTasks = ({
  taskList,
}: {
  taskList: TaskListWithTasks;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Well>
      <ListWithTasksContainer>
        <button onClick={() => setIsOpen(!isOpen)}>
          <h3>
            <Small>
              <Diminished>Tasks from</Diminished>
            </Small>{" "}
            {taskList.title}
          </h3>
          <img src={isOpen ? "/icons/up.svg" : "/icons/down.svg"} alt="" />
        </button>
        <ul className={isOpen ? "show" : ""}>
          {taskList.tasks.map((task) => (
            <li key={task.id}>
              <FlexContainer>
                <label htmlFor={task.id}>
                  <input
                    id={task.id}
                    type="checkbox"
                    aria-label={`toggle ${task.title}`}
                    defaultChecked={task.status === "completed"}
                    onChange={() => {
                      fetch(`/tasklists/${taskList.id}/task/${task.id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });
                    }}
                  />
                  <div
                    className={`visualCheck ${task.status === "completed" && "checked"}`}
                  />
                  <span className="sr-only">Toggle Status</span>
                </label>
                <FlexContainer
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="stretch"
                  className="taskContainer"
                >
                  <NavLink
                    to={`/tasklists/${taskList.id}/task/${task.id}`}
                    className="taskTitle"
                  >
                    {task.title}
                  </NavLink>
                  <div className="taskFooter">{task.updated}</div>
                </FlexContainer>
              </FlexContainer>
            </li>
          ))}
        </ul>
      </ListWithTasksContainer>
    </Well>
  );
};
