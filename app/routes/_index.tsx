import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { getSession } from "~/app/utils/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Becoming You" },
    { name: "description", content: "Welcome to Becoming You" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  if (session.has("accessToken")) {
    return redirect("/calendar");
  } else {
    return redirect("/auth/login");
  }
};

export default function Index() {
  return <Outlet />
}
