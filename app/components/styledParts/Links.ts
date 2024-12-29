import styled from "@emotion/styled";
import { NavLink } from "@remix-run/react";
import { StyledButton } from "./Buttons";

export const StyledLink = styled(NavLink)`
  color: var(--color-white);
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  background: transparent;

  &:hover {
    color: var(--accent-color);
  }
`;

export const StyledNavLink = StyledLink.withComponent(NavLink);

export const StyledExternalLink = styled.a`
  text-decoration: none;
  color: var(--color-white);
  font-size: 1rem;
  transition: color 0.2s ease-in-out;
  background: transparent;

  &:hover {
    color: var(--accent-color);
  }

  &:before {
    content: "↗";
    margin-right: 5px;
  }
`;

export const StyledButtonLink = StyledButton.withComponent(NavLink);

export const StyledIconLink = styled(NavLink)`
  background: rgba(0, 0, 0, 0.3);
  padding: 0.6rem;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  img {
    width: 1.5rem;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const StyledBigLink = styled(NavLink)<{ danger?: boolean }>`
  --size: 1.2rem;

  background: ${({ danger }) => (danger ? "crimson" : "rgba(0, 0, 0, 0.8)")};
  border-radius: 100px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--color-white);
  gap: 10px;
  font-size: var(--size);
  line-height: var(--size);
  border: 1px solid var(--color-white);
  cursor: pointer;
  width: max-content;

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

  &.active {
    border-bottom: 1px solid var(--color-white);
    pointer-events: none;
    cursor: default;
  }

  @media (max-width: 767px) {
    --size: 0.8rem;

    span {
      display: none;
      & + img {
        padding-right: 0;
      }
    }
  }
`;
