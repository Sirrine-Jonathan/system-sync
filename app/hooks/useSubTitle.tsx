import { useMatches } from "@remix-run/react";

interface RouteHandle {
	title: string;
}

export const useSubtitle = () => {
	const matches = useMatches();
	const leafRoute = matches[matches.length - 1];
	const subtitle = leafRoute.handle as RouteHandle | undefined;
	return subtitle?.title;
}