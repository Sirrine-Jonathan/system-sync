import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/app/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Becoming You" },
    { name: "description", content: "Welcome to Becoming You" },
  ];
};

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/signin",
  });
}

export default function Index() {
  return <Outlet />
}
