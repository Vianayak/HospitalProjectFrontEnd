import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddNurse.css"; // Import CSS for styling
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:8081/api/nurse";

const AddNurse = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch nurses from backend when the component loads
  useEffect(() => {
    if (doctorDetails && doctorDetails.regestrationNum) {
        fetchNurses();
    }
}, [doctorDetails]); // Dependency on doctorDetails


  useEffect(() => {
      const storedDoctorDetails = localStorage.getItem("doctorDetails");
      if (storedDoctorDetails) {
        setDoctorDetails(JSON.parse(storedDoctorDetails));
      }
    }, []);



    const fetchNurses = async () => {
      if (!doctorDetails || !doctorDetails.regestrationNum) {
          console.error("Doctor details are missing.");
          toast.error("Doctor details not found. Please try again.");
          return;
      }
  
      try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/all/${doctorDetails.regestrationNum}`);
  
          if (response.status === 200) {
              const nursesData = response.data.map(nurse => ({
                  ...nurse,
                  saved: true // Ensure fetched nurses are shown as saved
              }));
              setNurses(nursesData);
          } else {
              setNurses([]);
          }
      } catch (error) {
          console.error("Error fetching nurses:", error);
          if (error.response && error.response.status === 404) {
              setNurses([]);
              toast.info("There are no nurses available.");
          } else {
              toast.error("Failed to load nurses.");
          }
      } finally {
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
    setNurses([...nurses, { id: Date.now(), name: "", email: "", saved: false }]);
    setShowConfirmButtons(true);
  };

  const handleInputChange = (index, field, value) => {
    const newNurses = [...nurses];
    newNurses[index][field] = value;
    setNurses(newNurses);
  };

  const handleSaveNurse = async (index) => {
    const docRegNum=doctorDetails.regestrationNum;

     console.log(docRegNum);

    const nurse = nurses[index];
    if (!nurse.name || !nurse.email) {
      toast.error("Nurse name and email are required.");
      return;
    }

    const nurseDto = {
      name: nurse.name,
      email: nurse.email,
      doctorRegNum: docRegNum // Adding doctor's registration number
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/save`, nurseDto);

    console.log(response);
    setNurses(prevNurses => {
        const newNurses = [...prevNurses];
        newNurses[index] = { ...response.data, saved: true }; // Ensure saved nurse is read-only
        return newNurses;
    });

    toast.success("Nurse saved successfully!");
} catch (error) {
  console.error("Error saving nurse:", error);

  // Extract the error message properly
  const errorMessage = error.response?.data?.error || "Failed to save nurse. Please try again.";

  // Show the error message in a toast notification
  toast.error(errorMessage);
}
  };

  const handleEditNurse = (index) => {
    const newNurses = [...nurses];
    newNurses[index].saved = false;
    setNurses(newNurses);
  };

  const handleDeleteNurse = async (index) => {
    const nurseId = nurses[index].id; // Get ID from state

    if (!nurseId) {
        toast.error("Cannot delete nurse without a valid ID.");
        return;
    }

    try {
        await axios.delete(`${API_BASE_URL}/delete/${nurseId}`);

        setNurses(prevNurses => prevNurses.filter((_, i) => i !== index)); // Remove nurse from state
        toast.success("Nurse deleted successfully!");

        if (nurses.length === 1) {
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
                   <span>
                        <strong className="nurse-name">Name:</strong> 
                        <span className="name-text">{nurse.name}</span>, 
                        <strong className="nurse-email"> Email:</strong> 
                        <span className="email-text">{nurse.email}</span>
                    </span>
                    <div className="action-icons">
                        <button className="edit-button" onClick={() => handleEditNurse(index)}>✏ Edit</button>
                        <button className="delete-button1" onClick={() => handleDeleteNurse(index, nurse.id)}>🗑 Delete</button>
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
                    placeholder="Enter email"
                    value={nurse.email}
                    onChange={(e) => handleInputChange(index, "email", e.target.value)}
                  />
                  
                  <button onClick={() => handleSaveNurse(index)} className="save-button3">Save</button>
                </div>
              )}
            </div>
          ))
        )}

        <button onClick={handleAddNurse} className="add-button">+ Add Nurse</button>

        {showConfirmButtons}
      </div>
    </>
  );
};

export default AddNurse;
