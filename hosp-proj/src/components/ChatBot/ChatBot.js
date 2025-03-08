import React, { useState } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./ChatBot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "What is the issue you are experiencing today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const navigate = useNavigate(); // Use for page navigation

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ text: "What is the issue you are experiencing today?", sender: "bot" }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8081/api/chatBot/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.length > 0) {
        const botMessages = data.map((doctor) => ({
          text: `Dr. ${doctor.name} - ${doctor.specialization}`,
          sender: "bot",
          doctorName: doctor.name, // Store doctor name for navigation
        }));

        setMessages((prevMessages) => [...prevMessages, ...botMessages]);
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: "No doctors found.", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to server.", sender: "bot" }]);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div className="chat-icon" onClick={toggleChat}>
          <FaComments size={24} color="white" />
        </div>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3><Bot size={28} style={{ marginRight: "10px" }} /> Doctor Assistance</h3>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                <span className="profile-icon">{msg.sender === "user" ? "👤" : "🤖"}</span>
                <span>{msg.text}</span>

                {/* Book Appointment Button */}
                {msg.sender === "bot" && msg.doctorName && (
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
