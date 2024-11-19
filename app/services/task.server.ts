import { mongoose } from "~/services/db.server";

const TaskSchema = new mongoose.Schema({
  _ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: false },
  dueDate: { type: Date, required: false },
  duration: { type: Number, required: false, default: 0.5 },
  priority: { type: Number, required: false, default: 0 },
});

// Type of an hydrated document (with all the getters, etc...)
export type THydratedTaskModel = mongoose.HydratedDocumentFromSchema<
  typeof TaskSchema
>;

// Only the fields defined in the schema
export type TTaskModel = mongoose.InferSchemaType<typeof TaskSchema>;

export let Task: mongoose.Model<THydratedTaskModel>;

try {
  Task = mongoose.model<THydratedTaskModel>("Task");
} catch {
  Task = mongoose.model<THydratedTaskModel>("Task", TaskSchema);
}

export async function getTasksByOwner({
  _id,
}: {
  _id: string;
}): Promise<THydratedTaskModel[]> {
  const tasks = await Task.find({ _ownerId: _id }).exec();
  return tasks;
}

export async function addTask(
  _id: string,
  { name, description, dueDate, duration, priority }: TTaskModel
): Promise<THydratedTaskModel> {
  const task = await Task.create({
    _ownerId: _id,
    name,
    description,
    dueDate,
    duration,
    priority,
  });
  return task;
}

export async function updateTask(
  id: string,
  name: string
): Promise<THydratedTaskModel> {
  const task = await Task.findOneAndUpdate(
    { _id: id },
    { name },
    { new: true }
  );
  return task;
}

export async function deleteTask(id: string): Promise<THydratedTaskModel> {
  const task = await Task.findOneAndDelete({ _id: id });
  return task;
}
