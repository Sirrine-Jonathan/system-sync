import styled from "@emotion/styled";

export const Well = styled.div`
  background: var(--secondary-bg);
  border-radius: 5px;
  padding: 1rem;
  color: var(--color-white);

  hr {
    margin: 1rem 0;
    border: none;
    border-bottom: 1px solid var(--color-white);
  }
`;

export const ClearWell = styled(Well)`
  background: transparent;
`;
