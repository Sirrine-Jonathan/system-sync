import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { useBreadcrumbs } from "~/hooks/useBreadcrumbs";
import { getListsWithTasks } from "~/services/task.server";
import { GridContainer } from "~/components/styledParts/GridContainer";
import { Well } from "~/components/styledParts/Well";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { Diminished, Large, Small } from "~/components/styledParts/Text";

export const handle = {
  title: "Calendar",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  authenticator.authenticate("google", request, {
    failureRedirect: `/auth/signin?redirect=${request.url}`,
  });

  // look for month day or week after /calendar/ in url path
  const url = new URL(request.url);
  const path = url.pathname.split("/");
  const isCalendarPageWithTime = path.some((pathSegment) => {
    if (
      pathSegment === "month" ||
      pathSegment === "week" ||
      pathSegment === "day" ||
      pathSegment === "event" ||
      pathSegment === "events"
    ) {
      return true;
    }
    return false;
  });

  if (isCalendarPageWithTime) {
    return json(await getListsWithTasks(request));
  }

  return redirect("/calendar/month");
};

export default function Calendar() {
  const { breadcrumbs } = useBreadcrumbs();
  const loaderData = useLoaderData();

  const tasks = loaderData.reduce(
    (acc, list) => [...acc, ...list.tasks],
    [] as tasks_v1.Schema$Task[]
  );

  const firstThree = tasks.slice(0, 3);

  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  const TimingNav = [
    <NavLink key="month" to="/calendar/month">
      Month
    </NavLink>,
    <NavLink key="week" to="/calendar/week">
      Week
    </NavLink>,
    <NavLink key="day" to="/calendar/day">
      Day
    </NavLink>,
  ];
  switch (lastBreadcrumb.handle.title) {
    case "Month":
      TimingNav[0] = (
        <NavLink key="month" to="/calendar/month" className="current">
          Month
        </NavLink>
      );
      break;
    case "Week":
      TimingNav[1] = (
        <NavLink key="week" to="/calendar/week" className="current">
          Week
        </NavLink>
      );
      break;
    case "Day":
      TimingNav[2] = (
        <NavLink key="day" to="/calendar/day" className="current">
          Day
        </NavLink>
      );
      break;
  }

  return (
    <section>
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <FlexContainer gap="1em">{TimingNav}</FlexContainer>
      </Breadcrumbs>
      <div>
        <GridContainer
          templateColumns="repeat(auto-fill, minmax(min(100%, 300px), 1fr))"
          gap="2em"
        >
          {firstThree.map((task) => (
            <Well key={task.id}>
              <FlexContainer
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="space-between"
                gap="1em"
                fullHeight
              >
                <div>{task.title}</div>
                <Diminished>
                  <Small>{task.listTitle}</Small>
                </Diminished>
              </FlexContainer>
            </Well>
          ))}
        </GridContainer>
      </div>
      <Outlet />
    </section>
  );
}
