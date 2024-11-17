import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form, NavLink } from "@remix-run/react";
import { getEvent, updateEvent } from "~/services/event.server";
import { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { StyledForm } from "~/components/styledParts/Form";
import { FlexContainer } from "~/components/styledParts/FlexContainer";

const StyledEventForm = styled(StyledForm)`
  display: flex;
  position: relative;
  a {
    position: absolute;
    top: 5px;
    right: 5px;

    img {
      width: 1rem;
    }
  }

  label {
    width: 100%;
  }
`;

export const handle = {
  title: "Event | Edit",
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
  const action = formData.get("_action");

  switch (action) {
    case "updateEvent": {
      const start = formData.get("start");
      const end = formData.get("end") as string;
      const endISO = new Date(end).toISOString();
      console.log({ start, end });

      // Validation
      if (!start || !end) {
        return { errorMessage: "Missing required fields" };
      }
      return await updateEvent(request, {
        id: eventId,
        summary: formData.get("summary") as string,
      });
    }
    default:
      throw new Error("Invalid action");
  }
};

export default function EventEdit() {
  const event = useLoaderData<calendar_v3.Schema$Event>();
  const actionData = useActionData();
  const errorMessage = actionData?.errorMessage;

  console.log({ event, actionData });

  const startDateTime = new Date(event.start?.dateTime || "")
    .toISOString()
    .slice(0, 16);
  const endDateTime = new Date(event.end?.dateTime || "")
    .toISOString()
    .slice(0, 16);

  console.log({
    startDateTime,
    endDateTime,
    validTime: new Date().toISOString().slice(0, 16),
  });

  return (
    <FlexContainer
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="stretch"
      gap="1em"
    >
      <StyledEventForm
        method="post"
        action={`/calendar/event/${event.id}/edit`}
      >
        <NavLink to={`/calendar/event/${event.id}`}>
          <img src="/icons/close.svg" alt="" />
        </NavLink>
        <div className="formTitle">Edit Event</div>
        <div className="formErrorMessage">{errorMessage}</div>
        <input type="hidden" name="_action" value="updateEvent" />
        <input type="hidden" name="_id" value={event.id} />
        <label>
          Title
          <textarea
            required
            placeholder="Title"
            name="summary"
            defaultValue={event.summary || ""}
          ></textarea>
        </label>
        <label>
          Start Date
          <input
            type="datetime-local"
            name="start"
            defaultValue={startDateTime || ""}
          />
        </label>
        <label>
          End Date
          <input
            type="datetime-local"
            name="end"
            defaultValue={endDateTime || ""}
          />
        </label>
        <FlexContainer gap="1em">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </FlexContainer>
      </StyledEventForm>
    </FlexContainer>
  );
}
