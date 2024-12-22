import { type LoaderFunction } from "@remix-run/node";
import {
  useActionData,
  NavLink,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { getEvent, updateEvent } from "~/services/event.server";
import { calendar_v3 } from "googleapis";
import { StyledForm } from "~/components/styledParts/Form";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { StyledButton } from "~/components/styledParts/Buttons";
import { Breadcrumbs } from "~/components/Nav/Breadcrumbs";

export const handle = {
  title: "Edit event",
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { eventId } = params;
  if (!eventId) {
    return null;
  }
  return await getEvent(request, { eventId });
};

export const action: LoaderFunction = async ({ request, params }) => {
  const { eventId } = params;
  if (!eventId) {
    return null;
  }

  const formData = await request.formData();

  const patch: Partial<calendar_v3.Schema$Event> = {
    id: eventId,
  };

  const summary = formData.get("summary") as string;
  if (summary) {
    patch.summary = summary;
  }

  const description = formData.get("description") as string;
  if (description) {
    patch.description = description;
  }

  return await updateEvent(request, patch);
};

export default function EventEdit() {
  const event = useLoaderData<calendar_v3.Schema$Event>();
  const actionData = useActionData();
  const errorMessage = actionData?.errorMessage;
  const fetcher = useFetcher();
  const startDateTime = event.start?.dateTime?.slice(0, 16);
  const endDateTime = event.end?.dateTime?.slice(0, 16);

  return (
    <section>
      <Breadcrumbs>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to={`/event/${event.id}`}>{event.summary}</NavLink>
        <NavLink to={`/event/${event.id}/edit`} className="current">
          Edit
        </NavLink>
      </Breadcrumbs>
      <StyledForm state={fetcher.state}>
        <fetcher.Form method="post" action={`/calendar/event/${event.id}/edit`}>
          <div className="formErrorMessage">{errorMessage}</div>
          <label>
            Summary
            <textarea
              required
              placeholder="Summary"
              name="summary"
              defaultValue={event.summary || ""}
            ></textarea>
          </label>
          <label>
            Description
            <textarea
              placeholder="Description"
              name="description"
              defaultValue={event.description || ""}
            ></textarea>
          </label>
          <label>
            Start Date
            <input
              type="datetime-local"
              name="start"
              defaultValue={startDateTime || ""}
            />
            <img src="/icons/calendar.svg" alt="open datepicker" />
          </label>
          <label>
            End Date
            <input
              type="datetime-local"
              name="end"
              defaultValue={endDateTime || ""}
            />
            <img src="/icons/calendar.svg" alt="open datepicker" />
          </label>
          <FlexContainer justifyContent="flex-end">
            <StyledButton type="submit">Save</StyledButton>
          </FlexContainer>
        </fetcher.Form>
      </StyledForm>
    </section>
  );
}
