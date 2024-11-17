import { SignInButton } from "./SignInButton";
import styled from "@emotion/styled";

const StyledCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 1rem;
`;

export const SignInCTA = () => {
  return (
    <StyledCard>
      <h1>Sign in to start tracking your tasks</h1>
      <p></p>
      <SignInButton type="Google" />
    </StyledCard>
  );
};
