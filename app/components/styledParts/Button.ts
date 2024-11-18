import styled from "@emotion/styled";
const BaseButton = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
`;

export const Button = styled(BaseButton)`
  border-color: ${(props) => {
    switch (props.styleType) {
      case "danger":
        return "red";
      case "warning":
        return "orange";
      default:
        return "white";
    }
  }};

  color: ${(props) => {
    switch (props.styleType) {
      case "danger":
        return "red";
      case "warning":
        return "orange";
      default:
        return "white";
    }
  }};
`;
