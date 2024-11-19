import { mongoose } from "~/services/db.server";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  accessToken: { type: String, required: false },
});

// Type of an hydrated document (with all the getters, etc...)
export type THydratedUserModel = mongoose.HydratedDocumentFromSchema<
  typeof UserSchema
>;

// Only the fields defined in the schema
export type TUserModel = mongoose.InferSchemaType<typeof UserSchema>;

export let User: mongoose.Model<THydratedUserModel>;

try {
  User = mongoose.model<THydratedUserModel>("User");
} catch {
  User = mongoose.model<THydratedUserModel>("User", UserSchema);
}

export async function getUsers(): Promise<THydratedUserModel[]> {
  const users = await User.find().exec();
  return users;
}

export async function addUser(fields: TUserModel): Promise<THydratedUserModel> {
  const user = await User.create(fields);
  return user;
}

export async function updateUser(
  id: string,
  email: string
): Promise<THydratedUserModel> {
  const user = await User.findOneAndUpdate(
    { _id: id },
    { email },
    { new: true }
  );
  return user;
}

export async function deleteUser(id: string): Promise<THydratedUserModel> {
  const user = await User.findOneAndDelete({ _id: id });
  return user;
}

export async function findOrCreateUser(
  fields: TUserModel
): Promise<THydratedUserModel> {
  const user = await User.findOne({ email: fields.email });
  if (user) return user;
  return await addUser(fields);
}
