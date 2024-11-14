import type { User } from "~/services/auth.server";
import { useOutletContext } from "@remix-run/react";

export const handle = {
  title: "Dashboard",
};

export default function Dashboard() {
  const user = useOutletContext<User>();

  return (
    <main>
      <section>
        {user && <div>{user.displayName}</div>}
        {user && <div>{user.emails?.[0]?.value}</div>}
      </section>
    </main>
  );
}
