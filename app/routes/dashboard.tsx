import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Header } from "../components/Header";
import { authenticator, type User } from "~app/services/auth.server";
import { getSession, commitSession } from "~app/services/session.server";
import { useLoaderData } from "@remix-run/react";

export const handle = {
  title: "Dashboard",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect("/auth/signin");
  }

  // store the access token in the session
  const session = await getSession(request);
  session.set("accessToken", user.accessToken);
  return new Response(JSON.stringify(user), {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default function Dashboard() {
  const userStr = useLoaderData<string>();
  const user = JSON.parse(userStr || "{}") as User;

  return (
    <main>
      <Header imageUrl={user.photos[0].value} />
      <section>
        {user && <div>{user.displayName}</div>}
        {user && <div>{user.emails?.[0]?.value}</div>}
      </section>
    </main>
  );
}
