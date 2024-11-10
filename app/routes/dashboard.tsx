import { LoaderFunctionArgs } from '@remix-run/node';
import { Header } from '../components/Header';
import { authenticator } from '~app/services/auth.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	
	const user = await authenticator.isAuthenticated(request);

	return user
}

export default function Dashboard() {

	const user = useLoaderData<ReturnType<typeof loader>>();

	return (
		<main>
			<Header imageUrl={user.photos[0].value}/>
			<section>
				{user && <div>{user.displayName}</div>}
				{user && <div>{user.emails?.[0]?.value}</div>}
			</section>
		</main>

	);
}