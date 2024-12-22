import styled from "@emotion/styled";
import { FlexContainer } from "./styledParts/FlexContainer";

const StyledBreadcrumbs = styled.div`
  margin: 0 0 1rem 0;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;

      img {
        width: 1.2rem;
      }

      a {
        color: white;
        text-decoration: none;

        &:hover {
          color: gold;
        }

        &.current {
          pointer-events: none;
          cursor: default;
          color: gold;
        }
      }

      &:first-child a {
        margin-left: 0;
      }

      &:last-child a {
        margin-right: 0;
      }
    }
  }

  @media (max-width: 767px) {
    font-size: 1.2em;
  }
`;

export const Breadcrumbs = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledBreadcrumbs>
      <ul>
        {children?.map((child, index) => {
          return (
            <li key={index}>
              {child}
              {index < children.length - 1 && (
                <img src="/icons/arrow-right.svg" alt="" />
              )}
            </li>
          );
        })}
      </ul>
    </StyledBreadcrumbs>
  );
};
