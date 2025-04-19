import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboardPage.css";
import MapModal from "../MapModal/MapModal"; // import your modal

const NurseDashboardPage = () => {
  const [nurseName, setNurseName] = useState("");
  const [requests, setRequests] = useState([]);
  const [showMap, setShowMap] = useState(false); // new
  const [selectedLocation, setSelectedLocation] = useState(null); // new
  const navigate = useNavigate();

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("nurseDetails"));
    if (storedDetails && storedDetails.firstName) {
      setNurseName(`${storedDetails.firstName} ${storedDetails.lastName}`);

      fetch(`http://localhost:8081/api/nurse/allRequests?nurseRegNum=${storedDetails.registrationNumber}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("No requests found");
          }
          return res.json();
        })
        .then((data) => setRequests(data))
        .catch((err) => {
          console.error("Error fetching nurse requests:", err);
          setRequests([]);
        });

    } else {
      sessionStorage.setItem("validNavigation", "true");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("nurseDetails");
    localStorage.removeItem("token");
    sessionStorage.setItem("validNavigation", "true");
    navigate("/login");
  };

  const handleStart = (request) => {
    if (request.location) {
      setSelectedLocation(request.location); // Set location from API
      setShowMap(true); // Show the map modal
    } else {
      alert("Location not available for this request.");
    }
  };

  const closeModal = () => {
    setShowMap(false);
    setSelectedLocation(null);
  };

  return (
    <div>
      <div className="logout-container00">
        <button className="logout-button00" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="nurse-welcome">
        <h1>Welcome, Nurse {nurseName}!</h1>
      </div>

      <div className="table-container">
        <h2>Assigned Home Service Requests</h2>
        {requests.length > 0 ? (
          <table className="nurse-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={index}>
                  <td>{req.name}</td>
                  <td>{req.reason}</td>
                  <td>{req.date}</td>
                  <td>{req.time}</td>
                  <td>
                    <button
                      className="start-button"
                      onClick={() => handleStart(req)}
                    >
                      Start
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No requests assigned yet.</p>
        )}
      </div>

      {/* Render the map modal if showMap is true */}
      {showMap && selectedLocation && (
        <MapModal location={selectedLocation} onClose={closeModal} />
      )}
    </div>
  );
};

export default NurseDashboardPage;
