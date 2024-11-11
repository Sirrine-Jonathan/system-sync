import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/app/services/auth.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/signin",
  });
};
