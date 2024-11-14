import { Outlet, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import { redirect } from "@remix-run/node";
import { Header, FALLBACK_IMAGE_URL } from "~/components/Header";
import { authenticator } from "~/services/auth.server";

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

export default function Layout() {
  const userStr = useLoaderData<ReturnType<typeof loader>>();
  const user = JSON.parse(userStr || "{}") as User;

  return (
    <main className="flex-col">
      <Header imageUrl={user?.photos[0].value || FALLBACK_IMAGE_URL} />
      <Outlet context={user} />
    </main>
  );
}
