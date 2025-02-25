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


// import React, { useState, useEffect } from 'react';
// import './CallbackPreference.css';

// const CallbackPreference = ({ handleSubmitCallbackPreference, options }) => {
//     const [localOptions, setLocalOptions] = useState([]);

//     useEffect(() => {
//         // ✅ Only set options if not already selected
//         if (options.length > 0) {
//             setLocalOptions(options);
//         }
//     }, [options]);

//     const handleClick = (preference) => {
//         handleSubmitCallbackPreference(preference);
//         setLocalOptions([]); // ✅ Hide buttons after selection
//     };

//     return (
//         <div className="callback-preference">
//             {localOptions.map((option, index) => (
//                 <button key={index} onClick={() => handleClick(option)}>
//                     {option}
//                 </button>
//             ))}
//         </div>
//     );
// };

// export default CallbackPreference;
