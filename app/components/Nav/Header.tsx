import { useState, useRef, useEffect } from "react";
import { NavLink, useMatches } from "@remix-run/react";
import { FlexContainer } from "../styledParts/FlexContainer";
import { Avatar, DesktopAvatar } from "../styledParts/Avatar";

import styled from "@emotion/styled";
import { MobileOnly } from "../styledParts/MobileOnly";
import { useIsMobile } from "~/hooks/useIsMobile";
import { SignOutButton } from "../Auth/SignOutButton";
import { Small } from "../styledParts/Text";

interface RouteHandle {
  title: string;
}

const useSubtitle = () => {
  const matches = useMatches();
  const leafRoute = matches[matches.length - 1];
  const subtitle = leafRoute.handle as RouteHandle | undefined;
  return subtitle?.title;
};

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1));

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: var(--color-white);
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1rem;
  }

  hr {
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin: 30px 0;
  }

  .menu {
    position: absolute;
    top: 0;
    right: 0;
    width: 80dvw;
    max-width: 300px;
    background: #111;
    border-bottom-left-radius: 5px;
    padding: 1rem;
    list-style: none;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    color: var(--color-white);
    z-index: 1;
    height: 100%;
    box-sizing: border-box;

    ul {
      padding: 0;
      margin: 0;

      li {
        margin: 0.5em 0;
        list-style: none;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        img {
          width: 1.5rem;
        }

        ul li {
          display: block;
          font-size: 0.8rem;
          margin: 0.5em 0 0 1rem;

          a {
            display: block;
            width: 100%;
          }
        }

        a {
          color: var(--color-white);
          text-decoration: none;
          transition: color 0.2s ease-in-out;
          width: 100%;

          &:hover {
            color: var(--accent-color);
          }

          img {
            width: 1.5rem;
            margin-left: auto;
          }
        }
      }
    }

    .closeMenu {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 100px;
      color: var(--color-white);
      cursor: pointer;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s ease-in-out;

      img {
        width: 1rem;
      }

      &:hover {
        border-color: var(--color-white);
      }
    }
  }

  #logo {
    --width: 70px;
    width: var(--width);
    margin: 0 20px 0 0;
    border-radius: var(--width);
    border: 3px solid var(--color-white);
  }

  @media (max-width: 767px) {
    #logo {
      --width: 50px;
    }

    h1 {
      font-size: 1.2rem;
    }

    h2 {
      font-size: 0.7rem;
    }
  }
`;

export const FALLBACK_IMAGE_URL = "/icons/avatar.svg";

export const Header = ({ imageUrl }: { imageUrl?: string }) => {
  const subtitle = useSubtitle();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usableImageUrl, setUsableImageUrl] = useState(
    imageUrl || FALLBACK_IMAGE_URL
  );

  const { isMobile } = useIsMobile();

  const AvatarTag = isMobile ? Avatar : DesktopAvatar;

  const avatarImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    avatarImageRef.current?.addEventListener("load", () => {
      setUsableImageUrl(usableImageUrl || FALLBACK_IMAGE_URL);
    });
    avatarImageRef.current?.addEventListener("error", () => {
      setUsableImageUrl(FALLBACK_IMAGE_URL);
    });
  }, [usableImageUrl, imageUrl]);

  return (
    <StyledHeader>
      <NavLink to="/dashboard">
        <FlexContainer
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <h1>System Sync</h1>
          <Small>{subtitle}</Small>
        </FlexContainer>
      </NavLink>
      <div className="menuContainer">
        {imageUrl && (
          <AvatarTag onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img ref={avatarImageRef} src={usableImageUrl} alt="profile" />
          </AvatarTag>
        )}
        {isMenuOpen && (
          <MobileOnly>
            <div className="menu">
              <button
                className="closeMenu"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="/icons/close.svg" alt="close" />
              </button>
              <ul>
                <li>
                  <img src="/icons/task.svg" alt="" />
                  <a href="/tasklists">Tasks</a>
                </li>
                <li>
                  <img src="/icons/calendar.svg" alt="" />
                  <a href="/calendar/day">Calendar</a>
                </li>
                <li>
                  <img src="/icons/account.svg" alt="" />
                  <a href="/account">Account</a>
                </li>
                <li>
                  <img src="/icons/settings.svg" alt="" />
                  <a href="/settings">Settings</a>
                </li>
                <li>
                  <img src="/icons/about.svg" alt="About" />
                  <a href="/about">About</a>
                </li>
                <hr />
                <li>
                  <SignOutButton />
                </li>
              </ul>
            </div>
          </MobileOnly>
        )}
      </div>
    </StyledHeader>
  );
};
