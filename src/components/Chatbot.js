import React, { useState, useEffect, useRef } from "react";
import {
    initRecordingConversation,
    startChat,
    sendMessage,
    submitUserDetails,
    submitCallbackPreference,
    submitSatisfaction,
    terminateChat,
    handleTerminateResponse as terminateResponse,
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

    const handleSubmitDetails = async (detail) => {
        let updatedDetails = { ...userDetails };

        if (currentStep === 1) {
            if (!isValidName(detail)) {
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
            if (!isValidEmail(detail)) {
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
            if (!isValidNumber(detail)) {
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
                const response = await submitUserDetails(chatbotId, updatedDetails);
                if (response.error) {
                    console.error("❌ Error submitting details:", response.error);
                    setConversation((prev) => [...prev, { text: response.error.message || 'An error occurred.', isBot: true }]);
                    return;
                }
                setConversation((prev) => [
                    ...prev,
                    { text: "Thank you for providing your details. Your query has been registered.", isBot: true },
                ]);
                setOptions([]);
                setCurrentStep(4);
            } catch (error) {
                console.error('Error sending user details:', error);
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
    //         console.log("User selected option:", option);

    //         if (["Y", "N"].includes(option)) {
    //             setDisabledOptions(new Set(["Yes", "No"]));
    //             const response = await terminateResponse(chatbotId, option);
    //             console.log("Terminate Response:", response);

    //             setConversation(prev => [...prev, { text: response, isBot: true }]);
    //             if (option === "N") setTimeout(() => setIsOpen(false), 2000);
    //             return;
    //         }

    //         setConversation(prev => [...prev, { text: option, isUser: true }]);
    //         setDisabledOptions(prev => new Set([...prev, ...(options || [])]));

    //         const response = await sendMessage(chatbotId, option);
    //         console.log("Handle Option Click Response:", response);

    //         if (response?.data?.options?.length > 0) {
    //             setConversation(prev => [
    //                 ...prev,
    //                 { text: response.data.message || "Please Choose an option:", isBot: true, options: response.data.options || [] }
    //             ]);
    //             setOptions(response.data.options);
    //         } else if (response.data?.message?.includes("Kindly provide your details")) {
    //             setConversation(prev => [
    //                 ...prev,
    //                 { text: response.data.message, isBot: true },
    //                 { text: "Please provide your name.", isBot: true }
    //             ]);
    //             setCurrentStep(1);
    //         } else {
    //             console.error("Invalid response received:", response);
    //             setConversation(prev => [...prev, { text: response.data?.message || "Unexpected response from server.", isBot: true }]);
    //         }
    //     } catch (error) {
    //         console.error("Error sending message:", error);
    //         setConversation(prev => [...prev, { text: "An error occurred. Please try again later.", isBot: true }]);
    //     }
    // };
    // 

    const handleOptionClick = async (option) => {
        try {
            console.log("User selected option:", option);

            if (["Y", "N"].includes(option)) {
                setDisabledOptions(new Set(["Yes", "No"]));
                const response = await terminateResponse(chatbotId, option);
                console.log("Terminate Response:", response);

                setConversation(prev => [...prev, { text: response.data.message, isBot: true }]);
                if (option === "N") setTimeout(() => setIsOpen(false), 2000);
                return;
            }

            setConversation(prev => [...prev, { text: option, isUser: true }]);
            setDisabledOptions(prev => new Set([...prev, ...(options || [])]));

            const response = await sendMessage(chatbotId, option);
            console.log("Handle Option Click Response:", response);

            if (response && response.data) {
                const { message, options } = response.data;

                if (options && options.length > 0) {
                    setConversation(prev => [
                        ...prev,
                        { text: message || "Please Choose an option:", isBot: true, options }
                    ]);
                    setOptions(options);
                } else if (message && message.includes("Kindly provide your details")) {
                    setConversation(prev => [
                        ...prev,
                        { text: message, isBot: true },
                        { text: "Please provide your name.", isBot: true }
                    ]);
                    setCurrentStep(1);
                } else {
                    console.error("Unexpected response:", response.data);
                    setConversation(prev => [
                        ...prev,
                        { text: message || "Unexpected response from server.", isBot: true }
                    ]);
                }
            } else {
                console.error("No data in response:", response);
                setConversation(prev => [
                    ...prev,
                    { text: "Unexpected response from server.", isBot: true }
                ]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setConversation(prev => [
                ...prev,
                { text: "An error occurred. Please try again later.", isBot: true }
            ]);
        }
    };

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
