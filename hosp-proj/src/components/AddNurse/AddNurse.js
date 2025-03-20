import React, { useState } from "react";
import "./AddNurse.css"; // Import CSS for styling
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AddNurse = () => {
  const [nurses, setNurses] = useState([]);  
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    sessionStorage.setItem("validNavigation", "true");
    navigate("/doctors-dashboard-page");
  };

  const handleAddNurse = () => {
    if (nurses.length >= 5) {
      toast.error("You can only add up to 5 nurses.");
      return;
    }
    setNurses([
      ...nurses,
      { id: Date.now(), name: "", location: "", saved: false }
    ]);
    setShowConfirmButtons(true); // Show confirm/cancel buttons after adding a nurse
  };

  const handleInputChange = (index, field, value) => {
    const newNurses = [...nurses];
    newNurses[index][field] = value;
    setNurses(newNurses);
  };

  const handleSaveNurse = (index) => {
    const nurse = nurses[index];
    if (!nurse.name || !nurse.location) {
      toast.error("Nurse name and location are required.");
      return;
    }
    const newNurses = [...nurses];
    newNurses[index].saved = true;
    setNurses(newNurses);
    toast.success("Nurse saved successfully!");
  };

  const handleEditNurse = (index) => {
    const newNurses = [...nurses];
    newNurses[index].saved = false;
    setNurses(newNurses);
  };

  const handleDeleteNurse = (index) => {
    const updatedNurses = nurses.filter((_, i) => i !== index);
    setNurses(updatedNurses);
    if (updatedNurses.length === 0) {
      setShowConfirmButtons(false); // Hide confirm/cancel buttons if no nurses remain
    }
  };

  const handleConfirm = () => {
    toast.success("All nurses confirmed!");
    // You can navigate or perform an API call here
  };

  const handleCancel = () => {
    setNurses([]);
    setShowConfirmButtons(false);
    toast.info("All nurses removed.");
  };

  return (
    <>
      <h2>Add Nurses</h2>
      <div className="back-arrow12" onClick={handleBack} style={{ marginLeft: "100px" }}>
        <i className="fas fa-arrow-left"></i>
      </div>

      <div className="add-nurse-container">
        <ToastContainer position="top-right" autoClose={3000} />

        {nurses.map((nurse, index) => (
          <div key={nurse.id} className="nurse-entry">
            {nurse.saved ? (
              <div className="nurse-summary">
                <span>{nurse.name} - {nurse.location}</span>
                <div className="action-icons">
                  <button onClick={() => handleEditNurse(index)}>✏ Edit</button>
                  <button onClick={() => handleDeleteNurse(index)}>🗑 Delete</button>
                </div>
              </div>
            ) : (
              <div className="nurse-row">
                <input
                  type="text"
                  placeholder="Enter Nurse Name"
                  value={nurse.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Enter location"
                  value={nurse.location}
                  onChange={(e) => handleInputChange(index, "location", e.target.value)}
                />
                
                <button onClick={() => handleSaveNurse(index)} className="save-button3">Save</button>
                <button onClick={() => handleDeleteNurse(index)} className="delete-button3">Delete</button>
              </div>
            )}
          </div>
        ))}
        
        <button onClick={handleAddNurse} className="add-button">+ Add Nurse</button>

        {/* Confirmation Buttons */}
        {showConfirmButtons && (
          <div className="confirm-buttons">
            <button onClick={handleConfirm} className="confirm-button">Confirm</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNurse;
