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
    submitQuery,
    convertAudio
} from "../Services/ChatbotService"; // Ensure the path is correct

import ChatbotHeader from './ChatbotHeader';
import ChatbotConversation from './ChatbotConversation';
import UserDetailsInput from './UserDetailsInput';
import CallbackPreference from './CallbackPreference';
import StarRating from './StarRating';
import QuerySubmission from './QuerySubmission';
// import MinimizeChatbot from "./MinimizeChatbot";
import "./Chatbot.css";

// Define the generateId function at the top
const generateId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueID = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueID += characters[randomIndex];
    }
    return uniqueID;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const [isMinimized, setIsMinimized] = useState(() => {
    //     return localStorage.getItem("chatbotMinimized") === "true";
    // });
    const [userId, setUserId] = useState(() => generateId());
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

    // useEffect(() => {
    //     const storedMinimized = localStorage.getItem("chatbotMinimized");
    //     if (storedMinimized) {
    //         setIsMinimized(storedMinimized === "true");
    //     }
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem("chatbotMinimized", isMinimized);
    // }, [isMinimized]);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    useEffect(() => {
        console.log("isOpen state changed:", isOpen);
    }, [isOpen]);

    // const saveChatHistory = (messages) => {
    //     localStorage.setItem("chatHistory", JSON.stringify(messages));
    // };

    const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);
    const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@(gmail\.com|test\.com)$/.test(email);
    const isValidNumber = (number) => /^[6-9]\d{9}$/.test(number);

    const addToConversation = (message, isBot = true, options = []) => {
        setConversation((prev) => [...prev, { text: message, isBot, options }]);
    };

    const toggleChatbot = async () => {
        // if (isMinimized) {
        //     setIsMinimized(false);
        //     setIsOpen(true);
        //     return;
        // }

        if (!isOpen) {
            console.log("Chatbot button clicked");
            setIsOpen(true);

            setOptions([]);
            setConversation([]);
            setDisabledOptions(new Set());
            setUserDetails({ name: '', number: '', email: '' });
            setUserSatisfaction({ review: '', satisfactionLevel: 0 });
            setCurrentStep(0);
            setCurrentSliderValue(5);
            setIsQueryDisabled(false);

            try {
                await initRecordingConversation(userId);
                console.log("Conversation recording initialized", userId);

                const response = await startChat(userId);
                console.log("Start Chat Response:", response);

                const initialMessage = Array.isArray(response.data.message)
                    ? response.data.message.join(' ')
                    : response.data.message;

                const initialOptions = ["Our Services", "Book A Demo"];
                setOptions(initialOptions);

                setConversation(prev => [
                    ...prev,
                    { text: initialMessage, isBot: true },
                    { text: "Choose an option:", isBot: true, options: initialOptions }
                ]);
                setOptions(initialOptions);
            } catch (error) {
                console.error("Error starting chatbot:", error);
                setConversation(prev => [
                    ...prev,
                    { text: 'Error starting the chatbot. Please try again later.', isBot: true }
                ]);
            }

            setIsOpen(true);
            // setIsMinimized(false);
        } else {
            setIsOpen(false);
            console.log("Chatbot is already open.");
        }
    };

    // const minimizeChatbot = () => {
    //     setIsMinimized(true);
    //     setIsOpen(false);
    // };

    const handleClose = async () => {
        try {
            console.log("🚪 User requested to close the chat...");

            const response = await terminateChat(userId);
            console.log("Terminate Chat Response:", response);

            if (response?.data?.message) {
                // 🟢 Show "Why are you leaving so soon?" message and wait for user input
                addToConversation(response.data.message, true, ["Yes", "No"]);
                return; // 🚨 Prevents automatic chat termination
            }

            // 🟢 If no message from API, force termination
            addToConversation("Error processing termination request. Please try again.", true);
            setTimeout(() => {
                setIsOpen(false);
                setConversation([]);
                setUserId(generateId());
                console.log("✅ Chatbot session forcefully terminated.");
            }, 3000);
        } catch (error) {
            console.error("❌ Error during termination:", error);
            addToConversation("Error terminating the conversation. Please try again later.", true);
        }
    };

    // const restartChat = async () => {
    //     console.log("🔄 Restarting Chatbot...");

    //     // Reset chatbot state completely
    //     setConversation([]);
    //     setOptions([]);
    //     setDisabledOptions(new Set());
    //     setUserDetails({ name: '', number: '', email: '' });
    //     setUserSatisfaction({ review: '', satisfactionLevel: 0 });
    //     setCurrentStep(0);
    //     setCurrentSliderValue(5);
    //     setIsQueryDisabled(false);
    //     setIsRatingDisabled(false);
    //     setCurrentQuery('');
    //     setUserId(generateId()); // Generate a new user session


    // };



    const handleOptionClick = async (option) => {
        try {
            console.log("Selected Option:", option);
            if (option === 'Yes') {
                await handleTerminateResponse('Y');
                setOptions([]);
                return;
            }

            if (option === 'No') {
                await handleTerminateResponse('N');
                setOptions([]);
                return;
            }


            setIsTyping(true);
            const response = await sendMessage(userId, option.trim());
            setIsTyping(false);
            console.log("🔥 API Response:", response);

            if (response.error) {
                console.error("❌ Server Error:", response.error);
                setConversation((prev) => [
                    ...prev,
                    { text: "Invalid choice. Please select a valid option.", isBot: true, options: [] }
                ]);
                return;
            }

            setOptions([]);
            await new Promise(resolve => setTimeout(resolve, 50));

            if (option === "Our Services" && response.options?.length > 0) {
                setOptions(response.options);
                setConversation((prev) => [
                    ...prev,
                    { text: "Here are our services:", isBot: true },
                    { text: "Please select a service:", isBot: true, options: response.options }
                ]);
                return;
            }

            if (option === "Book A Demo") {
                setConversation((prev) => [
                    ...prev,
                    { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
                    { text: "Please provide your name.", isBot: true }
                ]);

                setCurrentStep(1);
                return;
            }

            if (response.message) {
                if (response.message.includes("When do you wish to start")) {
                    setConversation((prev) => [
                        ...prev,
                        { text: response.message, isBot: true, options: response.options || [] }
                    ]);
                    setOptions(response.options);
                    return;
                }

                if (response.message.includes("provide your details")) {
                    setConversation((prev) => [
                        ...prev,
                        { text: response.message, isBot: true },
                        { text: "Please provide your name.", isBot: true }
                    ]);
                    setCurrentStep(1);
                    return;
                }

                if (response.message.includes("Request a Call Back")) {
                    setConversation((prev) => [
                        ...prev,
                        { text: response.message, isBot: true },
                        { text: "", isBot: true, options: ["Yes", "No"] }
                    ]);
                    return;
                }
            }

            setConversation((prev) => [
                ...prev,
                { text: response.message, isBot: true, options: response.options || [] }
            ]);

        } catch (error) {
            setIsTyping(false);
            console.error("❌ Error handling option:", error);
            setConversation((prev) => [
                ...prev,
                { text: "An unexpected error occurred. Please try again later.", isBot: true }
            ]);
        }
    };


    // const handleTerminateResponse = async (responseOption) => {
    //     try {
    //         console.log("User selected termination response:", responseOption);

    //         if (!userId) {
    //             console.error("❌ No user session found. Cannot send termination response.");
    //             return;
    //         }

    //         // Send "Yes" or "No" to the backend
    //         const apiResponse = await terminateResponse(userId, responseOption);

    //         if (!apiResponse || !apiResponse.data) {
    //             throw new Error("No response from server.");
    //         }

    //         console.log("✅ Termination Response API:", apiResponse.data);

    //         setConversation((prev) => [
    //             ...prev,
    //             { text: responseOption, isBot: false, isUser: true },
    //             { text: apiResponse.data.message || "Unexpected response from server.", isBot: true }
    //         ]);

    //         setDisabledOptions(new Set());

    //         if (apiResponse.data.message.includes("Thank you for using our service") || responseOption === 'No') {
    //             setTimeout(() => {
    //                 setIsOpen(false);
    //                 setConversation([]);
    //                 setUserId(generateId());
    //                 console.log("✅ Chatbot session terminated.");
    //             }, 3000);
    //         }

    //     } catch (error) {
    //         console.error("❌ Error sending terminate response:", error.message);
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: "An unexpected error occurred. Please try again later.", isBot: true }
    //         ]);
    //     }
    // };

    const handleTerminateResponse = async (responseOption) => {
        try {
            console.log("User selected termination response:", responseOption);

            if (!userId) {
                console.error("❌ No user session found. Cannot send termination response.");
                addToConversation("Session expired. Please restart the chat.", true);
                return;
            }

            // ✅ Convert "Yes" → "Y", "No" → "N"
            const formattedResponse = responseOption.toUpperCase() === "YES" ? "Y" : "N";
            console.log("📡 Sending terminate response:", formattedResponse);

            const apiResponse = await terminateResponse(userId, formattedResponse);

            if (!apiResponse || apiResponse.error) {
                console.error("❌ Error in terminateResponse API:", apiResponse.error);
                addToConversation(apiResponse.error || "Error processing termination request. Please try again.", true);
                return;
            }

            console.log("✅ Termination response processed:", apiResponse.data);

            addToConversation(responseOption, false);
            addToConversation(apiResponse.data.message, true);

            // 🟢 Only close the chat if the user selects "No"
            if (formattedResponse === "N") {
                setTimeout(() => {
                    setIsOpen(false);
                    setConversation([]);
                    setUserId(generateId());
                    console.log("✅ Chatbot session terminated.");
                }, 3000);
            }
        } catch (error) {
            console.error("❌ Error handling terminate response:", error.message);
            addToConversation("An unexpected error occurred. Please try again later.", true);
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
                    { text: 'Invalid name. Please enter alphabetic characters only.', isBot: true }
                ]);
                return;
            }
            updatedDetails.name = detail;
            setConversation((prev) => [
                ...prev,
                { text: detail, isBot: false, isUser: true },
                { text: 'Please provide your email address.', isBot: true }
            ]);
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Validate Email
            isValid = isValidEmail(detail);
            if (!isValid) {
                setConversation((prev) => [
                    ...prev,
                    { text: 'Invalid email. Please enter a valid email with @gmail.com or @test.com.', isBot: true }
                ]);
                return;
            }
            updatedDetails.email = detail;
            setConversation((prev) => [
                ...prev,
                { text: detail, isBot: false, isUser: true },
                { text: 'Please provide your phone number (without country code).', isBot: true }
            ]);
            setCurrentStep(3);

        } else if (currentStep === 3) {
            // Validate Phone Number
            isValid = isValidNumber(detail);
            if (!isValid) {
                setConversation((prev) => [
                    ...prev,
                    { text: 'Invalid phone number. Please enter a 10-digit number starting with 6-9.', isBot: true }
                ]);
                return;
            }
            updatedDetails.number = detail;
            setConversation((prev) => [
                ...prev,
                { text: detail, isBot: false, isUser: true }
            ]);
            try {
                const response = await submitUserDetails(userId, `${updatedDetails.name},${updatedDetails.number},${updatedDetails.email}`);
                if (response.error) {
                    console.error("❌ Error submitting details:", response.error);
                    setConversation((prev) => [...prev, { text: response.error.message || 'An error occurred.', isBot: true }]);
                    return;
                }
                setConversation((prev) => [
                    ...prev,
                    { text: currentQuery, isBot: false, isUser: true },
                    { text: "Thank you for providing your details. Your query has been registered.", isBot: true },
                    { text: "Request a Call Back?", isBot: true, options: ["Yes", "No"] }
                ]);
                setOptions([]);
                setCurrentStep(4);
            } catch (error) {
                console.error('Error sending user details:', error);
                setConversation((prev) => [
                    ...prev,
                    { text: error.message || 'An unexpected error occurred. Please try again later.', isBot: true }
                ]);
            }
        }
        setUserDetails(updatedDetails);
    };

    const handleSubmitCallbackPreference = async (preference) => {
        console.log("Submitting preference:", preference); // Debug API request

        try {
            // Ensure chatbot processes only "Yes" or "No"
            if (preference !== "Yes" && preference !== "No") {
                console.error("Invalid preference sent:", preference);
                return;
            }

            const response = await submitCallbackPreference(userId, preference);

            if (response?.data?.message) {
                setConversation(prev => [...prev, { text: response.data.message, isBot: true }]);

                setOptions([]);
                setConversation(prev => [
                    ...prev,
                    { text: "Please rate your experience with us.", isBot: true }
                ]);
                setCurrentStep(5); // Show rating UI

            } else {
                setConversation(prev => [...prev, { text: "Error submitting callback preference. Please try again.", isBot: true }]);
            }
        } catch (error) {
            console.error("Error submitting callback preference:", error);
            setConversation((prev) => [
                ...prev,
                { text: "Error submitting callback preference. Please try again later.", isBot: true }
            ]);
        }
    };

    // const handleSubmitCallbackPreference = async (preference) => {
    //     console.log("Submitting callback preference:", preference);

    //     try {
    //         if (preference !== "Yes" && preference !== "No") {
    //             console.error("Invalid preference:", preference);
    //             return;
    //         }

    //         // ✅ Immediately clear old options
    //         setOptions([]);

    //         const response = await submitCallbackPreference(userId, preference);

    //         if (response?.data?.message) {
    //             setConversation(prev => [
    //                 ...prev,
    //                 { text: response.data.message, isBot: true }
    //             ]);

    //             // ✅ Ensure only backend options are used
    //             if (response.data.options?.length) {
    //                 setOptions(response.data.options);
    //             } else {
    //                 setOptions([]); // Clear options if backend doesn't send them
    //             }

    //             setCurrentStep(5); // Move to rating step
    //         } else {
    //             setConversation(prev => [
    //                 ...prev,
    //                 { text: "Error processing your request. Please try again.", isBot: true }
    //             ]);
    //         }
    //     } catch (error) {
    //         console.error("❌ Error submitting callback preference:", error);
    //         setConversation(prev => [
    //             ...prev,
    //             { text: "Error submitting callback preference. Please try again later.", isBot: true }
    //         ]);
    //     }
    // };


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
                { text: `Ratings: ${visualStars} (${detail}/5)`, isBot: false, isUser: true }
            ]);

            setOptions([]); // Disable options after submission
            setIsRatingDisabled(true); // Disable the rating submission

            try {
                // Send satisfaction level to backend
                const response = await submitSatisfaction(userId, String(updatedReviewDetails.satisfactionLevel));

                if (response?.data?.message) {
                    setConversation((prev) => [
                        ...prev,
                        { text: response.data.message, isBot: true } // Backend message displayed
                    ]);
                }
            } catch (error) {
                console.error('Error submitting satisfaction:', error);
                setConversation((prev) => [
                    ...prev,
                    { text: "Error submitting satisfaction. Please try again later.", isBot: true }
                ]);
            }

            setUserSatisfaction(updatedReviewDetails);
            // ✅ Ask the user if they want to restart after submitting feedback
            // setTimeout(() => {
            //     addToConversation("Would you like to restart the chat?", true, ["Yes", "No"]);
            // }, 2000);

        }
    };
    const handleQuerySubmit = async () => {
        if (!currentQuery.trim() || isQueryDisabled) return;

        if (!userDetails.name || !userDetails.email || !userDetails.number) {
            setConversation((prev) => [
                ...prev,
                { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
                { text: "Please provide your name.", isBot: true }
            ]);
            setCurrentStep(1);
            return;
        }

        try {
            setIsQueryDisabled(true);

            const query = currentQuery.trim();

            setConversation((prev) => [
                ...prev,
                { text: query, isBot: false, isUser: true }
            ]);

            setConversation((prev) => [
                ...prev,
                { text: "Thank you for providing your details. Your query has been registered.", isBot: true }
            ]);

            setCurrentQuery("");

            const response = await submitQuery(userId, query);
            console.log("Response from submitQuery:", response);

        } catch (error) {
            console.error("Error submitting query:", error);
            setConversation((prev) => [
                ...prev,
                { text: "There was an error submitting your query. Please try again later.", isBot: true }
            ]);
        } finally {
            setIsQueryDisabled(false);
        }
    };

    const handleMicInput = async (formData) => {
        if (!userId) {
            console.error("❌ No user ID found! Audio query cannot be processed.");
            return;
        }

        try {
            const audioFile = formData.get("file");
            if (!audioFile) {
                console.error("❌ No audio file found in FormData.");
                return;
            }

            console.log("🎤 Sending audio file for transcription...");

            // Use `convertAudio` instead of `submitQuery`
            const response = await convertAudio(userId, audioFile);

            console.log("✅ Received Transcribed Text:", response);

            if (response && response.text) {
                setCurrentQuery(response.text); // Auto-fill transcribed text in input field
                await handleQuerySubmit(); // Auto-submit query
            } else {
                console.error("❌ No transcribed text received.");
            }
        } catch (error) {
            console.error("❌ Error processing audio:", error.response?.data || error.message);
        }
    };
    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-logo" onClick={toggleChatbot}>
                    💬
                </button>
            )}

            {isOpen && (
                <div className="chatbot-frame">
                    <ChatbotHeader handleClose={handleClose} />
                    <ChatbotConversation
                        conversation={conversation}
                        options={options}
                        conversationEndRef={conversationEndRef}
                        isTyping={isTyping}
                        handleOptionClick={handleOptionClick}
                        disabledOptions={disabledOptions}
                    />
                    {currentStep > 0 && currentStep <= 3 && (
                        <UserDetailsInput currentStep={currentStep} handleSubmitDetails={handleSubmitDetails} />
                    )}

                    {currentStep === 4 && <CallbackPreference handleSubmitCallbackPreference={handleSubmitCallbackPreference} />
                    }

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
                            userId={userId} // Ensure userID is being passed
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
