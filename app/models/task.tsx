import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
	name: String,
});

let Task;
try {
	Task = mongoose.model("Task");
} catch {
	Task = mongoose.model("Task", TaskSchema);
}

export default Task