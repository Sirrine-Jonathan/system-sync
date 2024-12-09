import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { getSession, commitSession } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.authenticate("google", request);

  if (user && user.tokens) {
    const session = await getSession(request);

    session.set("accessToken", user.tokens.accessToken);
    session.set("refreshToken", user.tokens.refreshToken);
    session.set("user", user);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return redirect("/auth/signin");
};
