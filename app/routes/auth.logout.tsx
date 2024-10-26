import { LoaderFunction, redirect } from "@remix-run/node";
import { destroySession } from "~/app/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
	await destroySession(request);
	return redirect("/");
}