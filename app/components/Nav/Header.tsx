import { useState, useRef, useEffect } from 'react'
import { NavLink } from '@remix-run/react'
import { Avatar, DesktopAvatar } from '../styledParts/Avatar'

import styled from '@emotion/styled'
import { MobileOnly } from '../styledParts/MobileOnly'
import { useIsMobile } from '~/hooks/useIsMobile'
import { SignOutButton } from '../Auth/SignOutButton'

const StyledHeader = styled.header`
    --avatar-height: 50px;
    --top-padding: 4px;
    --bottom-padding: 0px;
    --left-padding: calc(var(--horizontal-padding) - 2px);
    --right-padding: var(--horizontal-padding);
    --header-height: calc(var(--avatar-height) + (var(--top-padding) * 2));
    height: var(--header-height);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--primary-bg);
    padding: var(--top-padding) var(--left-padding) var(--bottom-padding);

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
        font-size: 2rem;
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
        width: var(--header-height);
        max-width: var(--header-height);
        margin-right: 1rem;
    }

    #avatar {
        padding: 0;
        margin: 0;
        background: var(--primary-bg-dark);
        border-top-left-radius: 50px;
        border-top-right-radius: 50px;
        border-bottom-left-radius: 50px;
        border-bottom-right-radius: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-color: var(--primary-bg-dark);
        border-width: 3px;
        border-style: solid;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

        img {
            width: var(--avatar-height);
            height: var(--avatar-height);
            border-radius: 100px;
            border-color: var(--primary-bg-dark);
            border-width: 0px;
        }
    }

    @media (max-width: 767px) {
        h1 {
            font-size: 1.2rem;
        }

        h2 {
            font-size: 1.2rem;
        }
    }
`

export const FALLBACK_IMAGE_URL = '/icons/avatar.svg'

export const Header = ({ imageUrl }: { imageUrl?: string }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [usableImageUrl, setUsableImageUrl] = useState(
        imageUrl || FALLBACK_IMAGE_URL
    )

    const { isMobile } = useIsMobile()

    const AvatarTag = isMobile ? Avatar : DesktopAvatar

    const avatarImageRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        avatarImageRef.current?.addEventListener('load', () => {
            setUsableImageUrl(usableImageUrl || FALLBACK_IMAGE_URL)
        })
        avatarImageRef.current?.addEventListener('error', () => {
            setUsableImageUrl(FALLBACK_IMAGE_URL)
        })
    }, [usableImageUrl, imageUrl])

    return (
        <StyledHeader>
            <NavLink to="/dashboard">
                <img id="logo" src="/images/logo.png" alt="System Sync" />
            </NavLink>
            <div className="menuContainer">
                {imageUrl && (
                    <AvatarTag
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        id="avatar"
                    >
                        <img
                            ref={avatarImageRef}
                            src={usableImageUrl}
                            alt="profile"
                        />
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
                                    <a href="/calendar/month">Calendar</a>
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
    )
}
