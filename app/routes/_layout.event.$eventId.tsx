import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getEvent } from "~/services/event.server";
import { calendar_v3 } from "googleapis";
import { Event } from "~/components/Events/Event";
import { FlexContainer } from "~/components/styledParts/FlexContainer";
import { useIsMobile } from "~/hooks/useIsMobile";

export const handle = {
  title: "Event",
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { eventId } = params;
  if (!eventId) {
    return null;
  }
  return await getEvent(request, { eventId });
};

export default function SingleEvent() {
  const event = useLoaderData<calendar_v3.Schema$Event>();
  const { isMobile } = useIsMobile();
  return (
    <FlexContainer
      id="event"
      flexDirection={isMobile ? "column" : "row"}
      justifyContent="flex-start"
      alignItems="stretch"
      gap="1em"
    >
      <div style={{ flex: "1" }}>
        <Event event={event} expanded />
      </div>
      <Outlet context={{ event }} />
    </FlexContainer>
  );
}
