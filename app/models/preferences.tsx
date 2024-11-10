import mongoose from "mongoose";

const PreferencesSchema = new mongoose.Schema({
	userId: String,
	preferences: Object,
});

export default mongoose.model("Preferences", PreferencesSchema)