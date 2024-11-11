import { Form } from "@remix-run/react";
import styled from "@emotion/styled";
import React from "react";

const StyledForm = styled(Form)`
  button {
    display: flex;
    align-items: center;
    margin: 20px auto;
    padding: 0.5em 1em;
    border-radius: 5px;
    cursor: pointer;

    img {
      margin-right: 0.5em;
    }
  }
`;
interface SignInButtonProps {
  type: "Google" | "Facebook";
}
export const SignInButton = ({ type }: SignInButtonProps) => {
  let action = "/auth/google";
  let imgSrc = "/icons/google-logo.svg";
  let text = "Sign in with Google";
  switch (type) {
    case "Google":
      imgSrc = "/icons/google-logo.svg";
      action = "/auth/google";
      text = "Sign in with Google";
      break;
    case "Facebook":
      imgSrc = "/icons/facebook-logo.svg";
      action = "/auth/facebook";
      text = "Sign in with Facebook";
      break;
  }
  return (
    <StyledForm action={action} method="post">
      <button>
        <img src={imgSrc} alt="" />
        {text}
      </button>
    </StyledForm>
  );
};
