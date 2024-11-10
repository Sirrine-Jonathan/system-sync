import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { authenticator } from "~/app/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	
	const user = await authenticator.isAuthenticated(request);

	return user
}

export default function Layout() {
	const user = useLoaderData<ReturnType<typeof loader>>();

	return (
		<main className="flex-col">
			<Header imageUrl={user.photos[0].value} />
			<Outlet />
		</main>
	);
}
