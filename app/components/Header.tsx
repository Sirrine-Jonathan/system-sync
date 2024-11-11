import { useState } from "react";
import { useSubtitle } from "~/app/hooks/useSubtitle";
import { NavLink } from "@remix-run/react";
import { FlexContainer } from "./styledParts/FlexContainer";
import { Avatar } from "./styledParts/Avatar";

import styled from "@emotion/styled";

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

        ul li {
          font-size: 0.8em;
          margin: 0.5em 0 0 1em;
        }

        a {
          color: white;
          text-decoration: none;

          img {
            width: 1.5rem;
          }
        }
      }
    }

    .closeMenu {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;

      img {
        width: 1rem;
      }
    }
  }
`;

export const Header = ({ imageUrl }: { imageUrl?: string }) => {
  const subtitle = useSubtitle();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <StyledHeader>
      <FlexContainer
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <h1>
          <NavLink to="/dashboard">Becoming You</NavLink>
        </h1>
        <h2>{subtitle}</h2>
      </FlexContainer>
      <div className="menuContainer">
        {imageUrl && (
          <Avatar onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img src={imageUrl} alt="profile" />
          </Avatar>
        )}
        {isMenuOpen && (
          <div className="menu">
            <button className="closeMenu" onClick={() => setIsMenuOpen(false)}>
              <img src="/icons/close.svg" alt="close" />
            </button>
            <ul>
              <li>
                <a href="/calendar">Calendar</a>
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
              </li>
              <li>
                <a href="/events">Events</a>
              </li>
              <li>
                <a href="/tasks">Tasks</a>
              </li>
              <li>
                <a href="/habits">Habits</a>
              </li>
              <li>
                <a href="/about">About</a>
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
