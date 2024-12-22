import styled from "@emotion/styled";
import { Base, Levels } from "./Base";

export const StyledButton = styled.button`
  ${Base}
  ${Levels}
`;

export const StyledIconButton = styled.button<{
  context?: "standard" | "danger" | "warning" | "transparent";
  size?: "small" | "normal" | "large";
}>`
  --bg-standard: rgba(255, 255, 255, 0.1);
  --bg-danger: rgba(255, 0, 0, 0.8);
  --bg-warning: rgba(255, 165, 0, 0.1);
  --bg-transparent: transparent;
  --small: 15px;
  --normal: 30px;
  --large: 45px;

  --size: ${({ size }) => {
    if (!size) return "var(--normal);";
    switch (size) {
      case "small":
        return "var(--small);";
      case "normal":
        return "var(--normal);";
      case "large":
        return "var(--large);";
      default:
        return "var(--normal);";
    }
  }};

  background: ${({ context }) => {
    if (!context) return "var(--bg-standard);";
    switch (context) {
      case "danger":
        return "var(--bg-danger);";
      case "warning":
        return "var(--bg-warning);";
      case "transparent":
        return "var(--bg-transparent);";
      default:
        return "var(--bg-standard);";
    }
  }}
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  height: var(--size);
  width: var(--size);
  border-radius: 5rem;

  ${({ size }) => {
    switch (size) {
      case "small":
        return "padding: 0.2rem;";
      case "normal":
        return "padding: 0.5rem;";
      case "large":
        return "padding: 1rem;";
      default:
        return "padding: 0.5rem;";
    }
  }}


  img {
    ${({ size }) => {
      switch (size) {
        case "small":
          return "width: 0.5rem;";
        case "normal":
          return "width: 1rem;";
        case "large":
          return "width: 1.5rem;";
        default:
          return "width: 1rem;";
      }
    }}
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const IconNavButton = styled.button<{ danger?: boolean }>`
  --size: 1.2rem;

  background: ${({ danger }) => (danger ? "crimson" : "rgba(0, 0, 0, 0.8)")};
  border-radius: 100px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  gap: 10px;
  font-size: var(--size);
  line-height: var(--size);
  border: 1px solid white;
  cursor: pointer;

  img {
    width: var(--size);
    cursor: pointer;
  }

  span {
    padding-left: 20px;
  }

  span + img {
    padding-right: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 1);
  }

  @media (max-width: 767px) {
    --size: 0.8rem;
  }
`;

export const StyledBigButton = styled(StyledButton)<{ danger?: boolean }>`
  --size: 1.2rem;

  background: ${({ danger }) => (danger ? "crimson" : "rgba(0, 0, 0, 0.8)")};
  border-radius: 100px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  gap: 10px;
  font-size: var(--size);
  line-height: var(--size);
  border: 1px solid black;
  cursor: pointer;

  img {
    width: var(--size);
    cursor: pointer;
  }

  span {
    padding-left: 20px;
  }

  span + img {
    padding-right: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 1);
  }

  @media (max-width: 767px) {
    --size: 0.8rem;
  }
`;
