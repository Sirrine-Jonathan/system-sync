import styled from "@emotion/styled";

export const Well = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  padding: 1rem;

  hr {
    margin: 1rem 0;
    border: none;
    border-bottom: 1px solid white;
  }

  a {
    color: white;
    text-decoration: none;

    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .wellTitle {
        text-decoration: underline;
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: white;
  }
`;

export const ClearWell = styled(Well)`
  background: transparent;
`;
