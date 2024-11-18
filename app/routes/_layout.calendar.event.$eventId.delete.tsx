import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteEvent } from "~/services/event.server";
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { eventId } = params;

  if (!eventId) {
    return null;
  }

  await deleteEvent(request, { eventId });

  return redirect(`/calendar`);
};
