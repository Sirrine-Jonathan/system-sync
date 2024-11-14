import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/app/services/auth.server";
import { Header } from "~/app/components/Header";
import { SignInButton } from "~/app/components/SignInButton";

export const handle = {
  title: "About",
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  return user;
};
export default function About() {
  const user = useLoaderData<ReturnType<typeof loader>>();

  return (
    <main>
      <Header imageUrl={user ? user.photos[0].value : ""} />
      <section>{!user && <SignInButton type="Google" />}</section>
    </main>
  );
}
