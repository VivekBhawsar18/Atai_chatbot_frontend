import React from 'react';
// import logo from './public/assets/images/logo.png';

// import './Chatbot.css';

const ChatbotHeader = ({ handleClose, handleMinimize }) => (
    <div className="chatbot-header">
        <nav className="chatbot-navbar">
            {/* <img src={logo} alt="Logo" className="chatbot-logo-image" /> */}
            <img src="/assets/images/logo.png" alt="Logo" className="chatbot-logo-image" />

            <h2 className="chatbot-title">Ask ATai</h2>
            <button className="chatbot-close-button" onClick={handleClose}>
                &times;
            </button>
            {/* <button className="minimize-btn" onClick={handleMinimize}>&minus;</button> */}
        </nav>
    </div>
);

export default ChatbotHeader;
