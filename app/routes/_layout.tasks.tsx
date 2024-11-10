import { useState } from "react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import mongoose from "mongoose";
import Task from "~app/models/task";

export const loader = async () => {
	mongoose.connect(process.env.MONGODB_URI!);

	const tasks = await Task.find({});

	console.log({ tasks })

	return tasks;
};

export const action = async ({ request }: ActionFunctionArgs) => {
	mongoose.connect(process.env.MONGODB_URI!);


	const formData = await request.formData();
	console.log(formData);

	const _action = formData.get('_action');
	if (_action === 'updateTask') {
		const _id = formData.get('_id');
		console.log('updating parsed', JSON.parse(_id).buffer.toString());
		console.log('updating', _id?.toString());
		await Task.updateOne({ _id: _id.toString() }, {
			name: formData.get('name'),
		});
		return {};
	} else if (_action === 'deleteTask') {
		const _id = formData.get('_id');
		console.log('deleting', { _id: _id?.toString() });
		await Task.deleteOne({ _id });
		return {};
	} else if (_action === 'addTask') {
		const name = formData.get('name');
		console.log('adding', { name });
		await Task.create({
			name,
		});
		return {};
	}
	

	return {};
};

const TaskEditor = ({ task }: { task: Task }) => {
	const [isEditMode, setIsEditMode] = useState(false);

	const onDelete = () => {
		setIsEditMode(false);
	}

	return (
		<li className="taskContainer">
			<div className="taskDisplay">
				<div>{task.name}</div>
				{!isEditMode && <button className="edit" onClick={() => setIsEditMode(true)}><img src="/icons/edit.svg" alt="edit" /></button>}
				{isEditMode && <button className="close" onClick={() => setIsEditMode(false)}><img src="/icons/close.svg" alt="close" /></button>}
			</div>
			{isEditMode && (
				<div className="editFormContainer">
					<Form method="post">
						<input type="hidden" name="_action" value="updateTask" />
						<input type="hidden" name="_id" value={JSON.stringify(task._id)} />
						<label htmlFor="name">Task Name
							<input type="text" placeholder="Task Name" name="name" defaultValue={task.name} />
						</label>
						<button className="save" type='submit'>Save</button>
					</Form>
					<Form method="post" onSubmit={onDelete}>
						<input type="hidden" name="_action" value="deleteTask" />
						<input type="hidden" name="_id" value={task._id.toString()} />
						<button className="delete" type='submit'>Delete</button>
					</Form>
				</div>
			)}
		</li>
	);
}

export default function Tasks() {
	const actionData = useActionData();
	const loaderData = useLoaderData();

	console.log({ actionData, loaderData });

	loaderData?.forEach(({ _doc : task}) => {
		console.log(task.name);
	});

	return (
		<section id="tasks">
			<h1>Tasks</h1>
			<ul className="tasksList">
				{loaderData?.map(({ _doc : task}) => (
					<TaskEditor task={task} key={task._id} />
				))}
			</ul>
			<Form method="post">
				<input type="hidden" name="_action" value="addTask" />
				<input type="text" placeholder="Task Name" name="name" />
				<button type='submit'>Add</button>
			</Form>
		</section>
	);
}