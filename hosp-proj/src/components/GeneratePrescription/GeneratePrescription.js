import React, { useState } from "react";  
import "./GeneratePrescription.css"; // Importing the CSS styles  
import axios from "axios";  

const GeneratePrescription = () => {  
  const [tablets, setTablets] = useState([]);  
  const [selectedTablet, setSelectedTablet] = useState(null);  
  const [doctorNotes, setDoctorNotes] = useState("");  
  const [errors, setErrors] = useState([]); // State for storing validation errors  

  const handleAddTablet = () => {  
    setTablets([  
      ...tablets,  
      {  
        id: Date.now(),  
        name: "",  
        days: "",  
        slots: { morning: false, afternoon: false, evening: false },  
        timing: { morning: "", afternoon: "", evening: "" },  
        saved: false,  
      }  
    ]);  
  };  

  const handleInputChange = (index, field, value) => {  
    const newTablets = [...tablets];  
    newTablets[index][field] = value;  
    setTablets(newTablets);  
  };  

  const handleCheckboxChange = (index, slot) => {  
    const newTablets = [...tablets];  
    newTablets[index].slots[slot] = !newTablets[index].slots[slot];  
    if (!newTablets[index].slots[slot]) {  
      newTablets[index].timing[slot] = "";  
    }  
    setTablets(newTablets);  
  };   

  const handleRadioChange = (index, slot, value) => {  
    const newTablets = [...tablets];  
    newTablets[index].timing[slot] = value;  
    setTablets(newTablets);  
  };  

  const handleDeleteTablet = (index) => {  
    setTablets(tablets.filter((_, i) => i !== index));  
  };  

  const handleSaveTablet = (index) => {  
    const tablet = tablets[index];  
    const errors = [];  

    // Validation checks  
    if (!tablet.name) {  
        errors.push("Tablet name is required.");  
    }  
    if (!tablet.days || tablet.days <= 0) {  
        errors.push("Valid number of days is required.");  
    }  
    if (!Object.values(tablet.slots).some(Boolean)) {  
        errors.push("At least one slot must be selected.");  
    }  

    // If there are validation errors, display them  
    if (errors.length > 0) {  
        alert(errors.join(" ")); // Displaying all error messages in one alert  
    } else {  
        // If no errors, mark the tablet as saved  
        const newTablets = [...tablets];  
        newTablets[index].saved = true; // Mark as saved  
        setTablets(newTablets);  
    }  
};

  const handleEditTablet = (index) => {  
    const newTablets = [...tablets];  
    newTablets[index].saved = false; // Allow editing  
    setTablets(newTablets);  
  };  

  const handleShowDetails = (tablet) => {  
    setSelectedTablet(tablet);  
  };  

  const handleCloseModal = () => {  
    setSelectedTablet(null);  
  };  

  const validateTablets = () => {  
    const errorMessages = [];  
    tablets.forEach((tablet, index) => {  
      if (!tablet.name) {  
        errorMessages[index] = "Tablet name is required";  
      }  
      if (!tablet.days || tablet.days <= 0) {  
        errorMessages[index] = "Valid number of days is required";  
      }  
      const hasSlots = Object.values(tablet.slots).some(Boolean);  
      if (!hasSlots) {  
        errorMessages[index] = "At least one slot must be selected";  
      }  
    });  
    return errorMessages;  
  };  

  const handleUpload = async () => {  
    const errors = validateTablets();  
    if (errors.length > 0) {  
      setErrors(errors);  
      return;  
    }  
    setErrors([]); // Reset errors if there are none  

    const doctorRegNum = "DOC123";  
    const patientRegNum = "PAT456";  

    const tabletData = tablets.map((tablet) => ({  
      name: tablet.name,  
      days: tablet.days,  
      slots: tablet.slots,  
      timing: tablet.timing,  
    }));  

    try {  
      const response = await axios.post(  
        "http://localhost:8081/api/tablets/saveTablets",  
        tabletData,  
        {  
          params: { doctorRegNum, patientRegNum },  
          headers: { "Content-Type": "application/json" },  
        }  
      );  

      console.log("Success:", response.data);  
      alert("Tablets saved successfully!");  
    } catch (error) {  
      console.error("Error:", error);  
      alert("Failed to save tablets.");  
    }  
  };  

  return (  
    <div className="generate-prescription-container">  
      <h2 className="heading-prescription">Generate Prescription</h2>  

      {/* Displaying Validation Errors */}  
      {errors.length > 0 && (  
        <div className="error-messages">  
          {errors.map((error, index) => (  
            <p key={index} className="error-message">{error}</p>  
          ))}  
        </div>  
      )}  

      {/* Dynamic Fields */}  
      <div className="prescription-fields">  
        {tablets.map((tablet, index) => (  
          <div key={tablet.id} className="tablet-entry">  
            {tablet.saved ? (  
              <div className="tablet-summary">  
                <span>{tablet.name}</span>  
                <div className="action-icons">  
                  <button onClick={() => handleShowDetails(tablet)} className="show-btn">👁 Show</button>  
                  <button onClick={() => handleEditTablet(index)} className="edit-btn">✏ Edit</button>  
                  <button onClick={() => handleDeleteTablet(index)} className="delete-btn">🗑 Delete</button>  
                </div>  
              </div>  
            ) : (  
              <>  
                <div className="tablet-row">  
                  <div className="label-input-group">  
                    <label>Tablet Name:</label>  
                    <input  
                      type="text"  
                      placeholder="Enter Tablet Name"  
                      value={tablet.name}  
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}  
                    />  
                  </div>  

                  <div className="label-input-group">  
                    <label>No. of Days:</label>  
                    <input  
                      type="number"  
                      placeholder="Enter No. of Days"  
                      value={tablet.days}  
                      onChange={(e) => handleInputChange(index, "days", e.target.value)}  
                    />  
                  </div>  
                </div>  

                <div className="slots-container">  
                  <label>Slots:</label>  
                  <div className="slots">  
                    {["morning", "afternoon", "evening"].map((key) => (  
                      <div key={key} className="slot-group">  
                        <label>  
                          <input  
                            type="checkbox"  
                            checked={tablet.slots[key]}  
                            onChange={() => handleCheckboxChange(index, key)}  
                          />{" "}  
                          {key.charAt(0).toUpperCase() + key.slice(1)}  
                        </label>  

                        {/* Radio Buttons for Meals */}  
                        {tablet.slots[key] && (  
                          <div className="radio-options">  
                            {key === "morning" && (  
                              <>  
                                <label>  
                                  <input  
                                    type="radio"  
                                    name={`${key}-${index}`}  
                                    value="before-breakfast"  
                                    checked={tablet.timing[key] === "before-breakfast"}  
                                    onChange={() => handleRadioChange(index, key, "before-breakfast")}  
                                  />{" "}  
                                  Before Breakfast  
                                </label>  
                                <label>  
                                  <input  
                                    type="radio"  
                                    name={`${key}-${index}`}  
                                    value="after-breakfast"  
                                    checked={tablet.timing[key] === "after-breakfast"}  
                                    onChange={() => handleRadioChange(index, key, "after-breakfast")}  
                                  />{" "}  
                                  After Breakfast  
                                </label>  
                              </>  
                            )}  
                            {key === "afternoon" && (  
                              <>  
                                <label>  
                                  <input  
                                    type="radio"  
                                    name={`${key}-${index}`}  
                                    value="before-lunch"  
                                    checked={tablet.timing[key] === "before-lunch"}  
                                    onChange={() => handleRadioChange(index, key, "before-lunch")}  
                                  />{" "}  
                                  Before Lunch  
                                </label>  
                                <label>  
                                  <input  
                                    type="radio"  
                                    name={`${key}-${index}`}  
                                    value="after-lunch"  
                                    checked={tablet.timing[key] === "after-lunch"}  
                                    onChange={() => handleRadioChange(index, key, "after-lunch")}  
                                  />{" "}  
                                  After Lunch  
                                </label>  
                              </>  
                            )}  
                            {key === "evening" && (  
                              <>  
                                <label>  
                                  <input  
                                    type="radio"  
                                    name={`${key}-${index}`}  
                                    value="before-dinner"  
                                    checked={tablet.timing[key] === "before-dinner"}  
                                    onChange={() => handleRadioChange(index, key, "before-dinner")}  
                                  />{" "}  
                                  Before Dinner  
                                </label>  
                                <label>  
                                  <input  
                                    type="radio"  
                                    name={`${key}-${index}`}  
                                    value="after-dinner"  
                                    checked={tablet.timing[key] === "after-dinner"}  
                                    onChange={() => handleRadioChange(index, key, "after-dinner")}  
                                  />{" "}  
                                  After Dinner  
                                </label>  
                              </>  
                            )}  
                          </div>  
                        )}  
                      </div>  
                    ))}  
                  </div>  
                </div>  

                <div className="button-group">  
                  <button onClick={() => handleSaveTablet(index)} className="save-button">Save</button>  
                  <button onClick={() => handleDeleteTablet(index)} className="delete-button">Delete</button>  
                </div>  
              </>  
            )}  
          </div>  
        ))}  
      </div>  

      <button onClick={handleAddTablet} className="add-button">  
        <span className="icon">+</span> Add Tablet  
      </button>  

      <div className="doctor-notes">  
        <label>Doctor's Notes:</label>  
        <textarea  
          placeholder="Enter additional notes here..."  
          value={doctorNotes}  
          onChange={(e) => setDoctorNotes(e.target.value)}  
        ></textarea>  
        
        <div className="button-group">  
          <button className="upload-button" onClick={handleUpload}>Upload</button>  
          <button className="cancel-button" onClick={() => setDoctorNotes("")}>Cancel</button>  
        </div>  
      </div>  

      {selectedTablet && (  
        <div className="modal-overlay">  
          <div className="modal-content7">  
            <h3>Tablet Details</h3>  
            <p><strong>Tablet Name:</strong> {selectedTablet.name}</p>  
            <p><strong>No. of Days:</strong> {selectedTablet.days}</p>  
            <p><strong>Slots:</strong></p>  
            <ul>  
              {Object.entries(selectedTablet.slots)  
                .filter(([_, isChecked]) => isChecked)  
                .map(([slot, _]) => (  
                  <li key={slot}>  
                    {slot.charAt(0).toUpperCase() + slot.slice(1)} -{" "}  
                    {selectedTablet.timing[slot] ? selectedTablet.timing[slot].replace("-", " ") : "Not selected"}  
                  </li>  
                ))}  
            </ul>  
            <button onClick={handleCloseModal} className="close-modal7">Close</button>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
};  

export default GeneratePrescription;