import styled from "@emotion/styled";

export type FlexContainerProps = {
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
  gap?: string;
  padding?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

export const FlexContainer = styled.div<FlexContainerProps>`
	display: flex;
	flex-direction: ${(props) => props.flexDirection || "row"};
	justify-content: ${(props) => props.justifyContent || "flex-start"};
	align-items: ${(props) => props.alignItems || "center"};	
	gap: ${(props) => props.gap || "0"};
	padding: ${(props) => props.padding || "0"};

	${(props) => {
    if (props.fullWidth) {
      return "width: 100%";
    }

    if (props.fullHeight) {
      return "height: 100%";
    }
  }}
  
}`;
