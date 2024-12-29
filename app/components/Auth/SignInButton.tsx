import { Form } from "@remix-run/react";
import styled from "@emotion/styled";

const ButtonForm = styled(Form)`
  button {
    display: flex;
    align-items: center;
    margin: 20px auto;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    img {
      margin-right: 0.5rem;
    }
  }
`;
interface SignInButtonProps {
  successRedirect?: string;
}
export const SignInButton = ({ successRedirect }: SignInButtonProps) => {
  return (
    <ButtonForm action="/auth/google" method="post">
      {successRedirect && (
        <input
          type="hidden"
          name="successRedirect"
          value={`${successRedirect}`}
        />
      )}
      <button>
        <img src="/icons/google-logo.svg" alt="" />
        Sign in with Google
      </button>
    </ButtonForm>
  );
};
