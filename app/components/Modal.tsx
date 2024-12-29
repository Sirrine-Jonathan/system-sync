import { useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { StyledIconButton } from "./styledParts/Buttons";

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  width: 100%;
  box-sizing: border-box;

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-black);
    border-radius: 5px;
    width: 95%;
    max-width: 1200px;
    height: 70%;
    max-height: 800px;
    overflow: auto;
    padding: 1rem 1.5rem 1.5rem 1.5rem;

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
      transform: translate(-100%, 0%);
      z-index: 200;

      &:hover {
        background: #eee;
      }

      img {
        width: 1.2em;
      }
    }
  }
`;

export const Modal = ({
  isOpen,
  setIsOpen,
  children,
  ...rest
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
} & React.ComponentProps<"div">) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // close if click outside of modal
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".modal")) return;
      setIsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  if (!isOpen) return null;

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
        {children}
      </div>
    </StyledModal>
  );
};

const StyledModalHeader = styled.div`
  border-radius: 5px;

  .modalTitle {
    border-radius: 5px 5px 0 0;
    font-size: 1.3em;
    text-align: center;
    margin: 0;
    background: var(--accent-color);
    height: 30px;
    padding: 0.5rem;
    color: var(--color-black);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .modalSubtitle {
    padding: 0.5rem;
    margin: 0;
    text-align: center;
  }
`;

export const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledModalHeader>
      <div className="modalHeaderTitles">{children}</div>
    </StyledModalHeader>
  );
};

const StyledModalContent = styled.div`
  padding: 1rem;
  border-radius: 0 0 5px 5px;
`;

export const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return <StyledModalContent>{children}</StyledModalContent>;
};
