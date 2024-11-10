import { Form } from "@remix-run/react"
export default function Login() {
	return (
		<main id="loginPage">
			<header>
				<h1>Becoming You</h1>
			</header>
			<section>
				<Form action="/auth/google" method="post">
					<button id="googleLoginBtn"><img src="/icons/google-logo.svg" alt="google"/>Login with Google</button>
				</Form>
			</section>
		</main>
	)
}