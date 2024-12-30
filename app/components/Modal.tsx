import { useCallback, useEffect } from 'react'
import styled from '@emotion/styled'
import { StyledIconButton } from './styledParts/Buttons'
import { FlexContainer } from './styledParts/FlexContainer'

const StyledModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    max-height: 100%;
    overflow: auto;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999;
    box-sizing: border-box;

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000;
        border-radius: 5px;
        width: calc(100% - var(--horizontal-padding) * 2);
        max-width: 1200px;
        max-height: calc(100% - var(--vertical-padding) * 2);
        overflow: auto;
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        box-sizing: border-box;

        .modalTitle {
            padding: 0;
            padding: 0.5rem 1rem;
            background: gold;
            color: black;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
        }

        .modalSubtitle {
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modalHeader {
            margin: -1rem -1.5rem 1rem -1.5rem;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            padding: 0;
            margin: 0 0 0.5rem 0;
        }

        p {
            padding: 0;
            margin: 0;
        }

        .closeModal {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 200;

            &:hover {
                background: #eee;
            }

            img {
                width: 1.2em;
            }
        }
    }
`

export const Modal = ({
    title,
    subtitle,
    isOpen,
    setIsOpen,
    children,
    ...rest
}: {
    title?: string | null
    subtitle?: string | null
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    children: React.ReactNode
} & React.ComponentProps<'div'>) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        },
        [setIsOpen]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    useEffect(() => {
        // close if click outside of modal
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('.modal')) return
            setIsOpen(false)
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    })

    if (!isOpen) return null

    return (
        <StyledModal {...rest}>
            <div className="modal">
                <StyledIconButton
                    className="closeModal"
                    onClick={() => setIsOpen(false)}
                    context="transparent"
                >
                    <img src="/icons/close-dark.svg" alt="close" />
                </StyledIconButton>
                {title || subtitle ? (
                    <FlexContainer
                        flexDirection="column"
                        alignItems="stretch"
                        className="modalHeader"
                    >
                        {title && <div className="modalTitle">{title}</div>}
                        {subtitle && (
                            <div className="modalSubtitle">{subtitle}</div>
                        )}
                    </FlexContainer>
                ) : null}
                {children}
            </div>
        </StyledModal>
    )
}
