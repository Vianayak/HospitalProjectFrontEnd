import React from "react";
import ReactDOM from "react-dom";
import "./PaymentModal.css";

const PaymentModal = ({ selectedRequest, onComplete, onCancel }) => {
  if (!selectedRequest) return null;

  return ReactDOM.createPortal(
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Complete Task</h2>
        <p><strong>Patient:</strong> {selectedRequest.name}</p>
        <p><strong>Reason:</strong> {selectedRequest.reason}</p>
        <p><strong>Date:</strong> {selectedRequest.date}</p>
        <p><strong>Time:</strong> {selectedRequest.time}</p>

        <div className="modal-buttons">
          <button
            className="pay-button"
            onClick={() => onComplete(selectedRequest)} // ✅ pass selectedRequest
          >
            Start
          </button>

          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;
