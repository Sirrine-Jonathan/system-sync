import { createEvent } from "./event.server";
import { getSession } from "./session.server";
import { google, tasks_v1 } from "googleapis";

export type TaskWithListTitle = tasks_v1.Schema$Task & {
  listTitle: tasks_v1.Schema$TaskList["title"];
  listId: tasks_v1.Schema$TaskList["id"];
};

export type TaskListWithTasks = tasks_v1.Schema$TaskList & {
  tasks: TaskWithList[];
};

export type TaskInList = tasks_v1.Schema$TaskList & {
  task: TaskWithList;
};

const getService = async (request: Request) => {
  // Get session and access token
  const session = await getSession(request);
  const accessToken = session.get("accessToken");

  if (!accessToken) throw new Error("User not authenticated");

  // Set up the OAuth2 client with access token
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Initialize Google Calendar API client
  return google.tasks({ version: "v1", auth: oauth2Client });
};

export const getLists = async (request: Request) => {
  const googleService = await getService(request);
  return await googleService.tasklists.list().then((res) => res.data.items);
};

export const getListById = async (request: Request, id: string) => {
  const googleService = await getService(request);
  return await googleService.tasklists
    .get({
      tasklist: id,
    })
    .then((res) => res.data);
};

export const getTasksForList = async (
  request: Request,
  options?: { tasklist: string }
) => {
  let tasklist = null;
  if (options?.tasklist) {
    tasklist = options.tasklist;
  } else {
    const lists = await getLists(request);
    tasklist = lists?.[0].id;
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  return await googleService.tasks
    .list({
      maxResults: 10,
      tasklist,
    })
    .then((res) => res.data.items);
};

export const getTaskById = async (
  request: Request,
  options: { taskId: string; tasklist: string }
) => {
  const { taskId, tasklist } = options;
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  return await googleService.tasks
    .get({
      tasklist,
      task: taskId,
    })
    .then((res) => res.data);
};

export const getListsWithTasks = async (request: Request) => {
  const allTasks: TaskListWithTasks[] = [];
  const lists = await getLists(request);

  if (!lists) {
    throw new Error("Lists not found");
  }

  const promises: Promise<tasks_v1.Schema$Task[] | undefined>[] = [];

  for (const list of lists) {
    if (!list.id) {
      throw new Error("List ID is required");
    }
    promises.push(getTasksForList(request, { tasklist: list.id }));
  }

  const tasks = await Promise.all(promises);
  for (let i = 0; i < tasks.length; i++) {
    const tasksForList = tasks[i];
    const tasksForListWithListTitle = tasksForList?.map((task) => ({
      ...task,
      listTitle: lists[i].title,
      listId: lists[i].id,
    }));
    if (tasksForList) {
      allTasks.push({
        ...lists[i],
        tasks: tasksForListWithListTitle || [],
      });
    }
  }
  return allTasks;
};

export const getListByIdWithTasks = async (
  request: Request,
  id: string
): Promise<TaskListWithTasks> => {
  const list = await getListById(request, id);
  const tasks = await getTasksForList(request, { tasklist: id });
  return { ...list, tasks: tasks || [] };
};

export const getTaskInList = async (
  request: Request,
  options: { taskId: string; tasklist: string }
) => {
  const { taskId, tasklist } = options;
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  const list = await getListById(request, tasklist);
  const task = await googleService.tasks
    .get({
      tasklist,
      task: taskId,
    })
    .then((res) => res.data);

  return { ...list, task };
};

export const createTaskList = async (request: Request, title: string) => {
  const googleService = await getService(request);
  const list = await googleService.tasklists
    .insert({
      resource: {
        title,
      },
    })
    .then((res) => res.data);

  return list;
};

export const updateTaskList = async (
  request: Request,
  options: { listId: string; title: string }
) => {
  const { listId, title } = options;
  if (!listId) {
    throw new Error("List ID is required");
  }
  const googleService = await getService(request);
  const list = await googleService.tasklists
    .update({
      tasklist: listId,
      resource: {
        id: listId,
        title,
      },
    })
    .then((res) => res.data);

  return list;
};

export const createTask = async (
  request: Request,
  options: { tasklist: string; title: string; notes?: string }
) => {
  const { tasklist, title, notes } = options;
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  const task = await googleService.tasks
    .insert({
      tasklist,
      resource: {
        title,
        notes,
      },
    })
    .then((res) => res.data);

  return task;
};

export const updateTask = async (
  request: Request,
  options: { taskId: string; tasklist: string; title: string }
) => {
  const { taskId, tasklist, title } = options;
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  const task = await googleService.tasks
    .update({
      tasklist,
      task: taskId,
      resource: {
        title,
      },
    })
    .then((res) => res.data);

  return task;
};

export const updateTaskStatus = async (
  request: Request,
  options: {
    taskId: string;
    tasklist: string;
    status: "completed" | "needsAction";
  }
) => {
  const { taskId, tasklist } = options;
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  const task = await googleService.tasks
    .patch({
      tasklist,
      task: taskId,
      resource: {
        status: options.status,
      },
    })
    .then((res) => res.data);

  return task;
};

export const markComplete = async (
  request: Request,
  options: { taskId: string; tasklist: string }
) => updateTaskStatus(request, { ...options, status: "completed" });

export const markIncomplete = async (
  request: Request,
  options: { taskId: string; tasklist: string }
) => updateTaskStatus(request, { ...options, status: "needsAction" });

export const deleteTask = async (
  request: Request,
  options: { taskId: string; tasklist: string }
) => {
  const { taskId, tasklist } = options;
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  const googleService = await getService(request);
  const task = await googleService.tasks
    .delete({
      tasklist,
      task: taskId,
    })
    .then((res) => res.data);

  return task;
};

// deletes the task from the tasklist
// creates a calendar event with the task title
export const scheduleTask = async (
  request: Request,
  options: {
    taskId: string;
    tasklist: string;
    date?: string;
    duration?: number;
  }
) => {
  const { taskId, tasklist } = options;
  if (!taskId) {
    throw new Error("Task ID is required");
  }
  if (!tasklist) {
    throw new Error("Tasklist ID is required");
  }
  // set default duration in hours
  if (!options.duration) {
    options.duration = 0.5;
  }
  // set default date to today
  if (!options.date) {
    options.date = new Date().toISOString().split("T")[0];
  }
  const task = await getTaskInList(request, { taskId, tasklist });
  const event = {
    summary: task.title,
    start: {
      dateTime: options.date,
    },
  };
  return createEvent(request, event);
};
