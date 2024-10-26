import { NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";

export default function Calendar() {
	return (
		<div>
			<h1>Calendar</h1>
			<ul className="flex gap-4">
				<li><NavLink to="/calendar/month">Month</NavLink></li>
				<li><NavLink to="/calendar/week">Week</NavLink></li>
				<li><NavLink to="/calendar/day">Day</NavLink></li>
			</ul>
			<Outlet />
		</div>
	);
}