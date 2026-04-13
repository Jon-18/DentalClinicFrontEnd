import '../style/components/messagemodal.css';

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <button className="modal-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Modal;