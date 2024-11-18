import { createEvent } from "~/services/event.server";
import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";

function getFormattedDate(date) {
  // Format the date to ISO 8601 with the current time zone offset
  const timezoneOffset = -date.getTimezoneOffset(); // in minutes
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const offsetSign = timezoneOffset >= 0 ? "+" : "-";
  const formattedOffset = `${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

  const isoString = date.toISOString(); // "2016-05-01T03:24:00.000Z"
  const localTime = isoString.substring(0, isoString.length - 1); // Remove the 'Z'

  return `${localTime}${formattedOffset}`;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const queryParams = new URL(request.url).searchParams;
  const timeZone = queryParams.get("tz");

  const formData = await request.formData();

  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const start = formData.get("startDateTime") as string;
  const end = formData.get("endDateTime") as string;

  const resource = {
    summary,
    description,
    start: { dateTime: getFormattedDate(new Date(start)), timeZone },
    end: { dateTime: getFormattedDate(new Date(end)), timeZone },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const event = await createEvent(request, resource);

  return redirect(`/calendar/event/${event.id}`);
};
