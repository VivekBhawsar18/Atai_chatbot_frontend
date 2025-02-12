import React from 'react';
import logo from '../components/images/logo.png';
import './ChatbotHeader.css';

const ChatbotHeader = ({ handleClose, handleMinimize }) => (
    <div className="chatbot-header">
        <nav className="chatbot-navbar">
            <img src={logo} alt="Logo" className="chatbot-logo-image" />
            <h2 className="chatbot-title">ATai Chatbot</h2>
            <button className="chatbot-close-button" onClick={handleClose}>
                &times;
            </button>
            <button className="minimize-btn" onClick={handleMinimize}>&minus;</button>
        </nav>
    </div>
);

export default ChatbotHeader;
