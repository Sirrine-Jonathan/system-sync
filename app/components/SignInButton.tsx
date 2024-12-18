import { Form } from "@remix-run/react";
import styled from "@emotion/styled";

const ButtonForm = styled(Form)`
  button {
    display: flex;
    align-items: center;
    margin: 20px auto;
    padding: 0.5em 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    img {
      margin-right: 0.5rem;
    }
  }
`;
interface SignInButtonProps {
  type: "Google" | "Facebook";
  successRedirect?: string;
}
export const SignInButton = ({ type, successRedirect }: SignInButtonProps) => {
  let action = "/auth/google";
  let imgSrc = "/icons/google-logo.svg";
  let text = "Sign in with Google";
  switch (type.toLowerCase()) {
    case "google":
      imgSrc = "/icons/google-logo.svg";
      action = "/auth/google";
      text = "Sign in with Google";
      break;
    case "facebook":
      imgSrc = "/icons/facebook-logo.svg";
      action = "/auth/facebook";
      text = "Sign in with Facebook";
      break;
  }

  return (
    <ButtonForm action={action} method="post">
      {successRedirect && (
        <input
          type="hidden"
          name="successRedirect"
          value={`${successRedirect}`}
        />
      )}
      <button>
        <img src={imgSrc} alt="" />
        {text}
      </button>
    </ButtonForm>
  );
};
