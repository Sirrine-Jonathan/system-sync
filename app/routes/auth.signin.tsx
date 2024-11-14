import { Header } from "~/app/components/Header";
import { SignInButton } from "~/app/components/SignInButton";

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
