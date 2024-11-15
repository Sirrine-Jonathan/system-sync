import { Outlet, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import { redirect } from "@remix-run/node";
import { Header, FALLBACK_IMAGE_URL } from "~/components/Header";
import { authenticator } from "~/services/auth.server";
import { useEffect } from "react";

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

function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error("Time zones are not available in this environment");
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (ex) {
    return false;
  }
}

export default function Layout() {
  const userStr = useLoaderData<ReturnType<typeof loader>>();
  const user = JSON.parse(userStr || "{}") as User;

  // add timezone to the url
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const tz = url.searchParams.get("tz");
      if (tz && isValidTimeZone(tz)) {
        return;
      }

      // prefer timezone on user obj if any
      if (user.timezone && isValidTimeZone(user.timezone)) {
        url.searchParams.set("tz", user.timezone);
        window.history.replaceState({}, "", url);
        return;
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      url.searchParams.set("tz", timezone);
      window.history.replaceState({}, "", url);
    }
  }, [user.timezone]);

  return (
    <main className="flex-col">
      <Header imageUrl={user?.photos[0].value || FALLBACK_IMAGE_URL} />
      <Outlet context={user} />
    </main>
  );
}
