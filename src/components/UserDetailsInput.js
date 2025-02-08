import React from 'react';
import './UserDetailsInput.css';

const UserDetailsInput = ({ currentStep, handleSubmitDetails }) => (
    <div className="user-details-input">
        <input
            type="text"
            placeholder={
                currentStep === 1
                    ? 'Enter your name'
                    : currentStep === 2
                        ? 'Enter your email address'
                        : currentStep === 3
                            ? 'Enter your phone number'
                            : ''
            }
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleSubmitDetails(e.target.value);
                    e.target.value = '';
                }
            }}
        />
    </div>
);

export default UserDetailsInput;
