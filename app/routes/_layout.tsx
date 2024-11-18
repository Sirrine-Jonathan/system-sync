import {
  Outlet,
  useLoaderData,
  useRouteError,
  useMatches,
} from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import { redirect } from "@remix-run/node";
import { Header, FALLBACK_IMAGE_URL } from "~/components/Header";
import { authenticator } from "~/services/auth.server";
import { useEffect } from "react";
import { isValidTimeZone } from "~/utils/time";
import { SignInButton } from "~/components/SignInButton";
import { DesktopNav } from "~/components/DesktopNav";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const session = await getSession(request);

  if (!user) {
    return redirect("/auth/signin");
  }

  // store the access token in the session
  session.set("accessToken", user.accessToken);
  session.set("refreshToken", user.refreshToken);
  session.set("timezone", user.timeZone || "UTC");
  process.env.TZ = user.timeZone || "UTC";

  return new Response(JSON.stringify(user), {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

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
      <DesktopNav user={user} />
      <Outlet context={user} />
    </main>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  const matches = useMatches();
  const leafNode = matches[matches.length - 1];
  const returnUrl = leafNode.pathname;

  let Component = <div></div>;
  if (
    (error &&
      typeof error === "object" &&
      "message" in error &&
      error.message === "User not authenticated") ||
    error.message === "Unauthorized" ||
    error.message === "Forbidden" ||
    error.message === "Not Found" ||
    error.message === "Invalid Credentials"
  ) {
    Component = (
      <section>
        <SignInButton type="Google" successRedirect={returnUrl} />
      </section>
    );
  } else {
    Component = (
      <section>
        <h1>Something went wrong</h1>
        <p>{error?.message}</p>
      </section>
    );
  }
  return (
    <main className="flex-col">
      <Header />
      <DesktopNav />
      {Component}
    </main>
  );
};
