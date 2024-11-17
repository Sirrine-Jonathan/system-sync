import styled from "@emotion/styled";
import { type User } from "~/services/auth.server";
import { NavLink } from "@remix-run/react";
import { FlexContainer } from "./styledParts/FlexContainer";
import { DesktopOnly } from "./styledParts/DesktopOnly";

const StyledNav = styled.nav`
  margin: 1rem;
  padding: 1rem;
  border: 1px solid white;
  border-radius: 5px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1)
  );

  a {
    text-decoration: none;
    color: white;
    font-size: 1rem;

    &.active {
      text-decoration: underline;
      color: gold;
    }

    &:hover {
      text-decoration: underline;
      color: gold;
    }
  }

  .sectionRight {
    margin-left: auto;

    img {
      width: 1.5rem;
      cursor: pointer;
    }
  }
`;

const DisplayName = styled.div`
  font-size: 1.2rem;
`;

const Email = styled.div`
  font-size: 0.8rem;
  margin-bottom: 5px;
`;

export const DesktopNav = ({ user }: { user: User }) => {
  return (
    <DesktopOnly>
      <StyledNav>
        <FlexContainer gap="1em">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/habits">Habits</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>|
          <NavLink to="/about">About</NavLink>
          <FlexContainer
            className="sectionRight"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-end"
            gap="5px"
          >
            {user && <DisplayName>{user.displayName}</DisplayName>}
            {user && <Email>{user.emails?.[0]?.value}</Email>}
            {user && (
              <FlexContainer alignItems="flex-start" gap="1em">
                <a href="/settings">
                  <img src="/icons/settings.svg" alt="" />
                </a>
                <a href="/account">
                  <img src="/icons/account.svg" alt="" />
                </a>
                <a href="/auth/signout">
                  <img src="/icons/signout.svg" alt="" />
                </a>
              </FlexContainer>
            )}
          </FlexContainer>
        </FlexContainer>
      </StyledNav>
    </DesktopOnly>
  );
};
