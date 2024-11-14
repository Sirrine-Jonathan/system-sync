import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const loader = () => redirect("/auth/si");

export const action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/signin",
  });
};
