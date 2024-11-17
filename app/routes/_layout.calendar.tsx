import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { NavLink, Outlet, useMatches } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import styled from "@emotion/styled";

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

interface RouteHandle {
  title: string;
}

export const handle = {
  title: "Calendar",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  authenticator.authenticate("google", request, {
    failureRedirect: "/auth/signin",
  });

  // look for month day or week after /calendar/ in url path
  const url = new URL(request.url);
  const path = url.pathname.split("/");
  const isCalendarPageWithTime = path.some((pathSegment) => {
    if (
      pathSegment === "month" ||
      pathSegment === "week" ||
      pathSegment === "day" ||
      pathSegment === "event"
    ) {
      return true;
    }
    return false;
  });

  if (isCalendarPageWithTime) {
    return null;
  }

  return redirect("/calendar/month");
};

export default function Calendar() {
  const matches = useMatches();
  const leafRoute = matches[matches.length - 1];
  const subtitle = leafRoute.handle as RouteHandle | undefined;
  const isSingleEvent = subtitle?.title.includes("Event");

  if (isSingleEvent) {
    return (
      <section>
        <Outlet />
      </section>
    );
  }
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
      <Outlet />
    </section>
  );
}
