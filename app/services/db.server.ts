import mongoose from "mongoose";
import { createSessionStorage } from "@remix-run/node";

const SessionSchema = new mongoose.Schema({
  "oauth2:state": { type: String, required: true },
  // user: {
  //   provider: { type: String, required: false },
  //   id: { type: String, required: false },
  //   displayName: { type: String, required: false },
  //   name: { type: Object, required: false },
  //   emails: { type: Array, required: false },
  //   photos: { type: Array, required: false },
  //   _json: { type: Object, required: false },
  //   accessToken: { type: String, required: false },
  //   refreshToken: { type: String, required: false },
  // },
  "user:displayName": { type: String, required: false },
  // strategy: { type: String, required: false },
});

// Type of an hydrated document (with all the getters, etc...)
export type THydratedSessionModel = mongoose.HydratedDocumentFromSchema<
  typeof SessionSchema
>;

// Only the fields defined in the schema
export type TSessionModel = mongoose.InferSchemaType<typeof SessionSchema>;

export let Session: mongoose.Model<THydratedSessionModel>;

try {
  Session = mongoose.model<THydratedSessionModel>("Session");
} catch {
  Session = mongoose.model<THydratedSessionModel>("Session", SessionSchema);
}

export const createDatabaseSessionStorage = async ({ cookie, host, port }) => {
  await connect();

  async function createSession(
    fields: TSessionModel
  ): Promise<THydratedSessionModel> {
    const session = await Session.create(fields);
    console.log("db.server.ts createSession", { session });
    return session?._doc ? session?._doc : session;
  }

  async function readSession(key: string): Promise<THydratedSessionModel> {
    const session = await Session.findOne({ _id: key });
    console.log("db.server.ts readSession", { session });
    return session?._doc ? session?._doc : session;
  }

  async function updateSession(
    key: string,
    fields: TSessionModel
  ): Promise<THydratedSessionModel> {
    console.log("db.server.ts updateSession", { key, fields });

    const passedFields = fields?._doc ? fields?._doc : fields;

    console.log("db.server.ts updateSession", { passedFields, key });

    const hereWeGo = {
      "oauth2:state": passedFields["oauth2:state"],
      "user:displayName": passedFields?.user?.displayName,
    };

    console.log("db.server.ts updateSession", { hereWeGo });

    const session = await Session.findOneAndUpdate(
      {
        _id: key,
        fields: hereWeGo,
      },
      {
        new: true,
      }
    );

    console.log("db.server.ts updateSession", { session });

    return session?._doc ? session?._doc : session;
  }

  async function deleteSession(key: string): Promise<THydratedSessionModel> {
    console.log("db.server.ts deleteSession", { key });
    const session = await Session.findOneAndDelete({ id_: key });
    console.log("db.server.ts deleteSession", { session });
    return session?._doc ? session?._doc : session;
  }

  return createSessionStorage({
    cookie,
    async createData(data) {
      console.log("db.server.ts createData", data);
      const session = await createSession({
        ...data,
        "user:displayName": data?.user?.displayName,
      });
      console.log("createData session", session);
      return session._id;
    },
    async readData(args) {
      console.log("db.server.ts readData", args);
      return readSession(args);
    },
    async updateData(key, data) {
      console.log("db.server.ts updateData", key, data);
      updateSession(key, data);
    },
    async deleteData(key) {
      console.log("db.server.ts deleteData", key);
      return deleteSession(key);
    },
  });
};

let db: mongoose.Mongoose;

async function connect() {
  if (db) return db;

  if (process.env.NODE_ENV === "production") {
    db = await mongoose.connect(process.env.MONGODB_URI!);
  } else {
    // in development, need to store the db connection in a global variable
    // this is because the dev server purges the require cache on every request
    // and will cause multiple connections to be made
    if (!global.__db) {
      global.__db = await mongoose.connect(process.env.MONGODB_URI!);
    }
    db = global.__db;
  }
  return db;
}
connect();

export { mongoose, connect };
