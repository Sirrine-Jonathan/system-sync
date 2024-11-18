import { getSession } from "./session.server";
import { google, calendar_v3 } from "googleapis";

// UNTESTED
export const createEvent = async (
  request: Request,
  resource: calendar_v3.Schema$Event
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

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource,
  });

  return response.data;
};

export const updateEvent = async (
  request: Request,
  patch: calendar_v3.Schema$Event
) => {
  if (!patch.id) {
    throw new Error("Event ID is required");
  }
  const eventId = patch.id;
  delete patch.id;

  // Get session and access token
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken) throw new Error("User not authenticated");

  // Set up the OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Initialize Google Calendar API client
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = await getEvent(request, { eventId });

  const resource = {
    ...event,
    ...patch,
  };

  const response = await calendar.events.update({
    calendarId: "primary",
    eventId,
    resource,
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

export const getEvent = async (
  request: Request,
  options: { eventId: string }
) => {
  const { eventId } = options;
  // Get session and access token
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken) throw new Error("User not authenticated");

  // Set up the OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.get({
    calendarId: "primary",
    eventId,
  });

  return response.data;
};

export const deleteEvent = async (
  request: Request,
  options: { eventId: string }
) => {
  const { eventId } = options;
  // Get session and access token
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  if (!accessToken) throw new Error("User not authenticated");

  // Set up the OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Initialize Google Calendar API client
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });

  return response.data;
};
