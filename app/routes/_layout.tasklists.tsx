import { useLoaderData, useActionData, NavLink } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getListsWithTasks, TaskListWithTasks } from "~/services/task.server";
import styled from "@emotion/styled";
import { tasks_v1 } from "googleapis";
import { GridContainer } from "~/components/styledParts/GridContainer";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { IconNavLink } from "~/components/styledParts/Links";
import { Well } from "~/components/styledParts/Well";
import { Large, Medium } from "~/components/styledParts/Text";

export const handle = {
  title: "Task Lists",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return getListsWithTasks(request);
};

const ListSummary = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.5rem 0.2rem 0.5rem;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .listSummaryTitle {
    font-size: 1.2rem;
  }

  .tasks {
    list-style: none;
    font-size: 0.8em;
    margin: 0;
    padding: 0;
    color: #ccc;

    li {
      margin: 0;
      padding: 0;

      &:before {
        content: "• ";
      }

      &.completed {
        text-decoration: line-through;
      }
    }
  }

  .lastUpdated {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
    text-align: center;
    color: #ccc;
    margin-top: 0.5rem;
  }
`;

const CreateListButton = () => {
  return (
    <NavLink to="/tasklists/new">
      <Well>
        <FlexContainer alignItems="center" justifyContent="center">
          <img src="/icons/plus.svg" alt="" />
        </FlexContainer>
      </Well>
    </NavLink>
  );
};

export default function AllTasks() {
  const lists = useLoaderData<TaskListWithTasks[]>();
  const actionData = useActionData();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.reset();
  }, [actionData]);

  return (
    <section id="tasklist">
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasklists" className="current">
          Task Lists
        </NavLink>
      </Breadcrumbs>

      <FlexContainer
        gap="1em"
        alignItems="center"
        justifyContent="flex-end"
        padding="0 0 1em 0"
      >
        <IconNavLink to="/tasklists/all">
          <span>View All Tasks</span>
          <img src="/icons/task.svg" alt="" />
        </IconNavLink>
        <IconNavLink to={`/tasklists/new`}>
          <span>Create List</span>
          <img src="/icons/plus.svg" alt="" />
        </IconNavLink>
      </FlexContainer>
      <GridContainer templateColumns="repeat(auto-fill, minmax(300px, 1fr))">
        {lists.map((list) => (
          <Well key={list.id}>
            <NavLink to={`/tasklists/${encodeURIComponent(list.id || "")}`}>
              <div>
                <Medium className="listSummaryTitle">
                  {list.title} ({list.tasks.length})
                </Medium>

                <ul className="tasks">
                  {list.tasks.length &&
                    list.tasks.slice(0, 3).map((task) => (
                      <li
                        key={task.id}
                        className={task.completed ? "completed" : ""}
                      >
                        {task.title}
                      </li>
                    ))}
                  {list.tasks.length > 3 && <li>...</li>}
                </ul>
              </div>
            </NavLink>
          </Well>
        ))}
        <CreateListButton />
      </GridContainer>
    </section>
  );
}
