import { NavLink, Outlet } from "@remix-run/react";
import { authenticator } from "~app/services/auth.server";

export const handle = {
  title: "Calendar",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  authenticator.authenticate("google", request);
  return null;
};

export default function Calendar() {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/calendar/month">Month</NavLink>
        </li>
        <li>
          <NavLink to="/calendar/week">Week</NavLink>
        </li>
        <li>
          <NavLink to="/calendar/day">Day</NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
