import React, { useState } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./ChatBot.css";

const Chatbot = ({ isOpen, toggleChatbot }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage = { text: `🤖 You said: "${input}"`, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
          <button
  className="close-btn"
  onClick={(e) => {
    e.stopPropagation(); // Prevent click event from reaching the background
    toggleChatbot();
  }}
>
  <FaTimes />
</button>
         <h3>Chat Assistant</h3>
        


          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
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
