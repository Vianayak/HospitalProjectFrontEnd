import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import HeroSection from "./components/HeroSection/HeroSection";
import ServiceSection from "./components/ServiceSection/ServiceSection";
import HospitalSection from "./components/HospitalSection/HospitalSection";
import DoctorGrid from "./components/Doctors/DoctorGrid";
import SpecialtiesCarousel from "./components/SpecialtiesCarousel/SpecialtiesCarousel";
import Footer from "./components/Footer/Footer";
import FloatingButtons from "./components/FloatingButtons/FloatingButtons";
import DoctorList from "./components/DoctorCards/DoctorList";
import UserAppointment from "./components/Appointment/UserAppointment";
import LoginForm from "./components/Login/LoginForm";
import SignUp from "./components/SignUp/SignUp";
import HealthNewsImages from "./components/health/HealthNewsImages";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Sidebar from "./components/SideBar/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import BookAvailability from "./components/BookAvailability/BookAvailability";
import PatientSidebar from "./components/PatientSidebar/PatientSidebar";
import GeneratePrescription from "./components/GeneratePrescription/GeneratePrescription";
import History from "./components/History/History";
import Chatbot from "./components/ChatBot/ChatBot";
import Preloader from "./components/Preloader/Preloader";
import AddNurse from "./components/AddNurse/AddNurse";
import HomeServices from "./components/HomeServices/HomeServices";
import HomeServiceRequest from "./components/HomeServiceRequest/HomeServiceRequest";
import NurseDashboardPage from "./components/NurseDashboardPage/NurseDashboardPage";



// Overlay component to display content in the popup
const Overlay = ({ children, className = "" }) => (
  <div className={`overlay ${className}`}>
    <div className="popup">{children}</div>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading delay
  }, []);

  const healthNewsRef = useRef(null);
  const scrollToHealthNews = () => {
    if (healthNewsRef.current) {
      healthNewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  

  return (
  <Router>
      {loading ? ( 
        <Preloader /> // Show Preloader while loading
      ) : (
      <AppContent scrollToHealthNews={scrollToHealthNews} healthNewsRef={healthNewsRef} />
    )}
    </Router>
  );
}

const AppContent = ({ scrollToHealthNews, healthNewsRef }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);

  const defaultRoute = "/techSpryn";
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };
  // Add '/doctors-dashboard-page' to hide header and footer
  const hideHeaderFooterRoutes = ["/user-appointment", "/doctors-dashboard-page", "/patient-dashboard-page" ,"/generate-prescription","/login","/history","/addNurse","/home-services","/home-service-request","/nurse-dashboard-page"];
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);


  useEffect(() => {
    const handleReload = (event) => {
      if (event.persisted) return; // Ignore if restored from cache
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleReload);
    window.addEventListener("pageshow", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleReload);
      window.removeEventListener("pageshow", handleReload);
    };
  }, []);
  

  useEffect(() => {
    if (!shouldHideHeaderFooter) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("doctorDetails");
    }
  }, [location, shouldHideHeaderFooter]);

  useEffect(() => {
    // Check for valid navigation flag in sessionStorage
    const validNavigation = sessionStorage.getItem("validNavigation");

    if (location.pathname === defaultRoute) {
      setIsAllowed(true); // Always allow the default route
    } else if (validNavigation) {
      setIsAllowed(true); // Allow if valid navigation flag exists
      sessionStorage.removeItem("validNavigation"); // Remove flag after validation
    } else {
      setIsAllowed(false); // Block direct access
      navigate(defaultRoute, { replace: true }); // Redirect to default route
    }
  }, [location, navigate]);

  // Function to handle navigation through the app
  const handleNavigation = (path) => {
    sessionStorage.setItem("validNavigation", "true"); // Set valid navigation flag
    navigate(path);
  };

  return (
    <div className="App">
      {/* Conditionally render Navbar and Footer, but exclude Sidebar page */}
      {!shouldHideHeaderFooter && <Navbar scrollToHealthNews={scrollToHealthNews} />}

      <Routes>
        <Route
          path="/techSpryn"
          element={
            <>
              <HeroSection />
              <ServiceSection />
              <DoctorGrid />
              <SpecialtiesCarousel />
              <HospitalSection />
              <Chatbot />
              <FloatingButtons />
              <HealthNewsImages/>
            </>
          }
        />
        <Route path="/" element={<Navigate to="/techSpryn" replace />} />

        {/* Routes with Navigation Guard */}
        <Route
          path="/book-appointments-page"
          element={
            isAllowed ? (
              <DoctorList />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />
        <Route
          path="/home-services"
          element={
            isAllowed ? (
              <HomeServices />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />
        <Route
        path="/addNurse"
        element={
          isAllowed ? (
            <AddNurse />
          ) : (
            <Navigate to={defaultRoute}  replace />
          )
        }
      />
        <Route
          path="/user-appointment"
          element={
            isAllowed ? (
              <UserAppointment />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAllowed ? (
              <LoginForm />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />
 <Route
  path="/book-availability"
  element={
    isAllowed ? (
      <BookAvailability/>
    ) : (
      <Navigate to="/login" replace />
    )
  }


  
/>


        <Route
          path="/signup"
          element={
            isAllowed ? (
              <Overlay className="login-overlay">
                <SignUp />
              </Overlay>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/forgot-password-page"
          element={
            isAllowed ? (
              <Overlay className="login-overlay">
                <ForgotPassword />
              </Overlay>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/doctors-dashboard-page"
          element={
            isAllowed ? (
              <ProtectedRoute>
                <Sidebar />
              </ProtectedRoute>
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />
 <Route
  path="/history"
  element={
    isAllowed ? (
      
                <History/>
           
      
    ) : (
      <Navigate to={defaultRoute} replace />
    )
  }
  />

<Route
          path="/home-service-request"
          element={
            isAllowed ? (
              <HomeServiceRequest />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />


        <Route
          path="/patient-dashboard-page"
          element={
            isAllowed ? (
              <ProtectedRoute>
                <PatientSidebar />
              </ProtectedRoute>
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />

<Route
          path="/nurse-dashboard-page"
          element={
            isAllowed ? (
              <ProtectedRoute>
                <NurseDashboardPage />
              </ProtectedRoute>
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          }
        />


        <Route
  path="/generate-prescription"
  element={
    isAllowed ? (
      <GeneratePrescription/>
    ) : (
      <Navigate to="/login" replace />
    )
  }
  />


  

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>

      {/* Conditionally render Footer, but exclude Sidebar page */}
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
};

export default App;
