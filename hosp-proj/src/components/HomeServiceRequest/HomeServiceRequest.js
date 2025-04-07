import React, { useState, useEffect } from 'react';
import './HomeServiceRequest.css';  // Ensure you have a corresponding CSS file
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const HomeServiceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem('doctorDetails'));
    const docRegNum = storedDoctor?.regestrationNum;

    console.log(docRegNum);

    // Fetch requests data
    axios.get(`http://localhost:8081/api/home-services/home-service-requests/${docRegNum}`)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
      });

    // Fetch nurses data
    axios.get(`http://localhost:8081/api/nurse/all/${docRegNum}`)  // ✅ Fixed template literal
      .then((response) => {
        setNurses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching nurses:', error);
      });
  }, []);

  // Handle accepting a service request
  const handleAcceptClick = (requestId) => {
    setSelectedRequest(requestId);
    setModalVisible(true); // Show the modal to assign a nurse
  };

  // Handle nurse assignment and closing the modal
  const handleAssignNurse = () => {
    if (selectedNurse && selectedRequest) {
      axios
        .put(`http://localhost:8081/api/home-services/update-status/${selectedRequest}`, {
          status: "Accepted"
        })
        .then((response) => {
          console.log("Nurse assigned successfully:", response.data);

          // Update request list to reflect assigned nurse
          const updatedRequests = requests.map((req) =>
            req.id === selectedRequest ? { ...req, status: "Accepted" } : req
          );
          setRequests(updatedRequests);

          // Close modal
          setModalVisible(false);
        })
        .catch((error) => {
          console.error("Error assigning nurse:", error);
        });
    } else {
      alert("Please select a nurse.");
    }
  };


  // Filter requests based on search query
 // Filter requests based on search query
const filteredRequests = requests.filter((item) => {
  const query = searchQuery.toLowerCase();
  
  return (
    (item.patientName?.toLowerCase() || "").includes(query) ||
    (item.requestDate?.toLowerCase() || "").includes(query) ||
    (item.status?.toLowerCase() || "").includes(query)
  );
});


  const handleBack = () => {
    sessionStorage.setItem("validNavigation", "true");
    navigate("/doctors-dashboard-page");
  };

 // Function to decode URL-encoded string manually, handling special characters.
const decodeUrlEncodedString = (encodedString) => {
    try {
      // Try to decode and catch any errors in the process
      return decodeURIComponent(encodedString);
    } catch (error) {
      console.error("Error while decoding URL:", error);
      return null;
    }
  };
  
  // Function to download the PDF
  const handleDownloadPDF = (encodedData, filename) => {
    if (!encodedData) {
      alert("No Prescription Available!");
      return;
    }
  
    try {
      // Step 1: Remove extra URL encoding and decode
      const urlDecodedData = decodeUrlEncodedString(encodedData.trim());
      if (!urlDecodedData) {
        console.error("Failed to decode URL.");
        alert("Failed to decode URL.");
        return;
      }
      
      console.log("Decoded URL Data: ", urlDecodedData);  // Log decoded data
      
      // Step 2: Base64 Decode (if needed, assuming data is Base64 encoded after URL decoding)
      const byteCharacters = atob(urlDecodedData);
      console.log("Base64 Decoded Data: ", byteCharacters); // Log base64 decoded data
  
      // Step 3: Convert to Uint8Array
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Step 4: Create a Blob and download the PDF
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "prescription.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.log("Download triggered for PDF.");
  
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      alert("Failed to download the PDF.");
    }
  };
  


  const handlePrescriptionClick = (pdfData, fileName) => {
    if (!pdfData) {
      console.error("No PDF data found.");
      return;
    }

    // Convert Base64 PDF data into a Blob
    const byteCharacters = atob(pdfData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a download link
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName || 'prescription.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

  
  

  // Render the modal for assigning a nurse
  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <h3>Assign Nurse</h3>
        <div className="form-group">
          <label>Select Nurse:</label>
          <select
            value={selectedNurse}
            onChange={(e) => setSelectedNurse(e.target.value)}
          >
            <option value="">--Select Nurse--</option>
            {nurses.map((nurse) => (
              <option key={nurse.id} value={nurse.id}>{nurse.name}</option>
            ))}
          </select>
        </div>
        <div className="modal-buttons">
          <button onClick={handleAssignNurse}>Assign Nurse</button>
          <button onClick={() => setModalVisible(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-service-request">
      <div className="back-arrow" onClick={handleBack}>
        <i className="fas fa-arrow-left"></i>
      </div>

      <h2>Home Service Requests</h2>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Patient Name, Date, or Status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="request-table-container">
        <table className="request-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Patient Name</th>
              <th>Request Date</th>
              <th>Time</th>
              <th>e-Prescription</th>
              <th>Identity Docs</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.patientName}</td>
                <td>{item.requestDate}</td>
                <td>{item.time}</td>
                <td>
                  {item.ePrescription ? (
                    <button 
                    className="prescription-btn"
                    onClick={() => handlePrescriptionClick(item.ePrescription, `Prescription-${item.patientRegNum}.pdf`)}
                  >
                    <i className="icon">&#x1F4D6;</i> {/* PDF Icon */}
                  </button>
                  ) : "Not Available"}
                </td>
                <td>
                  {item.identityDocs ? (
                    <button 
                    className="prescription-btn"
                    onClick={() => handlePrescriptionClick(item.identityDocs, `Identity-${item.patientRegNum}.pdf`)}
                  >
                    <i className="icon">&#x1F4D6;</i> {/* PDF Icon */}
                  </button>
                  ) : "Not Available"}
                </td>
                <td>
  {item.status !== "Accepted" ? (
    <button className="accept-btn" onClick={() => handleAcceptClick(item.id)}>
      Accept
    </button>
  ) : (
    <span className="accepted-text">Accepted</span>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && renderModal()}
    </div>
  );
};

export default HomeServiceRequest;
