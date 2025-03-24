import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddNurse.css"; // Import CSS for styling
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:8081/api/nurses";

const AddNurse = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const navigate = useNavigate();

  // Fetch nurses from backend when the component loads
  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/all`);
      setNurses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nurses:", error);
      toast.error("Failed to load nurses.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.setItem("validNavigation", "true");
    navigate("/doctors-dashboard-page");
  };

  const handleAddNurse = () => {
    if (nurses.length >= 5) {
      toast.error("You can only add up to 5 nurses.");
      return;
    }
    setNurses([...nurses, { id: Date.now(), name: "", location: "", saved: false }]);
    setShowConfirmButtons(true);
  };

  const handleInputChange = (index, field, value) => {
    const newNurses = [...nurses];
    newNurses[index][field] = value;
    setNurses(newNurses);
  };

  const handleSaveNurse = async (index) => {
    const nurse = nurses[index];
    if (!nurse.name || !nurse.location) {
      toast.error("Nurse name and location are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/save`, nurse);
      const newNurses = [...nurses];
      newNurses[index] = response.data;
      setNurses(newNurses);
      toast.success("Nurse saved successfully!");
    } catch (error) {
      console.error("Error saving nurse:", error);
      toast.error("Failed to save nurse.");
    }
  };

  const handleEditNurse = (index) => {
    const newNurses = [...nurses];
    newNurses[index].saved = false;
    setNurses(newNurses);
  };

  const handleDeleteNurse = async (index, id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      const updatedNurses = nurses.filter((_, i) => i !== index);
      setNurses(updatedNurses);
      toast.success("Nurse deleted successfully!");
      if (updatedNurses.length === 0) {
        setShowConfirmButtons(false);
      }
    } catch (error) {
      console.error("Error deleting nurse:", error);
      toast.error("Failed to delete nurse.");
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.put(`${API_BASE_URL}/confirm`);
      toast.success("All nurses confirmed!");
      fetchNurses();
  
      // Set sessionStorage flag before navigating
      sessionStorage.setItem("validNavigation", "true");
      navigate("/doctors-dashboard-page");
    } catch (error) {
      console.error("Error confirming nurses:", error);
      toast.error("Failed to confirm nurses.");
    }
  };
  

  const handleCancel = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-all`);
      setNurses([]);
      setShowConfirmButtons(false);
      toast.info("All nurses removed.");
    } catch (error) {
      console.error("Error deleting all nurses:", error);
      toast.error("Failed to remove all nurses.");
    }
  };

  return (
    <>
      <h2>Add Nurses</h2>
      <div className="back-arrow12" onClick={handleBack} style={{ marginLeft: "100px" }}>
        <i className="fas fa-arrow-left"></i>
      </div>

      <div className="add-nurse-container">
        <ToastContainer position="top-right" autoClose={3000} />

        {loading ? (
          <p>Loading nurses...</p>
        ) : (
          nurses.map((nurse, index) => (
            <div key={nurse.id} className="nurse-entry">
              {nurse.saved ? (
                <div className="nurse-summary">
                  <span>{nurse.name} - {nurse.location}</span>
                  <div className="action-icons">
                    <button onClick={() => handleEditNurse(index)}>✏ Edit</button>
                    <button onClick={() => handleDeleteNurse(index, nurse.id)}>🗑 Delete</button>
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
                  <button onClick={() => handleDeleteNurse(index, nurse.id)} className="delete-button3">Delete</button>
                </div>
              )}
            </div>
          ))
        )}

        <button onClick={handleAddNurse} className="add-button">+ Add Nurse</button>

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
