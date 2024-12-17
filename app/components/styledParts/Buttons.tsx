import styled from "@emotion/styled";
import { IconNavLink } from "./Links";

export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
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

export const StandardString = `
  display: block;
  background: rgba(0, 0, 0, 0.8); 
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0;
  color: white;
  cursor: pointer;
  border: 1px solid white;
  font-size: 1rem;
  line-height: 1rem;
  text-decoration: none;

  &:hover {
    color: gold;
  }

  @media (max-width: 767px) {
    font-size: 0.8rem;
    line-height: 0.8rem;
  }
`;

export const StandardButton = styled.button<{ danger?: boolean }>`
  ${StandardString}

  {{ danger }} {
    background: crimson;
  }
`;
