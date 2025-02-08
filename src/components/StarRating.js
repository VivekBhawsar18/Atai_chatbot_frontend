import React from 'react';
import './StarRating.css';

const StarRating = ({ currentSliderValue, handleReviewSubmit, isRatingDisabled }) => (
    <div className="review-details-input">
        <p>Please rate your satisfaction:</p>
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((rating) => (
                <button
                    key={rating}
                    className={`star-button ${currentSliderValue >= rating ? 'filled' : ''}`}
                    onClick={() => handleReviewSubmit(rating, true)}
                    disabled={isRatingDisabled} // Disable after submission
                >
                    ★
                </button>
            ))}
        </div>
    </div>
);

export default StarRating;
