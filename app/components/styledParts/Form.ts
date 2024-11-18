import styled from "@emotion/styled";
import { Form } from "@remix-run/react";

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  border-radius: 5px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .formTitle {
    font-size: 1.2rem;
  }

  .formSectionTitle {
    font-size: 1rem;
  }

  label {
    font-size: 0.7rem;
    color: white;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input,
  textarea {
    background: transparent;
    border: none;
    border-bottom: 1px solid white;
    padding: 0.5rem;
    color: white;
    word-break: break-all;
    width: 100%;
  }

  textarea {
    resize: none;
    height: 100px;
  }

  input[type="number"] {
    &:webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    &:webkit-outer-spin-button {
      -webkit-appearance: none;
    }

    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .inputWithSuffix {
    display: flex;
    align-items: end;
    gap: 0.5rem;
  }

  button {
    border: 1px solid white;
    background: transparent;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin: 15px 0 0;
    font-weight: bold;
    color: white;

    &:hover {
      border-color: gold;
      background: rgba(0, 0, 0, 0.2);
    }
  }

  button[type="submit"] {
  }

  .error {
    input[required],
    textarea[required] {
      border: 1px solid red;
    }
  }
`;

export const StyledFormContainer = StyledForm.withComponent("div");
