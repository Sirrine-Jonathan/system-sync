import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { authenticator } from "~/app/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Become You" },
    { name: "description", content: "Welcome to Become You" },
  ];
};

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/signin",
  });
}

export default function Index() {
  return <Outlet />;
}
