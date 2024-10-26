export default function Login() {
	return (
		<div className="mx-auto flex min-h-screen flex-col items-center justify-center p-4">
			<header className="flex flex-col items-center justify-center gap-4 p-4">
				<h1 className="text-3xl font-bold">Becoming You!</h1>
			</header>
			<a
				href="/auth/google"
				className="inline-block rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-900"
			>
				<img src="/google.png" alt=""/>Login with Google <span aria-hidden="true">&rarr;</span>
			</a>
		</div>
	);
}