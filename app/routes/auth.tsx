// app/routes/auth.tsx
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

// Initialize the session
export const loader: LoaderFunction = () => {
	return redirect("/auth/google");
}