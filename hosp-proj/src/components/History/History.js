import React, { useState } from 'react';
import './History.css';

// Static data for demonstration purposes
const historyData = [
  { id: 1, regno: '123455', date: '2025-02-24', time: '10:00 AM', patientName: 'John Doe', prescriptionLink: '/prescription/1' },
  { id: 2, regno: '123456', date: '2025-02-24', time: '11:00 AM', patientName: 'Jane Smith', prescriptionLink: '/prescription/2' },
  { id: 3, regno: '123457', date: '2025-02-25', time: '01:00 PM', patientName: 'Alex Johnson', prescriptionLink: '/prescription/3' },
  { id: 4, regno: '123458', date: '2025-02-24', time: '10:00 AM', patientName: 'Emily Davis', prescriptionLink: '/prescription/4' },
  { id: 5, regno: '123459', date: '2025-02-24', time: '11:00 AM', patientName: 'Michael Brown', prescriptionLink: '/prescription/5' },
  { id: 6, regno: '123460', date: '2025-02-25', time: '01:00 PM', patientName: 'Sara White', prescriptionLink: '/prescription/6' },
  { id: 7, regno: '123455', date: '2025-02-24', time: '10:00 AM', patientName: 'John Doe', prescriptionLink: '/prescription/1' },
  { id: 8, regno: '123456', date: '2025-02-24', time: '11:00 AM', patientName: 'Jane Smith', prescriptionLink: '/prescription/2' },
  { id: 9, regno: '123457', date: '2025-02-25', time: '01:00 PM', patientName: 'Alex Johnson', prescriptionLink: '/prescription/3' },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handlePrescriptionClick = (prescriptionLink) => {
    console.log('Opening prescription for:', prescriptionLink);
    // You can use `navigate(prescriptionLink)` here if you have `useNavigate` from react-router
  };

  // Filter history data based on search query
  const filteredData = historyData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.regno.toLowerCase().includes(query) ||
      item.patientName.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query)
    );
  });

  return (
    <div className="history-page">
      <h2 className="history-title">History Page</h2>
      
      {/* Search Input */}
      <input
        type="text"
        className="history-search-input"
        placeholder="Search by Reg No, Patient Name, or Date"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th className="history-table-header">S.No</th>
              <th className="history-table-reg-no">Reg No</th> {/* Blue background applied here */}
              <th className="history-table-header">Date</th>
              <th className="history-table-header">Time</th>
              <th className="history-table-header">Patient Name</th>
              <th className="history-table-header">Prescription</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td className="history-table-cell">{index + 1}</td>
                <td className="history-table-cell">{item.regno}</td> {/* Regular style applied */}
                <td className="history-table-cell">{item.date}</td>
                <td className="history-table-cell">{item.time}</td>
                <td className="history-table-cell">{item.patientName}</td>
                <td className="history-table-cell">
                  <button className="prescription-btn" onClick={() => handlePrescriptionClick(item.prescriptionLink)}>
                    <i className="icon">&#x1F4D6;</i> {/* Icon for Prescription */}
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
