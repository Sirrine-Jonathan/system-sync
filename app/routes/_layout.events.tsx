import { type LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useRevalidator,
  useSearchParams,
} from "@remix-run/react";
import { calendar_v3 } from "googleapis";
import { getEvents } from "~/services/event.server";
import { Event } from "~/components/Events/Event";
import { StyledOption, StyledSelect } from "~/components/styledParts/Select";
import styled from "@emotion/styled";

const StyledUpcomingEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

export const handle = {
  title: "Upcoming events",
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<{ events: calendar_v3.Schema$Event[] | undefined }> => {
  const queryParams = new URL(request.url).searchParams;
  const limit = parseInt(queryParams.get("limit") || "10");

  const now = new Date();

  const events = await getEvents(request, {
    timeMin: now.toISOString(),
    maxResults: limit,
    singleEvents: true,
    orderBy: "startTime",
  });

  return {
    events,
  };
};

export default function Events() {
  const { events } = useLoaderData<{ events: calendar_v3.Schema$Event[] }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set("limit", e.target.value);
    setSearchParams(searchParams);
    revalidator.revalidate();
  };

  const limit = parseInt(searchParams.get("limit") || "10");

  console.log({ events });

  return (
    <section id="events">
      <header>
        <h1>Upcoming Events</h1>
        <label htmlFor="limit">
          Limit
          <StyledSelect
            id="limit"
            name="limit"
            defaultValue={limit}
            onChange={handleLimitChange}
          >
            <StyledOption value="5">5</StyledOption>
            <StyledOption value="10">10</StyledOption>
            <StyledOption value="20">20</StyledOption>
          </StyledSelect>
        </label>
        <p>Showing the next {events?.length} events</p>
      </header>
      <StyledUpcomingEvents>
        {events?.map((event) => <Event key={event.id} event={event} />)}
      </StyledUpcomingEvents>
    </section>
  );
}
