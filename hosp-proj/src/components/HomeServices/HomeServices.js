import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeServices.css";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const HomeServices = () => {
  const [prescription, setPrescription] = useState(null);
  const [document, setDocument] = useState(null);
  const [extractedID, setExtractedID] = useState(""); // Extracted TechSpryn ID
  const [reason, setReason] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [location, setLocation] = useState(null);

  const prescriptionInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const navigate = useNavigate();

  const handleBack = () => {
    sessionStorage.setItem("validNavigation", "true");
    navigate("/techSpryn");
  };

  // Handle file upload and extract TechSpryn ID (only for prescription)
  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      if (type === "prescription") {
        setPrescription(file);

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map((item) => item.str).join(" ") + " ";
          }

          console.log("Extracted Text:", extractedText); // Debugging log

          // Extract TechSpryn ID (Flexible format: TechSpryn-XXXX or TechSpryn XXXX)
          const match = extractedText.match(/TechSpryn[-\s]?\d{4}/i);
          setExtractedID(match ? match[0] : "Not found");
        };
      } else {
        setDocument(file); // No extraction for document upload
      }
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handlePreview = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  const handleConfirm = async () => {
    if (!reason || !bookingDate || !bookingTime || !prescription || !document) {
      alert("Please fill all details and upload required documents.");
      return;
    }

    try {
      // Prepare FormData for file uploads
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("date", bookingDate);
      formData.append("time", bookingTime);
      formData.append("e_prescription", prescription); // Add prescription file as file object
      formData.append("identity", document); // Add document file as file object
      formData.append("docId", extractedID === "Not found" ? null : extractedID); // Add extracted ID
      formData.append("location", location);

      // Send data to backend using fetch
      const response = await fetch("http://localhost:8081/api/home-services/save-service", {
        method: "POST",
        body: formData, // Send FormData as the body
      });

      if (response.ok) {
        alert("Booking Confirmed!");
        sessionStorage.setItem("validNavigation", "true");
        navigate("/techSpryn");
      } else {
        alert("Error: Failed to save home service.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Error: Could not complete the request.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocation("Location not available");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation(); // Get location on component mount
  }, []);

  return (
    <>
      <h2 className="heading">Request for Home Service</h2>
      <div className="back-arrow" onClick={handleBack}>
        <i className="fas fa-arrow-left"></i>
      </div>

      <div className="upload-section">
        <button className="upload-btn" onClick={() => prescriptionInputRef.current.click()}>
          + Upload Prescription
        </button>
        <input 
          type="file" 
          ref={prescriptionInputRef} 
          style={{ display: "none" }} 
          accept="application/pdf"
          onChange={(e) => handleFileUpload(e, "prescription")} 
        />
        {prescription && (
          <p className="file-name">
            {prescription.name} <button className="preview-btn" onClick={() => handlePreview(prescription)}>Preview</button>
          </p>
        )}
      </div>

      {/* Display Extracted TechSpryn ID */}
      <div className="extracted-id">
        <p><strong>Extracted TechSpryn ID:</strong> {extractedID}</p>
      </div>

      <div className="upload-section">
        <button className="upload-btn" onClick={() => documentInputRef.current.click()}>
          + Upload Aadhar/PAN
        </button>
        <input 
          type="file" 
          ref={documentInputRef} 
          style={{ display: "none" }} 
          accept="application/pdf"
          onChange={(e) => handleFileUpload(e, "document")} 
        />
        {document && (
          <p className="file-name">
            {document.name} <button className="preview-btn" onClick={() => handlePreview(document)}>Preview</button>
          </p>
        )}
      </div>

      <div className="booking-details">
        <label>Reason for Booking:</label>
        <textarea 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          placeholder="Enter reason..."
        ></textarea>

        <label>Booking Date:</label>
        <input 
          type="date" 
          value={bookingDate} 
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <label>Booking Time:</label>
        <input 
          type="time" 
          value={bookingTime} 
          onChange={(e) => setBookingTime(e.target.value)}
        />
      </div>

      <div className="location">
        <p><strong>Current Location:</strong> {location || "Fetching location..."}</p>
      </div>

      <div className="buttons">
        <button className="confirm-btn000" onClick={handleConfirm}>Confirm</button>
      </div>
    </>
  );
};

export default HomeServices;
