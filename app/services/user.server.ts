import { mongoose } from '~/services/db.server'

const UserSchema = new mongoose.Schema({
    profile: {
        id: { type: String, required: false },
        email: { type: String, required: false },
        verified_email: { type: Boolean, required: false },
        name: { type: String, required: false },
        given_name: { type: String, required: false },
        family_name: { type: String, required: false },
        picture: { type: String, required: false },
    },
    tokens: {
        accessToken: { type: String, required: false },
        refreshToken: { type: String, required: false },
    },
    pillars: {
        name: { type: String, required: false },
        frequency: { type: Number, required: false },
    },
    settings: {
        timezone: { type: String, required: false },
        theme: { type: String, required: false },
        notifications: { type: Boolean, required: false },
        reminders: { type: Boolean, required: false },
    },
})

// Type of an hydrated document (with all the getters, etc...)
export type THydratedUserModel = mongoose.HydratedDocumentFromSchema<
    typeof UserSchema
>

// Only the fields defined in the schema
export type TUserModel = mongoose.InferSchemaType<typeof UserSchema>

export let User: mongoose.Model<THydratedUserModel>

try {
    User = mongoose.model<THydratedUserModel>('User')
} catch {
    User = mongoose.model<THydratedUserModel>('User', UserSchema)
}

export async function getUsers(): Promise<THydratedUserModel[]> {
    return await User.find().exec()
}

export async function addUser(fields: TUserModel): Promise<THydratedUserModel> {
    return await User.create(fields)
}

export async function updateUser(id: string, email: string) {
    return await User.findOneAndUpdate({ _id: id }, { email }, { new: true })
}

export async function deleteUser(id: string) {
    return await User.findOneAndDelete({ _id: id })
}

export async function findOrCreateUser(
    fields: TUserModel
): Promise<THydratedUserModel> {
    if (!fields.profile?.email) throw new Error('No email provided')
    const user = await User.findOne({ 'profile.email': fields.profile.email })
    if (user) return user
    return await addUser(fields)
}
