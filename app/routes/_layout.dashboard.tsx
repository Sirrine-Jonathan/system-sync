import type { THydratedUserModel } from "~/services/user.server";
import { useLoaderData, useOutletContext, NavLink } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { getRangeMinMax } from "~/utils/time";
import { getEvents } from "~/services/event.server";
import { calendar_v3 } from "googleapis";
import { Event } from "~/components/Event";
import {
  getListsWithTasks,
  type TaskListWithTasks,
} from "~/services/task.server";
import { Section, Large, Highlight } from "~/components/styledParts/Text";
import { Well } from "~/components/styledParts/Well";
import { DateTime } from "~/components/DateTime";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { GridContainer } from "~/components/styledParts/GridContainer";
import { ListWithTasks } from "~/components/ListWithTasks";

export const handle = {
  title: "Dashboard",
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const timezone = url.searchParams.get("tz") || "UTC";
  new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
  }).formatRange(new Date(), new Date());
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { dayMin, dayMax } = getRangeMinMax(
    new Date(Number(year), Number(month) - 1, Number(day))
  );

  const events = await getEvents(request, {
    timeMin: dayMin.toISOString(),
    timeMax: dayMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const lists = await getListsWithTasks(request);

  return { events, lists };
};

export default function Dashboard() {
  const user = useOutletContext<THydratedUserModel>();
  const { events, lists } = useLoaderData<{
    events: calendar_v3.Schema$Event[];
    lists: TaskListWithTasks[];
  }>();

  console.log({ events, lists });
  const numberOfTasks = lists
    ? lists.reduce((acc, list) => acc + list.tasks?.length, 0)
    : 0;

  return (
    <main>
      <Section>
        <Well>
          {user && (
            <p>
              Hello, <Large>{user.displayName}</Large>
            </p>
          )}
          <DateTime />
        </Well>
        <hr />
        <Well>
          <FlexContainer justifyContent="space-between" alignItems="center">
            <FlexContainer gap="1em">
              <img src="/icons/calendar.svg" alt="" />
              {events.length === 0 ? (
                <div>You have no events today</div>
              ) : (
                <div>
                  You have {events.length} event{events.length === 1 ? "" : "s"}{" "}
                  today
                </div>
              )}
            </FlexContainer>
            <NavLink to="/calendar">
              <Highlight>View Calendar</Highlight>
            </NavLink>
          </FlexContainer>
          <hr />
          <FlexContainer justifyContent="space-between" alignItems="center">
            <FlexContainer gap="1em">
              <img src="/icons/task.svg" alt="" />
              {numberOfTasks === 0 ? (
                <div>You have no tasks</div>
              ) : (
                <div>
                  You have {numberOfTasks} task{numberOfTasks === 1 ? "" : "s"}.
                </div>
              )}
            </FlexContainer>
            <NavLink to="/tasklists">
              <Highlight>View Tasks</Highlight>
            </NavLink>
          </FlexContainer>
        </Well>
        <hr />

        {events.length > 0 && (
          <div>
            <FlexContainer justifyContent="space-between" alignItems="center">
              <h2>Events</h2>
              <div>{new Date().toLocaleDateString()}</div>
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              gap="1em"
              alignItems="stretch"
            >
              {events.map((event) => (
                <Event key={event.id} event={event} />
              ))}
            </FlexContainer>
            <hr />
          </div>
        )}
        {numberOfTasks && (
          <div>
            <GridContainer gap="1em">
              {lists.map((list) => (
                <ListWithTasks key={list.id} taskList={list} />
              ))}
            </GridContainer>
          </div>
        )}
      </Section>
    </main>
  );
}
