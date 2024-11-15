import styled from "@emotion/styled";

export const StyledCalenderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    min-width: 500px;
    text-align: center;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    margin: 0 1em;

    img {
      width: 1.5rem;
    }
  }
`;
