import styled from "@emotion/styled";
import { type GoogleUser } from "~/services/auth.server";
import { FlexContainer } from "../styledParts/FlexContainer";
import { DesktopOnly } from "../styledParts/DesktopOnly";
import { StyledNavLink, StyledIconLink } from "../styledParts/Links";

const StyledNav = styled.nav`
  padding: 1rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1)
  );

  .sectionRight {
    margin-left: auto;
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
        <FlexContainer gap="1em" justifyContent="flex-start">
          <FlexContainer gap="1em">
            <StyledNavLink to="/tasklists">Tasks</StyledNavLink>
            <StyledNavLink to="/calendar/day">Calendar</StyledNavLink>
          </FlexContainer>
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
              {user ? (
                <FlexContainer alignItems="flex-start" gap="1em">
                  <StyledIconLink to="/settings">
                    <img src="/icons/settings.svg" alt="" />
                  </StyledIconLink>
                  <StyledIconLink to="/account">
                    <img src="/icons/account.svg" alt="" />
                  </StyledIconLink>
                  <StyledIconLink to="/auth/signout">
                    <img src="/icons/signout.svg" alt="" />
                  </StyledIconLink>
                </FlexContainer>
              ) : (
                <StyledIconLink to="/auth/signout">
                  <img src="/icons/signout.svg" alt="" />
                </StyledIconLink>
              )}
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </StyledNav>
    </DesktopOnly>
  );
};
