import React, { useState } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { Bot } from "lucide-react";
import "./ChatBot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "What is the issue you are experiencing today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Ensure the default message is always present when chat opens
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
      // Call the backend API
      const response = await fetch("http://localhost:8081/api/chatBot/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input), // Send user input to backend
      });
  
      const data = await response.json();
  
      if (data.length > 0) {
        // Map over all doctors and create messages for each
        const botMessages = data.map((doctor) => ({
          text: `Dr. ${doctor.name} - ${doctor.specialization}`,
          sender: "bot",
        }));
  
        setMessages((prevMessages) => [...prevMessages, ...botMessages]); // Add all doctor responses
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
      {/* Floating Chat Button */}
      {!isOpen && (
        <>
          <div className="chat-icon" onClick={toggleChat}>
            <FaComments size={24} color="white" />
          </div>
          <span className="chat-message">What is the issue you are experiencing today?</span>
        </>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <h3> <Bot size={28} style={{ marginRight: "10px" }} /> Doctor Assistance</h3>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                <span className="profile-icon">
                  {msg.sender === "user" ? "👤" : "🤖"}
                </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Chat Footer */}
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
