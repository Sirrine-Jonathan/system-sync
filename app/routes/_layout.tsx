import { NavLink, Outlet } from "@remix-run/react";
export default function Layout() {
	return (
		<main className="h-screen flex flex-col">
			<header className="p-4 flex justify-between">
			<h1>Becoming You</h1>
				<a href="/auth/logout" className="flex items-center gap-2"><img className="w-6 h-6" src="/icons/logout.svg" alt="sign out"/></a>
			</header>
			<nav className="p-4">
				<ul className="flex gap-4">
					<li><NavLink to="/calendar">Calendar</NavLink></li>
					<li><NavLink to="/tasks">Tasks</NavLink></li>
					<li><NavLink to="/habits">Habits</NavLink></li>
				</ul>
			</nav>
			<Outlet />
		</main>
	);
}
