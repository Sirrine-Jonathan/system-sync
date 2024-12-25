import styled from "@emotion/styled";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { StyledIconButton } from "./styledParts/Buttons";

type CalloutContextType = [
  isCalloutOpen: boolean,
  setIsCalloutOpen: (isCalloutOpen: boolean) => void,
];

const CalloutContext = createContext<CalloutContextType>([false, () => {}]);

export const CalloutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCalloutOpen, setIsCalloutOpen] = useState(false);

  return (
    <CalloutContext.Provider value={[isCalloutOpen, setIsCalloutOpen]}>
      {children}
    </CalloutContext.Provider>
  );
};

export const CalloutTrigger = ({ children }: { children: React.ReactNode }) => {
  const [isCalloutOpen, setIsCalloutOpen] = useContext(CalloutContext);

  const closeCallout = useCallback(
    (e: MouseEvent) => {
      if (!isCalloutOpen) return;
      const target = e.target as HTMLElement;
      if (target.closest(".callout")) return;
      setIsCalloutOpen(false);
    },
    [isCalloutOpen, setIsCalloutOpen]
  );

  useEffect(() => {
    document.addEventListener("click", closeCallout);

    return () => {
      document.removeEventListener("click", closeCallout);
    };
  }, [closeCallout]);

  return (
    <StyledIconButton
      onClick={() => setIsCalloutOpen(!isCalloutOpen)}
      size="normal"
      context="transparent"
    >
      {children}
    </StyledIconButton>
  );
};

const StyledCalloutContent = styled.div<{
  isOpen: boolean;
  direction: "top" | "bottom" | "left" | "right";
}>`
  --offset: 0.5rem;
  --arrow-size: calc(var(--offset) + 0.1rem);
  position: absolute;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  ${(props) => {
    switch (props.direction) {
      case "top":
        return `
          top: 0;
          left: 50%;
          transform: translate(-50%, calc(-100% - var(--offset)));
        `;
      case "bottom":
        return `
          bottom: 0;
          left: 50%;
          transform: translate(-50%, calc(100% + var(--offset)));
        `;
      case "left":
        return `
          top: 50%;
          left: 0;
          transform: translate(calc(-100% - var(--offset)), -50%);
        `;
      case "right":
        return `
          top: 50%;
          right: 0;
          transform: translate(calc(100% + var(--offset)), -50%);
        `;
    }
  }}

  .calloutArrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    border-color: white transparent transparent transparent;

    ${(props) => {
      switch (props.direction) {
        case "top":
          return `
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 100%);
            border-width: var(--arrow-size) var(--arrow-size) 0 var(--arrow-size);
          `;
        case "bottom":
          return `
            top: 0;
            left: 50%;
            transform: translate(-50%, -100%) rotate(180deg);
            border-width: var(--arrow-size) var(--arrow-size) 0 var(--arrow-size);
          `;
        case "right":
          return `
            top: 50%;
            left: 0;
            transform: translate(-100%, -50%) rotate(90deg);
            border-width: var(--arrow-size);
          `;
        case "left":
          return `
            top: 50%;
            right: 0;
            transform: translate(100%, -50%) rotate(-90deg);
            border-width: var(--arrow-size);
          `;
      }
    }}
  }

  padding: 0.5rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: rgb(0, 0, 0);
  border-radius: 5px;
  box-shadow: 0 2px 4px 3px rgba(0, 0, 0, 0.5);
  border: 1px solid white;
  color: white;
  transition: all 0.3s ease-in-out;
  z-index: 999;
  width: max-content;
`;

export const CalloutContent = ({
  preferredDirection,
  children,
}: {
  preferredDirection?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}) => {
  const [isCalloutOpen] = useContext(CalloutContext);
  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right"
  >(preferredDirection || "top");

  const contentRef = useRef<HTMLDivElement>(null);

  const reposition = useCallback(() => {
    if (contentRef.current && isCalloutOpen) {
      const rect = contentRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let nextDirection = preferredDirection || "top";

      // check overlaps with window
      const topOverlap = rect.top < 0;
      const bottomOverlap = rect.bottom > windowHeight;
      const leftOverlap = rect.left < 0;
      const rightOverlap = rect.right + rect.width > windowWidth;

      console.log("reposition", {
        rect,
        windowWidth,
        windowHeight,
        preferredDirection,
        nextDirection,
        topOverlap,
        bottomOverlap,
        leftOverlap,
        rightOverlap,
      });

      if (topOverlap) {
        nextDirection = "bottom";
      } else if (bottomOverlap) {
        nextDirection = "top";
      }

      if (leftOverlap) {
        nextDirection = "right";
      } else if (rightOverlap) {
        nextDirection = "left";
      }

      if (nextDirection !== direction) {
        setDirection(nextDirection);
      }
    }
  }, [isCalloutOpen, preferredDirection, direction]);

  useEffect(() => {
    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("orientationchange", reposition);
    window.addEventListener("scroll", reposition);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("orientationchange", reposition);
      window.removeEventListener("scroll", reposition);
    };
  }, [reposition]);

  return (
    <StyledCalloutContent
      ref={contentRef}
      isOpen={isCalloutOpen}
      direction={direction}
    >
      {children}
      <span className="calloutArrow" />
    </StyledCalloutContent>
  );
};

const StyledCalloutAction = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  transition: color 0.2s ease-in-out;
  width: 100%;
  text-align: left;
  border-top: 1px solid white;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;

  img {
    width: 1rem;
  }

  &:first-of-type {
    border-top: none;
  }

  &:hover {
    color: gold;
  }
`;

export const CalloutAction = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const [, setIsCalloutOpen] = useContext(CalloutContext);
  return (
    <StyledCalloutAction
      onClick={() => {
        onClick();
        setIsCalloutOpen(false);
      }}
    >
      {children}
    </StyledCalloutAction>
  );
};

const StyledCallout = styled.div`
  position: relative;
`;

export const Callout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledCallout className="callout">
      <CalloutProvider>{children}</CalloutProvider>
    </StyledCallout>
  );
};
