import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/app/services/auth.server";
import { Header } from "~app/components/Header";
export const loader = async ({ request }: LoaderFunctionArgs) => {
	
	const user = await authenticator.isAuthenticated(request);

	return user
}
export default function About() {

	const user = useLoaderData<ReturnType<typeof loader>>();
	
	return (
		<main>
			{user && <Header imageUrl={user.photos[0].value}/>}
			{!user && (
				<header>
					<h1>Becoming You</h1>
				</header>
			)}
			<section>
				{!user && (
					<Form action="/auth/google" method="post">
						<button id="googleLoginBtn"><img src="/icons/google-logo.svg" alt="google"/>Login with Google</button>
					</Form>
				)}
			</section>
		</main>
	);
}