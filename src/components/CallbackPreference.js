// import React from 'react';
// import './CallbackPreference.css';

// const CallbackPreference = ({ handleSubmitCallbackPreference }) => (
//     <div className="callback-preference">
//         <button onClick={() => handleSubmitCallbackPreference('Yes Please!')}>Yes</button>
//         <button onClick={() => handleSubmitCallbackPreference('No Please!')}>No</button>
//     </div>
// );

// export default CallbackPreference;

import React, { useState } from 'react';
import './CallbackPreference.css';

const CallbackPreference = ({ handleSubmitCallbackPreference }) => {
    const [isClicked, setIsClicked] = useState(false); // ✅ Prevents duplicate buttons

    const handleClick = (preference) => {
        if (!isClicked) {
            setIsClicked(true); // ✅ Hide buttons after first click
            handleSubmitCallbackPreference(preference);
        }
    };

    return (
        <div className="callback-preference">
            {!isClicked && ( // ✅ Only show buttons if not clicked
                <>
                    <button onClick={() => handleClick('Yes')}>Yes</button>
                    <button onClick={() => handleClick('No')}>No</button>
                </>
            )}
        </div>
    );
};

export default CallbackPreference;

