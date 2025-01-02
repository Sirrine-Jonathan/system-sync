import styled from '@emotion/styled'
import { NavLink } from '@remix-run/react'
import { StyledButton } from './Buttons'

export const StyledLink = styled(NavLink)`
    color: var(--color-white);
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    background: transparent;

    &:hover {
        color: var(--accent-color);
    }
`

export const StyledNavLink = StyledLink.withComponent(NavLink)

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
        content: '↗';
        margin-right: 5px;
    }
`

export const StyledButtonLink = StyledButton.withComponent(NavLink)

export const StyledIconLink = styled(NavLink)<{
    block?: boolean
    context?: 'standard' | 'danger' | 'warning' | 'transparent' | 'attention'
    size?: 'small' | 'normal' | 'large'
}>`
  --bg-standard: rgba(255, 255, 255, 0.1);
  --bg-danger: rgba(255, 0, 0, 0.8);
  --bg-warning: rgba(255, 165, 0, 0.1);
  --bg-attention: var(--accent-color);
  --bg-transparent: transparent;
  --small: 15px;
  --normal: 30px;
  --large: 45px;

  --size: ${({ size }) => {
      if (!size) return 'var(--normal);'
      switch (size) {
          case 'small':
              return 'var(--small);'
          case 'normal':
              return 'var(--normal);'
          case 'large':
              return 'var(--large);'
          default:
              return 'var(--normal);'
      }
  }};

  background: ${({ context }) => {
      if (!context) return 'var(--bg-standard);'
      switch (context) {
          case 'danger':
              return 'var(--bg-danger);'
          case 'warning':
              return 'var(--bg-warning);'
          case 'transparent':
              return 'var(--bg-transparent);'
          case 'attention':
              return 'var(--bg-attention);'
          default:
              return 'var(--bg-standard);'
      }
  }}
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  min-width: var(--size);
  box-sizing: border-box;
  border-radius: 5rem;
  box-sizing: border-box;
  text-decoration: none;

  ${({ size }) => {
      switch (size) {
          case 'small':
              return 'padding: 0.2rem;'
          case 'normal':
              return 'padding: 0.5rem;'
          case 'large':
              return 'padding: 0.5rem;'
          default:
              return 'padding: 0.5rem;'
      }
  }}


  img {
    ${({ size }) => {
        switch (size) {
            case 'small':
                return 'width: 0.5rem;'
            case 'normal':
                return 'width: 1rem;'
            case 'large':
                return 'width: 2rem;'
            default:
                return 'width: 1rem;'
        }
    }}
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  span {
    margin: 0 5px;
    color: var(--color-white);
  }

  @media (max-width: 767px) {
    span {
      display: none;
    }
  }
`

export const StyledBigLink = styled(NavLink)<{ danger?: boolean }>`
    --size: 1.2rem;

    background: ${({ danger }) => (danger ? 'crimson' : 'rgba(0, 0, 0, 0.8)')};
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
`
