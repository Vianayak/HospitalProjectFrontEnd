import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboardPage.css";
import NurseCalendar from "../NurseCalendar/NurseCalendar";
import PaymentModal from "../PaymentModal/PaymentModal"; // ✅ Import PaymentModal
import MapModal from "../MapModal/MapModal";

const NurseDashboardPage = () => {
  const [nurseName, setNurseName] = useState("");
  const [requests, setRequests] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMap, setShowMap] = useState(false); // new
  const [selectedLocation, setSelectedLocation] = useState(null); // new
  const navigate = useNavigate();

  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("nurseDetails"));
    if (storedDetails && storedDetails.firstName) {
      setNurseName(`${storedDetails.firstName} ${storedDetails.lastName}`);

      fetch(
        `http://localhost:8081/api/nurse/allRequests?nurseRegNum=${storedDetails.registrationNumber}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("No requests found");
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

  useEffect(() => {
    document.body.style.overflow = showPaymentModal ? "hidden" : "auto";
  }, [showPaymentModal]);

  const handleLogout = () => {
    localStorage.removeItem("nurseDetails");
    localStorage.removeItem("token");
    sessionStorage.setItem("validNavigation", "true");
    navigate("/login");
  };

  const handleOpen = (request) => {
    console.log("Clicked request:", request);
    setSelectedRequest(request);
    setShowPaymentModal(true);
  };



  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedRequest(null);
  };


  const handleStart = (request) => {
    setShowPaymentModal(false);
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
        <h1>Welcome Nurse, {nurseName}!</h1>
      </div>

      {requests.length > 0 && (
        <>
          <NurseCalendar requests={requests} onEventClick={handleOpen} />
        </>
      )}

      {/* ✅ Render Payment Modal through Portal */}
      {showPaymentModal && selectedRequest && (
        <PaymentModal
          selectedRequest={selectedRequest}
          onComplete={handleStart}
          onCancel={handleCancelPayment}
        />
      )}

{showMap && selectedLocation && (
        <MapModal location={selectedLocation} onClose={closeModal} />
      )}

    </div>
  );
};

export default NurseDashboardPage;
