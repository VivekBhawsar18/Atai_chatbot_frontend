import React from 'react';
import MicButton from './MicButton';
import './QuerySubmission.css';

const QuerySubmission = ({ currentQuery, setCurrentQuery, handleQuerySubmit, handleMicInput, isQueryDisabled, userId }) => {
    // console.log("🔥 Chatbot ID in Chatbot.js:", userId); // ✅ Debugging line
    return (
        <div className="query-submission">
            <div className="query-input-container">
                <input
                    type="text"
                    placeholder="Type your query here..."
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuerySubmit();
                    }}
                    disabled={isQueryDisabled} // Disabled after submission
                />

                <MicButton userId={userId} handleMicInput={handleMicInput} />


                <button className="send-button" onClick={handleQuerySubmit} disabled={isQueryDisabled}>
                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
            </div>
        </div >
        // </div >
    );
};
export default QuerySubmission;
