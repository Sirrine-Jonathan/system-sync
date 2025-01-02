import styled from '@emotion/styled'

export const Large = styled.span`
    font-size: 1.2rem;
`

export const Medium = styled.span`
    font-size: 1rem;
`

export const Small = styled.span`
    font-size: 0.7rem;
`

export const Highlight = styled.span`
    font-weight: bold;
    color: var(--accent-color);
`

export const Diminished = styled.span`
    font-weight: normal;
    color: rgb(177, 177, 177);
`

export const Section = styled.section`
    p {
        margin: 0 0 1rem 0;
    }
`

export const Center = styled.div`
    text-align: center;
`

export const Strikethrough = styled.span`
    text-decoration: line-through;
`

export const OneLine = styled.div`
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
