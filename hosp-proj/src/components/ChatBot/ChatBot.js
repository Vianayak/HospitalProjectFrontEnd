import React, { useState } from "react";
import { FaComments, FaTimes, FaPaperPlane, FaExpand, FaCompress } from "react-icons/fa";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./ChatBot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false); // State for maximize/minimize
  const [messages, setMessages] = useState([
    { text: "What is the issue you are experiencing today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip state
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate(); // Use for page navigation

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ text: "What is the issue you are experiencing today?", sender: "bot" }]);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    // Show "Loading..." before fetching the data
    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { text: "Loading...", sender: "bot" }]);

    try {
      const response = await fetch("http://localhost:8081/api/chatBot/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setLoading(false); // Stop loading

      if (data.length > 0) {
        const botMessages = data.map((doctor) => ({
          text: `Dr. ${doctor.name} - ${doctor.specialization}`,
          sender: "bot",
          doctorName: doctor.name, // Store doctor name for navigation
        }));

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove "Loading..." message
          ...botMessages
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove "Loading..." message
          { text: "No doctors found.", sender: "bot" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove "Loading..." message
        { text: "Error connecting to server.", sender: "bot" }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div
          className="chat-icon"
          onClick={toggleChat}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <FaComments size={24} color="white" />
          {showTooltip && <div className="tooltip">Hi! How Can I Assist You Today?</div>}
        </div>
      )}

      {isOpen && (
        <div className={`chat-window ${isMaximized ? "maximized" : ""}`}>
          <div className="chat-header">
            <h3><Bot size={28} style={{ marginRight: "10px" }} /> Doctor Assistance</h3>
            
            <div className="chat-header-buttons">
              <button className="maximize-btn" onClick={toggleMaximize}>
                {isMaximized ? <FaCompress /> : <FaExpand />}
              </button>
              <button className="close-btn" onClick={toggleChat}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                <span className="profile-icon">{msg.sender === "user" ? "👤" : "🤖"}</span>
                <span>{msg.text}</span>

                {/* Book Appointment Button */}
                {msg.sender === "bot" && msg.doctorName && !loading && (
                  <button 
                    className="book-btn" 
                    onClick={() => {
                      sessionStorage.setItem("validNavigation", "true"); // Set session flag
                      navigate(`/book-appointments-page?doctorName=${encodeURIComponent(msg.doctorName)}`);
                    }}
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
