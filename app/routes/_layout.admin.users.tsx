import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getUsers } from "~/services/user.server";

export const handle = {
  title: "Admin | Users",
};
export const loader = async () => {
  return json(await getUsers());
};
export default function Users() {
  const users = useLoaderData<ReturnType<typeof loader>>();

  return (
    <section id="users">
      {users.map((user) => (
        <div key={user._id.toString()}>{user.displayName}</div>
      ))}
    </section>
  );
}
