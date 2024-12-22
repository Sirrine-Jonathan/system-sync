import { NavLink } from "@remix-run/react";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";

export const handle = {
  title: "Habits",
};

export default function Habits() {
  return (
    <section id="habits">
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/habits" className="current">
          Habits
        </NavLink>
      </Breadcrumbs>
      <p>Work in progress</p>
    </section>
  );
}
