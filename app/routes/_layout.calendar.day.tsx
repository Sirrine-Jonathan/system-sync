import type { LoaderFunction } from "@remix-run/node";
import { google, calendar_v3 } from "googleapis";
import { getSession } from "~app/services/session.server";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }): Promise<calendar_v3.Schema$Event[] | undefined> => {
	console.log("loader", request);
	// Get session and access token
	const session = await getSession(request);
	const accessToken = session.get("accessToken");
	if (!accessToken) throw new Error("User not authenticated");

	// Set up the OAuth2 client with access token
	const oauth2Client = new google.auth.OAuth2();
	oauth2Client.setCredentials({ access_token: accessToken });

	// Initialize Google Calendar API client
	const calendar = google.calendar({ version: "v3", auth: oauth2Client });

	// Fetch primary calendar events
	const response = await calendar.events.list({
		calendarId: "primary",
		timeMin: new Date().toISOString(), // start of current day
		timeMax: new Date().toISOString(), // end of current day
		maxResults: 10,
		singleEvents: true,
		orderBy: "startTime",
		
	});

	return response.data.items; // These are the user’s calendar events
}
export default function Calendar() {
	const events = useLoaderData<calendar_v3.Schema$Event[] | undefined>();
	return (
		<div>
			{events && events.map((event) => (
				<div key={event.id}>
					<h2>{event.summary}</h2>
					<p>{event.start?.dateTime}</p>
					<p>{event.end?.dateTime}</p>
				</div>
			))}
			<Outlet />
		</div>
	);
}