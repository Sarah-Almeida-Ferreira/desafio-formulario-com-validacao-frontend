import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Dialog = ({ onClose, title, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current.showModal();
    dialogRef.current.classList.add('open');
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      onCancel={handleCancel}
      data-testid="dialog"
    >
      <div className="dialog-header" data-testid="dialog-header">
        <h2 className="dialog-title">{title}</h2>
        <button
          onClick={handleClose}
          aria-label="Close"
          data-testid="dialog-close-button"
          className="dialog-close-button"
          type="button"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <div className="dialog-content" data-testid="dialog-content">
        {children}
      </div>
    </dialog>
  );
};

Dialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dialog;
