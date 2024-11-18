import type { LoaderFunction } from "@remix-run/node";
import {
  useActionData,
  NavLink,
  useOutletContext,
  useFetcher,
} from "@remix-run/react";
import { updateEvent } from "~/services/event.server";
import { calendar_v3 } from "googleapis";
import styled from "@emotion/styled";
import { StyledFormContainer } from "~/components/styledParts/Form";
import { FlexContainer } from "~/components/styledParts/FlexContainer";

const StyledEventFormContainer = styled(StyledFormContainer)`
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

  .formTitle {
    margin-bottom: 1rem;
  }
`;

const StyledFormMessage = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  text-align: center;
`;

export const handle = {
  title: "Edit event",
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
  const { event } = useOutletContext<{ event: calendar_v3.Schema$Event }>();
  const actionData = useActionData();
  const errorMessage = actionData?.errorMessage;
  const fetcher = useFetcher();
  const startDateTime = event.start?.dateTime?.slice(0, 16);
  const endDateTime = event.end?.dateTime?.slice(0, 16);

  return (
    <FlexContainer
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="stretch"
      gap="1em"
      style={{ flex: "1" }}
    >
      <StyledEventFormContainer>
        {fetcher.state === "submitting" && (
          <StyledFormMessage>Saving...</StyledFormMessage>
        )}
        <fetcher.Form method="post" action={`/calendar/event/${event.id}/edit`}>
          <NavLink to={`/calendar/event/${event.id}`}>
            <img src="/icons/close.svg" alt="" />
          </NavLink>
          <div className="formTitle">Edit Event</div>
          <div className="formErrorMessage">{errorMessage}</div>
          <input type="hidden" name="_id" value={event.id} />
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
        </fetcher.Form>
      </StyledEventFormContainer>
    </FlexContainer>
  );
}
