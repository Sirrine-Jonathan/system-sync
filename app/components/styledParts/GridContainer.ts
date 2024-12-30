import styled from '@emotion/styled'

export const GridContainer = styled.div<{
    templateColumns?: string
    templateRows?: string
    gap?: string
}>`
	display: grid;
	gap: ${(props) => props.gap || '1em'};
	grid-template-columns: ${(props) => props.templateColumns || '1fr'};
	grid-template-rows: ${(props) => props.templateRows || '1fr'};
}`
