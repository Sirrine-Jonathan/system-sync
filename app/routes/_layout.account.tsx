import type { User } from "~/services/auth.server";
import { useOutletContext } from "@remix-run/react";
import { SignOutButton } from "~/components/SignOutButton";

export const handle = {
  title: "Account",
};

export default function Account() {
  const user = useOutletContext<User>();

  return (
    <main>
      <section>
        {user && <div>{user.displayName}</div>}
        {user && <div>{user.emails?.[0]?.value}</div>}
      </section>
      <section>
        <SignOutButton />
      </section>
    </main>
  );
}
