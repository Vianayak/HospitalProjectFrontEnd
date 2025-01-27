import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faCalendarCheck, faClipboardCheck, faUserMd, faPills, faHospital, faFileMedical } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import "./ServiceSection.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const services = [
  { id: 1, icon: faCalendarCheck, title: "Book Appointment", path: "/doctor-cards" },
  { id: 2, icon: faClipboardCheck, title: "Book Health Check-Up", path: "#" },
  { id: 3, icon: faUserMd, title: "Consult Online", path: "/consult" },
  { id: 4, icon: faPills, title: "Buy Medicine", path: "#" },
  { id: 5, icon: faHospital, title: "Find Hospital", path: "#" },
  { id: 6, icon: faFileMedical, title: "View Health Record", path: "#" },
];

const ServiceSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // To control Dialog open/close
  const [meetingId, setMeetingId] = useState(""); // Store entered password
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleServiceClick = (path) => {
    if (path === "/consult") {
      setIsDialogOpen(true); // Open Dialog when "Consult Online" is clicked
    } else {
      if (path === "/doctor-cards") {
        sessionStorage.setItem("validNavigation", "true"); // Set valid navigation flag for doctor-cards
      }
      navigate(path); // Navigate to the specified path for other services
    }
  };

  const handleMeetingSubmit = async () => {
    try {
      // Make API request to validate the password
      const response = await axios.post("http://localhost:8081/api/meet/validateMeet", { meetingId: meetingId });

      // If password is correct, redirect to the meeting link
      const meetingLink = response.data;
      console.log(meetingLink); // Assuming the meeting link is returned in the response
      window.location.href = meetingLink;
      setIsDialogOpen(false); // Close the dialog after successful redirection
    } catch (error) {
      // Handle errors like incorrect password or failed API call
      if (error.response) {
        toast.error(error.response.data); // Show error message from backend
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="container">
      <div className="service-section">
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${service.active ? "active" : ""}`}
            onClick={() => handleServiceClick(service.path)} // Handle click for each service
          >
            <div className="icon">
              <FontAwesomeIcon icon={service.icon} />
            </div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>

      {/* Material-UI Dialog for password entry */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xs" // Set a maximum width to keep the dialog in proportion
        fullWidth
      >
        <DialogTitle>Enter Meeting Id</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Meeting Id"
            type="Meeting Id"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            variant="outlined"
            margin="normal" // Ensures space around the input
            InputLabelProps={{
              shrink: true, // This ensures the label stays above the input field
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleMeetingSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ServiceSection;
