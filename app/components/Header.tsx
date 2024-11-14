import { useState, useRef, useEffect } from "react";
import { NavLink, useMatches } from "@remix-run/react";
import { FlexContainer } from "./styledParts/FlexContainer";
import { Avatar } from "./styledParts/Avatar";

import styled from "@emotion/styled";

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
  align-items: "center";
  background: rgba(255, 255, 255, 0.1);

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  h1 {
    font-size: 2rem;

    a {
      text-decoration: none;
      color: white;
    }
  }

  h2 {
    font-size: 1rem;
  }

  hr {
    border-color: rgba(255, 255, 255, 0.7);
    margin: 30px 0;
  }

  .menu {
    position: absolute;
    top: 0;
    right: 0;
    width: 50dvw;
    max-width: 300px;
    background: black;
    border-bottom-left-radius: 5px;
    padding: 1em;
    list-style: none;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    color: white;
    z-index: 1;
    height: 100%;
    box-sizing: border-box;

    ul {
      padding: 0;
      margin: 0;

      li {
        margin: 0.5em 0;
        list-style: none;
        font-size: 1em;
        display: flex;
        align-items: center;
        gap: 0.5em;
        cursor: pointer;

        img {
          width: 1.5rem;
        }

        ul li {
          display: block;
          font-size: 0.8em;
          margin: 0.5em 0 0 1em;

          a {
            display: block;
            width: 100%;
          }
        }

        a {
          color: white;
          text-decoration: none;
          transition: color 0.2s ease-in-out;
          width: 100%;

          &:hover {
            color: gold;
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
      top: 1em;
      right: 1em;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 100px;
      color: white;
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
        border-color: white;
      }
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
      <FlexContainer
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <h1>
          <NavLink to="/dashboard">Become You</NavLink>
        </h1>
        <h2>{subtitle}</h2>
      </FlexContainer>
      <div className="menuContainer">
        {imageUrl && (
          <Avatar onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img ref={avatarImageRef} src={usableImageUrl} alt="profile" />
          </Avatar>
        )}
        {isMenuOpen && (
          <div className="menu">
            <button className="closeMenu" onClick={() => setIsMenuOpen(false)}>
              <img src="/icons/close.svg" alt="close" />
            </button>
            <ul>
              <li>
                <img src="/icons/dashboard.svg" alt="Dashboard" />
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                <img src="/icons/event.svg" alt="Events" />
                <a href="/events">Events</a>
              </li>
              <li>
                <img src="/icons/task.svg" alt="Tasks" />
                <a href="/tasks">Tasks</a>
              </li>
              <li>
                <img src="/icons/habit.svg" alt="Habits" />
                <a href="/habits">Habits</a>
              </li>
              <hr />
              <li>
                <img src="/icons/calendar.svg" alt="Calendar" />
                <a href="/calendar">
                  Calendar
                  <ul>
                    <li>
                      <a href="/calendar/month">Month</a>
                    </li>
                    <li>
                      <a href="/calendar/week">Week</a>
                    </li>
                    <li>
                      <a href="/calendar/day">Day</a>
                    </li>
                  </ul>
                </a>
              </li>
              <hr />
              <li>
                <img src="/icons/about.svg" alt="About" />
                <a href="/about">About</a>
              </li>
              <li>
                <img src="/icons/settings.svg" alt="Settings" />
                <a href="/settings">Settings</a>
              </li>
              <hr />
              <li>
                <a href="/auth/signout">
                  <FlexContainer
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <span>Sign Out</span>
                    <img src="/icons/signout.svg" alt="" />
                  </FlexContainer>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </StyledHeader>
  );
};
