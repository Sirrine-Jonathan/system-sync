import {
  Outlet,
  useLoaderData,
  useRouteError,
  useMatches,
} from "@remix-run/react";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Header, FALLBACK_IMAGE_URL } from "~/components/Header";
import { type GoogleUser } from "~/services/auth.server";
import { useEffect } from "react";
import { isValidTimeZone } from "~/utils/time";
import { SignInButton } from "~/components/SignInButton";
import { DesktopNav } from "~/components/DesktopNav";
import { getSession } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request);

  const user = session.get("user");

  if (!user) {
    return redirect("/auth/signin");
  }

  return user;
};

export default function Layout() {
  const user = useLoaderData<ReturnType<typeof loader>>();

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
      <Header imageUrl={user?.photos?.[0].value || FALLBACK_IMAGE_URL} />
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
