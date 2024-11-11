import { LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/app/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
  return redirect("/");
};
