import { getSession } from "./session.server";
import { google, calendar_v3 } from "googleapis";

// UNTESTED
export const createEvent = async (event: calendar_v3.Schema$Event) => {
  const calendar = google.calendar({ version: "v3" });

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  return response.data;
};

export const getEvents = async (
  request: Request,
  options: {
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    singleEvents?: boolean;
    orderBy?: string;
  }
) => {
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
    timeMin: options.timeMin,
    timeMax: options.timeMax,
    maxResults: options.maxResults,
    singleEvents: options.singleEvents,
    orderBy: options.orderBy,
  });

  return response.data.items; // These are the user’s calendar events
};
