import { useState, useEffect } from "react";
import { NavLink, useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getListsWithTasks, TaskListWithTasks } from "~/services/task.server";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Well } from "~/components/styledParts/Well";
import { GridContainer } from "~/components/styledParts/GridContainer";
import { Diminished, Small } from "~/components/styledParts/Text";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { StyledSelect } from "~/components/styledParts/Select";
import { StyledForm } from "~/components/styledParts/Form";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const lists = await getListsWithTasks(request);

  if (!lists) {
    throw new Response("Not Found", { status: 404 });
  }

  return lists;
};

export default function Tasks() {
  let lists = useLoaderData<TaskListWithTasks[]>();

  const [filteredLists, setFilteredList] = useState<TaskListWithTasks[]>(lists);
  const [filteredTasks, setFilteredTasks] = useState(() =>
    lists.reduce((acc, list) => [...acc, ...list.tasks], [])
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(() => {
    return parseInt(searchParams.get("limit") || "0");
  });
  const [filter, setFilter] = useState(() => {
    return searchParams.get("filter") || "";
  });

  useEffect(() => {
    let filteredLists = lists;
    if (filter) {
      filteredLists = lists.filter((list) => list.title === filter);
    }

    setFilteredList(filteredLists);

    return () => {
      setFilteredList(lists);
    };
  }, [filter, lists, limit]);

  useEffect(() => {
    const tasks = filteredLists.reduce(
      (acc, list) => [...acc, ...list.tasks],
      []
    );
    const limitedTasks = limit > 0 ? tasks.slice(0, limit) : tasks;
    setFilteredTasks(limitedTasks);
  }, [filteredLists, limit]);

  return (
    <section id="tasks">
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasklists">Task Lists</NavLink>
        <NavLink to="/tasks" className="current">
          All Tasks
        </NavLink>
      </Breadcrumbs>
      <StyledForm state="idle">
        <FlexContainer gap="1em" alignItems="center">
          <label>
            Filter
            <StyledSelect
              name="filter"
              id="filter"
              defaultValue={filter}
              onChange={(e) => {
                setSearchParams({ filter: e.target.value });
                setFilter(e.target.value);
              }}
            >
              <option value="">All</option>
              {lists.map((list) => (
                <option key={list.id} value={list.title}>
                  {list.title}
                </option>
              ))}
            </StyledSelect>
          </label>
          <label>
            Limit
            <StyledSelect
              name="limit"
              id="limit"
              defaultValue={limit}
              onChange={(e) => {
                setSearchParams({ limit: e.target.value });
                setLimit(parseInt(e.target.value));
              }}
            >
              <option value={0}>All</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </StyledSelect>
          </label>
        </FlexContainer>
      </StyledForm>
      {filteredTasks.length === 0 && <p>You have no tasks</p>}
      {filteredTasks.length > 0 && (
        <GridContainer templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
          {filteredTasks.map((task) => (
            <Well key={task.id}>
              <NavLink
                key={task.id}
                to={`/tasklists/${task.listId}/task/${task.id}`}
              >
                <FlexContainer
                  gap="1em"
                  flexDirection="column"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  fullHeight
                >
                  <div className="wellTitle">{task.title}</div>
                  <Diminished>
                    <Small>{task.listTitle}</Small>
                  </Diminished>
                </FlexContainer>
              </NavLink>
            </Well>
          ))}
        </GridContainer>
      )}
    </section>
  );
}
