import type { THydratedUserModel } from "~/services/user.server";
import { useOutletContext } from "@remix-run/react";

export const handle = {
  title: "Dashboard",
};

export default function Dashboard() {
  const user = useOutletContext<THydratedUserModel>();

  console.log({ user });

  return (
    <main>
      <section>
        {user && <div>{user.displayName}</div>}
        {user && <div>{user.email}</div>}
      </section>
    </main>
  );
}
