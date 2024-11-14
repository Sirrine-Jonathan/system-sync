import { NavLink, Outlet } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import styled from "@emotion/styled";

const StyledTimeUl = styled.ul`
  display: flex;
  gap: 1em;
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
  authenticator.authenticate("google", request);
  return null;
};

export default function Calendar() {
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
      </StyledTimeUl>
      <Outlet />
    </section>
  );
}
