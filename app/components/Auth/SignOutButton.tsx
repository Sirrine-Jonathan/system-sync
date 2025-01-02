import { FlexContainer } from '../styledParts/FlexContainer'
import styled from '@emotion/styled'

const StyledLink = styled.a`
    display: block;
    text-decoration: none;
    color: var(--color-white);

    img {
        width: 1.5rem;
    }
`

export const SignOutButton = () => {
    return (
        <StyledLink href="/auth/signout">
            <FlexContainer justifyContent="space-between" alignItems="center">
                <span>Sign Out</span>
                <img src="/icons/signout.svg" alt="" />
            </FlexContainer>
        </StyledLink>
    )
}
