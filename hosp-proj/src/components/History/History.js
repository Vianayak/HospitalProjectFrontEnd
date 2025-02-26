import React, { useState, useEffect } from 'react';
import './History.css';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem('doctorDetails'));
    const docRegNum = storedDoctor?.regestrationNum;

    console.log(docRegNum);
  
    if (!docRegNum) {
      console.error("Doctor registration number not found in local storage.");
      return;
    }
  
    const API_URL = `http://localhost:8081/api/tablets/prescriptionHistory/${docRegNum}`;
  
    fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    console.log("API Response:", data);

    if (Array.isArray(data)) {
      setHistoryData(data); // ✅ Directly set array if it's already a flat array
    } else {
      console.warn("Unexpected API structure:", data);
      setHistoryData([]); // Prevent filter() errors
    }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    setHistoryData([]);
  });

  }, []);
  

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

  // Filter history data based on search query
  const filteredData = historyData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.patientRegNum.toLowerCase().includes(query) ||
      item.firstName.toLowerCase().includes(query) ||
      item.generatedDate.toLowerCase().includes(query)
    );
  });



  console.log("History Data:", historyData);
console.log("Filtered Data:", filteredData);


const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`; // Converts 2025-02-26 → 26-02-2025
};

const formatTime = (timeStr) => {
  return timeStr.slice(0, 5); // Extracts only "HH:MM" (ignores seconds & milliseconds)
};



  return (
    <div className="history-page">
        
      <h2 className="history-title">History Page</h2>

      {/* Search Input */}
     <div className="search-container">
  <div className="search-wrapper">
 <input
      type="text"
      className="history-search-input"
      placeholder="Search by Reg No, Patient Name, or Date"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>


      
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th className="history-table-header">S.No</th>
              <th className="history-table-header">Reg No</th>
              <th className="history-table-header">Date</th>
              <th className="history-table-header">Time</th>
              <th className="history-table-header">Patient Name</th>
              <th className="history-table-header">Prescription</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="history-table-cell">{index + 1}</td>
                <td className="history-table-cell">{item.patientRegNum}</td>
                <td className="history-table-cell">{formatDate(item.generatedDate)}</td>
                <td className="history-table-cell">{formatTime(item.generatedTime)}</td>
                <td className="history-table-cell">{item.firstName} {item.lastName}</td>
                <td className="history-table-cell">
                  <button 
                    className="prescription-btn"
                    onClick={() => handlePrescriptionClick(item.pdfData, `Prescription-${item.patientRegNum}.pdf`)}
                  >
                    <i className="icon">&#x1F4D6;</i> {/* PDF Icon */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
