import styled from "@emotion/styled";

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: black;
    padding: 3rem 3rem 2rem 3rem;
    border-radius: 5px;
    max-width: 1200px;
    overflow-y: auto;

    .closeModal {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #000;
      width: 30px;
      height: 30px;
      padding: 0;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      color: white;
      cursor: pointer;
      z-index: 1;

      &:hover {
        background: #333;
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
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <StyledModal>
      <div className="modal">
        <button className="closeModal" onClick={() => setIsOpen(false)}>
          <img src="/icons/close.svg" alt="close" />
        </button>
        {children}
      </div>
    </StyledModal>
  );
};

const StyledModalHeader = styled.div`
  .modalTitle {
    font-family: "Cormant Garamond", serif;
    font-size: 1.3em;
    text-align: center;
    margin: 0;
    background: gold;
    margin-left: -3rem;
    margin-right: -3rem;
    margin-top: -3rem;
    margin-bottom: 2rem;
    height: 30px;
    padding: 0.5rem;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .modalSubtitle {
    margin-top: -2rem;
    margin-bottom: 1rem;

    margin-left: -3rem;
    margin-right: -3rem;
    font-weight: bold;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
  }
`;
export const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledModalHeader>
      <div className="modalHeaderTitles">{children}</div>
    </StyledModalHeader>
  );
};
