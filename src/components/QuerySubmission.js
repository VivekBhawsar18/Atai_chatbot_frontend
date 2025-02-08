import React from 'react';
import './QuerySubmission.css';

const QuerySubmission = ({ currentQuery, setCurrentQuery, handleQuerySubmit, handleMicInput, isQueryDisabled }) => (
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
            <div className="input-icons">
                <button className="mic-button" onClick={handleMicInput}>
                    <i className="fa fa-microphone" aria-hidden="true"></i>
                </button>
                <button className="send-button" onClick={handleQuerySubmit} disabled={isQueryDisabled}>
                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
);

export default QuerySubmission;
