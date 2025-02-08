import React from 'react';
import './CallbackPreference.css';

const CallbackPreference = ({ handleSubmitCallbackPreference }) => (
    <div className="callback-preference">
        <button onClick={() => handleSubmitCallbackPreference('Yes Please!')}>Yes</button>
        <button onClick={() => handleSubmitCallbackPreference('No Please!')}>No</button>
    </div>
);

export default CallbackPreference;
