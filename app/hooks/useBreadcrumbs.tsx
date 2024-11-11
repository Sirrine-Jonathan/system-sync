import { useMatches } from "@remix-run/react";

export const useBreadcrumbs = () => {
	const matches = useMatches();
	return matches.map((match) => ({
		handle: match.handle,
		params: match.params,
		path: match.pathname,
	}));
}