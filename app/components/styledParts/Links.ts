import styled from "@emotion/styled";
import { NavLink } from "@remix-run/react";
import { StandardString } from "./Buttons";

export const IconNavLink = styled(NavLink)<{ danger?: boolean }>`
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

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: white;
  font-size: 1rem;
  transition: color 0.2s ease-in-out;

  &.active {
    border-bottom: 1px solid white;
    pointer-events: none;
    cursor: default;
  }

  &:hover {
    color: gold;
  }
`;

export const StyledExternalLink = styled.a`
  text-decoration: none;
  color: white;
  font-size: 1rem;
  transition: color 0.2s ease-in-out;
  background: transparent;

  &:hover {
    color: gold;
  }

  &:before {
    content: "↗";
    margin-right: 5px;
  }
`;

export const StandardLink = styled(NavLink)<{ danger?: boolean }>`
  ${StandardString}

  {{ danger }} {
    background: gold;
  }
`;
