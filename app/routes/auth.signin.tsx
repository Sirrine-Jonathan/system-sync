import { Header } from "~/components/Nav/Header";
import { SignInButton } from "~/components/Auth/SignInButton";

export const handle = {
  title: "Sign in",
};
export default function SignIn() {
  return (
    <main>
      <Header />
      <section>
        <SignInButton type="Google" />
      </section>
    </main>
  );
}
