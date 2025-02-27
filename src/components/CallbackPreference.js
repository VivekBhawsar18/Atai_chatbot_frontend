import React, { useState } from 'react';
// import './CallbackPreference.css';

const CallbackPreference = ({ options, handleSubmitCallbackPreference }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = (preference) => {
        if (!isClicked) {
            setIsClicked(true); // Hide buttons after first click
            handleSubmitCallbackPreference(preference);
        }
    };

    return (
        <div className="callback-preference">
            {!isClicked && options.map((option, index) => (
                <button key={index} onClick={() => handleClick(option)}>{option}</button>
            ))}
        </div>
    );
};

export default CallbackPreference;



// import React, { useState } from 'react';
// // import './CallbackPreference.css';

// const CallbackPreference = ({ handleSubmitCallbackPreference }) => {
//     const [isClicked, setIsClicked] = useState(false);



//     const handleClick = (preference) => {
//         if (!isClicked) {
//             setIsClicked(true); // Hide buttons after first click
//             handleSubmitCallbackPreference(preference);
//         }
//     };

//     return (
//         <div className="callback-preference">
//             {!isClicked && (
//                 <>
//                     <button onClick={() => handleClick('Yes')}>Yes</button>
//                     <button onClick={() => handleClick('No')}>No</button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default CallbackPreference;
