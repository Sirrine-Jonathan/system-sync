import { useState, useEffect } from "react";
import { useSubTitle } from "~app/hooks/useSubTitle";
export const Header = ({ imageUrl }: { imageUrl: string }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const subtitle = useSubTitle();

	const onBodyClick = (e) => {
		console.log(e);
		// setIsMenuOpen(false)
	}

	useEffect(() => {
		document.body.addEventListener('click', onBodyClick, { capture: true })
		return () => document.body.removeEventListener('click', onBodyClick, { capture: true })
	})

	return (
		<header>
			<div id="titleColumn">
				<h1>Becoming You</h1>
				<h2>{subtitle}</h2>
			</div>
			<div className="menuContainer">
				<button className="avatar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<img src={imageUrl} alt="profile" />
				</button>
				{isMenuOpen && (
					<div className="menu">
						<button className="closeMenu" onClick={() => setIsMenuOpen(false)}>X</button>
						<ul>
							<li>
								<a href="/calendar">Calendar</a>
								<ul>
									<li><a href="/calendar/month">Month</a></li>
									<li><a href="/calendar/week">Week</a></li>
									<li><a href="/calendar/day">Day</a></li>
								</ul>
							</li>
							<li><a href="/events">Events</a></li>
							<li><a href="/tasks">Tasks</a></li>
							<li><a href="/habits">Habits</a></li>
							<li><a href="/about">About</a></li>
							<hr />
							<li className="flex">
								<span>Log out</span>
								<a href="/auth/logout"><img className="w-6 h-6" src="/icons/logout.svg" alt="sign out"/></a>
							</li>
						</ul>
					</div>
				)}
			</div>
		</header>
	);
}