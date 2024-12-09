import styled from "@emotion/styled";
import { type GoogleUser } from "~/services/auth.server";
import { NavLink } from "@remix-run/react";
import { FlexContainer } from "./styledParts/FlexContainer";
import { DesktopOnly } from "./styledParts/DesktopOnly";

const StyledNav = styled.nav`
  padding: 1rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1)
  );
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);

  a {
    text-decoration: none;
    color: white;
    font-size: 1rem;

    &.active {
      text-decoration: underline;
      color: crimson;
      pointer-events: none;
      cursor: default;
    }

    &:hover {
      text-decoration: underline;
      color: crimson;
    }
  }

  .sectionRight {
    margin-left: auto;

    a {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 100px;
      padding: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      img {
        width: 1.2rem;
        cursor: pointer;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
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

export const DesktopNav = ({ user }: { user?: GoogleUser }) => {
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
            <FlexContainer alignItems="center" gap="2em">
              <div>
                {user && <DisplayName>{user.displayName}</DisplayName>}
                {user && <Email>{user.emails?.[0]?.value}</Email>}
              </div>
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
        </FlexContainer>
      </StyledNav>
    </DesktopOnly>
  );
};
