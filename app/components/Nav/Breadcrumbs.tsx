import styled from '@emotion/styled'
import { FlexContainer } from '../styledParts/FlexContainer'
import { useIsMobile } from '~/hooks/useIsMobile'

const createIndentStyles = () => {
    let str = ``
    for (let i = 1; i < 20; i++) {
        str += `
            div[data-index="${i}"] {
                margin-left: ${(i - 1) * 17}px;
            }
        `
    }
    return str
}

const StyledBreadcrumbs = styled.div`
    margin: 0 0 1rem 0;

    background: var(--strong-color);
    border-radius: 5px;
    padding: 1rem;
    color: var(--color-white);

    h2 {
        margin: 0 0.5rem;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 0.8em;

        li {
            display: flex;
            align-items: center;
            gap: 10px;

            img {
                width: 1.2rem;
            }

            a {
                color: var(--color-white);
                text-decoration: none;

                &:hover {
                    color: var(--accent-color);
                }

                &.current {
                    pointer-events: none;
                    cursor: default;
                    color: var(--accent-color);
                }
            }

            &:first-child a {
                margin-left: 0;
            }

            &:last-child a {
                margin-right: 0;
            }
        }
    }

    @media (max-width: 767px) {
        font-size: 1.2em;

        ul {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;

            img {
                width: 0.8rem;
                margin-right: 5px;
            }

            ${createIndentStyles()}
        }
    }
`

export const Breadcrumbs = ({
    children,
    actions,
}: {
    children: React.ReactNode
    actions?: React.ReactNode[]
    title?: string
}) => {
    const { isMobile } = useIsMobile()
    return (
        <StyledBreadcrumbs>
            <FlexContainer justifyContent="space-between" fullWidth>
                <ul>
                    {children?.map((child, index) => {
                        return (
                            <FlexContainer
                                key={index}
                                alignItems="center"
                                data-index={index}
                            >
                                {isMobile && index !== 0 && (
                                    <img src="/icons/arrow-return.svg" alt="" />
                                )}
                                <li key={index}>
                                    {child}
                                    {index < children.length - 1 &&
                                        !isMobile && (
                                            <img
                                                src="/icons/arrow-right.svg"
                                                alt=""
                                            />
                                        )}
                                </li>
                            </FlexContainer>
                        )
                    })}
                </ul>
                {actions && <BreadcrumbActions>{actions}</BreadcrumbActions>}
            </FlexContainer>
        </StyledBreadcrumbs>
    )
}

export const BreadcrumbActions = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <FlexContainer gap="1em" style={{ fontSize: '0.8em' }}>
            {children}
        </FlexContainer>
    )
}
