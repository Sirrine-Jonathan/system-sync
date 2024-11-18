import { useMatches } from "@remix-run/react";

export const useBreadcrumbs = () => {
  const matches = useMatches();
  const leaf = matches[matches.length - 1];
  return {
    breadcrumbs: matches.map((match) => ({
      handle: match.handle,
      params: match.params,
      path: match.pathname,
    })),
    leaf,
  };
};
