import { styled } from "@emotion/styled";

const StyledMonth = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1em;

  .firstDay {
    grid-column-start: 1;
  }
`;

export const Month = () => {
  return (
    <div>
      <h1>Month</h1>
    </div>
  );
};
