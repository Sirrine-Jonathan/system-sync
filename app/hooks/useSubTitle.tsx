import { useState, useEffect } from "react";

export const useSubTitle = () => {
	const [title, setTitle] = useState<string>("");

	useEffect(() => {
		const title = document.title;
		setTitle(title);
	}, []);

	return title;
};