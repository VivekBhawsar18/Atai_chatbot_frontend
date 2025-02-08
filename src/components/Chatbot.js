import React, { useState, useEffect, useRef } from "react";
import {
    initRecordingConversation,
    startChat,
    sendMessage,
    submitUserDetails,
    submitCallbackPreference,
    submitSatisfaction,
    terminateChat,
    terminateResponse,
    submitQuery
} from "../Services/ChatbotService"; // Ensure the path is correct

import ChatbotHeader from './ChatbotHeader';
import ChatbotConversation from './ChatbotConversation';
import UserDetailsInput from './UserDetailsInput';
import CallbackPreference from './CallbackPreference';
import StarRating from './StarRating';
import QuerySubmission from './QuerySubmission';
import "./Chatbot.css";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatbotId, setChatbotId] = useState(() => {
        const storedId = localStorage.getItem("chatbotId");
        return storedId || "";
    });
    const [options, setOptions] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [disabledOptions, setDisabledOptions] = useState(new Set());
    const [userDetails, setUserDetails] = useState({ name: '', number: '', email: '' });
    const [userSatisfaction, setUserSatisfaction] = useState({ review: '', satisfactionLevel: 0 });
    const [currentStep, setCurrentStep] = useState(0);
    const [currentSliderValue, setCurrentSliderValue] = useState(5);
    const [currentQuery, setCurrentQuery] = useState('');
    const [isQueryDisabled, setIsQueryDisabled] = useState(false);
    const [isRatingDisabled, setIsRatingDisabled] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const conversationEndRef = useRef(null);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);
    const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|test\.com)$/.test(email);
    const isValidNumber = (number) => /^[6-9]\d{9}$/.test(number);

    const generateId = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let uniqueID = "#";
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueID += characters[randomIndex];
        }
        return uniqueID;
    };

    const addToConversation = (message, isBot = true, options = []) => {
        setConversation((prev) => [...prev, { text: message, isBot, options }]);
    };

    const toggleChatbot = async () => {
        if (!isOpen) {
            const newId = generateId();
            console.log(newId);
            setChatbotId(newId);
            localStorage.setItem("chatbotId", newId);

            setOptions([]);
            setConversation([]);
            setDisabledOptions(new Set());
            setUserDetails({ name: '', number: '', email: '' });
            setUserSatisfaction({ review: '', satisfactionLevel: 0 });
            setCurrentStep(0);
            setCurrentSliderValue(5);
            setIsQueryDisabled(false);

            try {
                await initRecordingConversation(newId);
                console.log("Conversation recording initialized");

                const response = await startChat(newId);
                console.log("Start Chat Response:", response);

                const initialOptions = ["Our Services", "Book A Demo"];
                setOptions(initialOptions);

                const initialMessage = Array.isArray(response.data.message)
                    ? response.data.message.join(' ')
                    : response.data.message;
                addToConversation(initialMessage);
                addToConversation("Choose an option:", true, initialOptions);
            } catch (error) {
                console.error("Error starting chatbot:", error);
            }
            setIsOpen(true); // Open the chatbot
        }
    };

    const handleClose = async () => {
        try {
            const response = await terminateChat(chatbotId);
            console.log("Terminate Chat Response:", response);
            setDisabledOptions(new Set());

            addToConversation(response.data.message, true, ['Y', 'N']);
        } catch (error) {
            console.log('Error during termination', error);
            addToConversation('Error terminating the conversation. Please try again later.');
        }
    };

    const handleOptionClick = async (option) => {
        try {

            if (option === "Y" || option === "N") {
                const terminateResponse = await handleTerminateResponse(chatbotId, option);
                addToConversation(terminateResponse.message);
            }

            console.log("Selected Option:", option);
            setIsTyping(true);
            const response = await sendMessage(chatbotId, option.trim());
            setIsTyping(false);
            console.log("🔥 API Response:", response);

            if (response?.error) {
                console.error("❌ Server Error:", response.error);
                setConversation((prev) => [
                    ...prev,
                    { text: "Invalid choice. Please select a valid option.", isBot: true, options: [] },
                ]);
                return;
            }

            // ✅ If "Our Services" is selected, show service list
            if (option === "Our Services" && response.options?.length > 0) {
                setOptions(response.options); // Ensure options are set
                setConversation((prev) => [
                    ...prev,
                    { text: "Here are our services:", isBot: true },
                    { text: "Please select a service:", isBot: true, options: response.options }, // Clickable options
                ]);
                return;
            }



            // ✅ If "Book A Demo" is selected, immediately ask for details
            if (option === "Book A Demo") {
                setConversation((prev) => [
                    ...prev,
                    { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
                    { text: "Please provide your name.", isBot: true }, // ✅ First input request
                ]);
                setCurrentStep(1); // Move to details submission step
                return;
            }

            // ✅ If asking for timeline (Only for "Our Services" flow)
            if (response.message === "When do you wish to start?") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true, options: response.options || [] },
                ]);
                setOptions(response.options);
                return;
            }

            // ✅ If asking for user details, automatically request name
            if (response.message === "Kindly provide your details to help us provide you the best service:") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true },
                    { text: "Please provide your name.", isBot: true }, // ✅ Start user details input immediately
                ]);
                setCurrentStep(1); // Start details submission
                return;
            }

            // ✅ If asking for callback preference
            if (response.message === "Please choose your callback preference:") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true, options: ["Phone Call", "Email"] },
                ]);
                setCurrentStep(4); // Move to callback step
                return;
            }

            // ✅ If asking for ratings
            if (response.message === "Please give us a rating:") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true },
                ]);
                setCurrentStep(5); // Move to ratings step
                return;
            }

            // ✅ Default case: Show backend message
            setConversation((prev) => [
                ...prev,
                { text: response.message, isBot: true, options: response.options || [] },
            ]);

        } catch (error) {
            console.error("❌ Error handling option:", error);
        }
    };

    const handleTerminateResponse = async (response) => {
        try {
            console.log("User termination response:", response);

            // Call the backend to process the termination response
            const apiResponse = await terminateResponse(chatbotId, response);
            console.log("🔥 Termination API Response:", apiResponse);

            if (apiResponse?.error) {
                console.error("❌ Server Error:", apiResponse.error);
                setConversation((prev) => [
                    ...prev,
                    { text: "Something went wrong. Please try again later.", isBot: true },
                ]);
                return;
            }

            // ✅ Use the backend response message dynamically
            setConversation((prev) => [
                ...prev,
                { text: apiResponse.message, isBot: true }, // Message from backend
            ]);

        } catch (error) {
            console.error("❌ Error handling termination response:", error);
            setConversation((prev) => [
                ...prev,
                { text: "Error processing your request. Please try again.", isBot: true },
            ]);
        }
    };


    const handleSubmitDetails = async (detail) => {
        let updatedDetails = { ...userDetails };

        let isValid = false;
        if (currentStep === 1) {
            // Validate Name
            isValid = isValidName(detail);
            if (!isValid) {
                setConversation((prev) => [
                    ...prev,
                    { text: 'Invalid name. Please enter alphabetic characters only.', isBot: true },
                ]);
                return;
            }
            updatedDetails.name = detail;
            setConversation((prev) => [
                ...prev,
                { text: detail, isBot: false, isUser: true },
                { text: 'Please provide your email address.', isBot: true },
            ]);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            //Validate Email
            isValid = isValidEmail(detail);
            if (!isValid) {
                setConversation((prev) => [
                    ...prev,
                    { text: 'Invalid email. Please enter a valid email with @gmail.com or @test.com.', isBot: true },
                ]);
                return;
            }
            updatedDetails.email = detail;
            setConversation((prev) => [
                ...prev,
                { text: detail, isBot: false, isUser: true },
                { text: 'Please provide your phone number (without country code).', isBot: true },
            ]);
            setCurrentStep(3);

        } else if (currentStep === 3) {
            // Validate Phone Number
            isValid = isValidNumber(detail);
            if (!isValid) {
                setConversation((prev) => [
                    ...prev,
                    { text: 'Invalid phone number. Please enter a 10-digit number starting with 6-9.', isBot: true },
                ]);
                return;
            }
            updatedDetails.number = detail;
            setConversation((prev) => [
                ...prev,
                { text: detail, isBot: false, isUser: true },
            ]);
            try {
                // Submit user details to the server
                const response = await submitUserDetails(chatbotId, `${updatedDetails.name},${updatedDetails.number},${updatedDetails.email}`);
                //Replay the stored query after collecting details
                if (response.error) {
                    console.error("❌ Error submitting details:", response.error);
                    setConversation((prev) => [...prev, { text: response.error.message || 'An error ocuureed.', isBot: true }]);
                    return;
                }
                setConversation((prev) => [
                    ...prev,
                    { text: currentQuery, isBot: false, isUser: true },//Replay user's query
                    { text: "Thank you for providing your details. Your query has been registered.", isBot: true },

                ]);


                setOptions([]); // Clear options for the callback preference step
                setCurrentStep(4); // Move to callback preference step
            } catch (error) {
                console.error('Error sending user details:', error);
                // setConversation((prev) => [
                //     ...prev,
                //     { text: error.message || 'An unexpected error occurred. Please try again later.', isBot: true },
                // ]);
            }
        }
        setUserDetails(updatedDetails);
    };


    const handleSubmitCallbackPreference = async (preference) => {
        try {
            await submitCallbackPreference(chatbotId, preference);
            setConversation((prev) => [
                ...prev,
                { text: 'Callback preference submitted successfully.', isBot: true, options: [] },
                { text: "Please give us a Ratings(*).", isBot: true },
            ]);
            setCurrentStep(5);
        } catch (error) {
            console.error('Error submitting callback preference:', error);
            setConversation((prev) => [
                ...prev,
                { text: 'Error submitting callback preference. Please try again later.', isBot: true, options: [] },
            ]);
        }
    };

    const handleReviewSubmit = async (detail, isSatisfaction = false) => {
        let updatedReviewDetails = { ...userSatisfaction };

        if (currentStep === 5 && isSatisfaction) {
            updatedReviewDetails.satisfactionLevel = detail;
            const fullStars = Math.floor(detail);
            const hasHalfStar = detail % 1 !== 0;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            const visualStars = '★'.repeat(fullStars) + (hasHalfStar ? '★' : '') + '☆'.repeat(emptyStars);

            setConversation((prev) => [
                ...prev,
                { text: `Ratings: ${visualStars} (${detail}/5)`, isBot: false, isUser: true },
                { text: 'Thank you for providing ratings(*) .', isBot: true },
            ]);

            setOptions([]);
            setIsRatingDisabled(true);

            try {
                await submitSatisfaction(chatbotId, updatedReviewDetails.satisfactionLevel);
            } catch (error) {
                console.error('Error submitting satisfaction:', error);
            }

            setUserSatisfaction(updatedReviewDetails);
        }
    };

    const handleQuerySubmit = async () => {
        if (!currentQuery.trim() || isQueryDisabled) return;

        if (!userDetails.name || !userDetails.email || !userDetails.number) {
            setConversation((prev) => [
                ...prev,
                { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
                { text: "Please provide your name.", isBot: true },
            ]);
            setCurrentStep(1);
            return;
        }

        try {
            setIsQueryDisabled(true);

            if (currentQuery.trim()) {
                setConversation((prev) => [
                    ...prev,
                    { text: currentQuery, isBot: false, isUser: true },
                ]);
            }

            setConversation((prev) => [
                ...prev,
                { text: "Thank you for providing your details. Your query has been registered.", isBot: true },
            ]);

            setCurrentQuery("");
            const response = await submitQuery(chatbotId, currentQuery);
            console.log(response);
        } catch (error) {
            console.error("Error submitting query:", error);
            setConversation((prev) => [
                ...prev,
                { text: "There was an error submitting your query. Please try again later.", isBot: true },
            ]);
        }
    };




    // const handleOptionClick = async (option) => {
    //     try {
    //         console.log("Selected Option:", option);
    //         setDisabledOptions(new Set([...disabledOptions, option])); // Disable the clicked option

    //         const response = await sendMessage(chatbotId, option);
    //         console.log("🔥 API Response:", JSON.stringify(response, null, 2));

    //         if (response?.error) {
    //             console.error("❌ Server Error:", response.error);
    //             setConversation((prev) => [
    //                 ...prev,
    //                 { text: "Invalid choice. Please select a valid option.", isBot: true, options: [] },
    //             ]);
    //             return;
    //         }

    //         // ✅ Handle "Our Services"
    //         if (option === "Our Services" && response.options?.length > 0) {
    //             setOptions(response.options); // Update available options
    //             setConversation((prev) => [
    //                 ...prev,
    //                 { text: "Here are our services:", isBot: true },
    //                 ...response.options.map((service) => ({ text: service, isBot: true })),
    //             ]);
    //             return;
    //         }

    //         // ✅ Handle "Book A Demo" to directly request details
    //         if (option === "Book a Demo") {
    //             setConversation((prev) => [
    //                 ...prev,
    //                 { text: response.message || "Please provide your details.", isBot: true },
    //             ]);
    //             setCurrentStep(1); // Activate input field for details
    //             return;
    //         }

    //         // ✅ Default case for other responses
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: response.message, isBot: true },
    //         ]);

    //     } catch (error) {
    //         console.error("❌ Error sending message:", error);
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: "An error occurred. Please try again later.", isBot: true, options: [] },
    //         ]);
    //     }
    // };



    const handleMicInput = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Sorry, your browser does not support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Recognized speech:", transcript);
            setCurrentQuery(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            console.log("Speech recognition ended.");
        };
    };

    return (
        <div className="chatbot-container">
            <button className="chatbot-logo" onClick={toggleChatbot}>
                💬
            </button>
            {isOpen && (
                <div className="chatbot-frame">
                    <ChatbotHeader handleClose={handleClose} />
                    <ChatbotConversation
                        conversation={conversation}
                        option={options}
                        conversationEndRef={conversationEndRef}
                        isTyping={isTyping}
                        handleOptionClick={handleOptionClick}
                        disabledOptions={disabledOptions}
                    />
                    {currentStep > 0 && currentStep <= 3 && (
                        <UserDetailsInput currentStep={currentStep} handleSubmitDetails={handleSubmitDetails} />
                    )}
                    {currentStep === 4 && !conversation.some(item => item.text === 'Your Callback Preference Submitted') && (
                        <CallbackPreference handleSubmitCallbackPreference={handleSubmitCallbackPreference} />
                    )}
                    {currentStep === 5 && !isRatingDisabled && (
                        <StarRating
                            currentSliderValue={currentSliderValue}
                            handleReviewSubmit={handleReviewSubmit}
                            isRatingDisabled={isRatingDisabled}
                        />
                    )}
                    {!isQueryDisabled && (
                        <QuerySubmission
                            currentQuery={currentQuery}
                            setCurrentQuery={setCurrentQuery}
                            handleQuerySubmit={handleQuerySubmit}
                            handleMicInput={handleMicInput}
                            isQueryDisabled={isQueryDisabled}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
