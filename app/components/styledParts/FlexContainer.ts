import styled from "@emotion/styled";

export const FlexContainer = styled.div<{
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  gap?: string;
}>`
	display: flex;
	flex-direction: ${(props) => props.flexDirection || "row"};
	justify-content: ${(props) => props.justifyContent || "flex-start"};
	align-items: ${(props) => props.alignItems || "center"};	
	gap: ${(props) => props.gap || "0"};
}`;
