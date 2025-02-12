import React from "react";
// import "./MinimizeChatbot.css"; // Create this file for styling

const MinimizeChatbot = ({ isMinimized, handleMinimize, handleRestore }) => {
    return (
        <div className="minimize-container">
            {isMinimized ? (
                <button className="open-chatbot-btn" onClick={handleRestore}>
                    💬
                </button>
            ) : (
                <button className="minimize-btn" onClick={handleMinimize}>
                    &minus;
                </button>
            )}
        </div>
    );
};

export default MinimizeChatbot;
