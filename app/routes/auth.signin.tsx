import { Header } from "~/components/Header";
import { SignInButton } from "~/components/SignInButton";

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
