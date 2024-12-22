export const Base = `
	background: transparent;
	border: 1px solid white;
	border-radius: 5px;
	padding: 0.5rem 1rem;
	color: white;
	cursor: pointer;
`;

export const Levels = `
	border-color: ${(props: { styleType: "danger" | "warning" }) => {
    switch (props.styleType) {
      case "danger":
        return "red";
      case "warning":
        return "orange";
      default:
        return "white";
    }
  }};

	color: ${(props: { styleType: "danger" | "warning" }) => {
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
