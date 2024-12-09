import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import styled from "@emotion/styled";
import { useBreadcrumbs } from "~/hooks/useBreadcrumbs";
import { getTasksByOwner } from "~/services/task.server";
import { Task } from "~/components/Task";
import { GridContainer } from "~/components/styledParts/GridContainer";

const StyledTimeUl = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;

  li {
    a {
      color: white;
      text-decoration: none;

      &.active {
        text-decoration: underline;
      }

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

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
    const user = await authenticator.isAuthenticated(request);
    return json(await getTasksByOwner({ _id: user._id }));
  }

  return redirect("/calendar/month");
};

const StyledBreadcrumbs = styled.div`
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;

  &:last-child {
    text-decoration: underline;
  }

  a {
    color: white;
    text-decoration: none;
  }

  & > .crumb {
    margin: 0;
    padding: 0;

    a {
      margin-left: 10px;

      &:after {
        position: absolute;
        content: ">";
        margin: 0 10px;
      }
    }
  }

  & > .crumb:last-of-type a {
    display: block;
    text-decoration: underline;

    &:after {
      content: "";
    }
  }

  & > .crumb:first-of-type a {
    margin-left: 0;
  }
`;

export default function Calendar() {
  const { breadcrumbs } = useBreadcrumbs();
  const loaderData = useLoaderData();

  return (
    <section>
      <StyledTimeUl>
        <li>
          <NavLink to="/calendar/month">Month</NavLink>
        </li>
        <li>
          <NavLink to="/calendar/week">Week</NavLink>
        </li>
        <li>
          <NavLink to="/calendar/day">Day</NavLink>
        </li>
        <li>
          <NavLink to="/calendar/events">Upcoming Events</NavLink>
        </li>
      </StyledTimeUl>
      <StyledBreadcrumbs>
        {breadcrumbs
          .filter((breadcrumb) => breadcrumb.path && breadcrumb.handle)
          .map((breadcrumb, index) => (
            <div key={index} className="crumb">
              <NavLink to={breadcrumb.path}>{breadcrumb.handle.title}</NavLink>
            </div>
          ))}
      </StyledBreadcrumbs>
      <div>
        <GridContainer
          templateColumns="repeat(auto-fill, minmax(min(100%, 300px), 1fr))"
          gap="2em"
        >
          {loaderData.map((task) => (
            <Task key={task._id.toString()} task={task} />
          ))}
        </GridContainer>
      </div>
      <Outlet />
    </section>
  );
}
