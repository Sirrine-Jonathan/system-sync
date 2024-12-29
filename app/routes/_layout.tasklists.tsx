import { useLoaderData, NavLink } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getListsWithTasks, TaskListWithTasks } from "~/services/task.server";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { StyledBigLink } from "~/components/styledParts/Links";
import { ListBlock } from "~/components/Tasks/ListBlock";
import { GridContainer } from "~/components/styledParts/GridContainer";
import { List } from "~/components/Tasks/List";

export const handle = {
  title: "Task Lists",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await getListsWithTasks(request);
};

export default function Tasklist() {
  const lists = useLoaderData<TaskListWithTasks[]>();

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
        <StyledBigLink to="/tasklists/all">
          <span>View All Tasks</span>
          <img src="/icons/task.svg" alt="" />
        </StyledBigLink>
        <StyledBigLink to={`/tasklists/new`}>
          <span>Create List</span>
          <img src="/icons/plus.svg" alt="" />
        </StyledBigLink>
      </FlexContainer>
      <GridContainer templateColumns="repeat(auto-fill, minmax(min(100%, 300px), 1fr))">
        {lists.map((list) => (
          <ListBlock key={list.id} list={list} />
        ))}
      </GridContainer>
    </section>
  );
}
