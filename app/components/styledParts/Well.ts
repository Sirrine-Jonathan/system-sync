import styled from "@emotion/styled";

export const Well = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  padding: 1rem;
  color: white;

  hr {
    margin: 1rem 0;
    border: none;
    border-bottom: 1px solid white;
  }
`;

export const ClearWell = styled(Well)`
  background: transparent;
`;
