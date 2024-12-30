import styled from '@emotion/styled'

export const Avatar = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;

    & img {
        width: 50px;
        aspect-ratio: 1;
        border: 3px solid var(--color-white);
        border-radius: 100px;
    }

    @media (max-width: 767px) {
        & img {
            width: 50px;
            aspect-ratio: 1;
            border: 2px solid var(--color-white);
        }
    }
`

const AvatarDiv = Avatar.withComponent('div')

export const DesktopAvatar = styled(AvatarDiv)`
    cursor: default;
`
