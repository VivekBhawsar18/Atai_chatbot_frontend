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

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => {
        return localStorage.getItem("chatbotMinimized") === "true";
    });
    const [userId, setUserId] = useState(() => {
        const storedId = localStorage.getItem("userId");
        return storedId || "";
    });
    const [options, setOptions] = useState([]);
    // const [conversation, setConversation] = useState([]);
    const [conversation, setConversation] = useState(() => {
        const storedConversation = localStorage.getItem("chatbotConversation");
        return storedConversation ? JSON.parse(storedConversation) : [];
    });

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
        localStorage.setItem("chatbotMinimized", isMinimized);
    }, [isMinimized]);

    useEffect(() => {
        localStorage.setItem("chatbotConversation", JSON.stringify(conversation));
    }, [conversation]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem("userId", userId);
        }
    }, [userId]);


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
        if (isMinimized) {
            setIsMinimized(false); //Restore chatbot from minimized state
            setIsOpen(true);
            return;
        }


        if (!isOpen) {
            let storedUserId = localStorage.getItem("userId");

            if (!storedUserId) {
                storedUserId = generateId();
                setUserId(storedUserId);
                localStorage.setItem("userId", storedUserId);
            }
            // const newId = generateId();
            // console.log(newId);
            // setuserId(newId);
            // localStorage.setItem("userId", newId);

            setOptions([]);
            setConversation([]);
            setDisabledOptions(new Set());
            setUserDetails({ name: '', number: '', email: '' });
            setUserSatisfaction({ review: '', satisfactionLevel: 0 });
            setCurrentStep(0);
            setCurrentSliderValue(5);
            setIsQueryDisabled(false);

            try {
                await initRecordingConversation(storedUserId);
                console.log("Conversation recording initialized");

                const response = await startChat(storedUserId);
                console.log("Start Chat Response:", response);

                const initialMessage = Array.isArray(response.data.message)
                    ? response.data.message.join(' ')
                    : response.data.message;
                setConversation(prev => [
                    ...prev,
                    { text: initialMessage, isBot: true }
                ]);

                const initialOptions = ["Our Services", "Book A Demo"];
                setOptions(initialOptions);
                setConversation(prev => [
                    ...prev,
                    { text: "Choose an option:", isBot: true, options: initialOptions }
                ]);
            } catch (error) {
                console.error("Error starting chatbot:", error);
                setConversation(prev => [
                    ...prev,
                    { text: 'Error starting the chatbot. Please try again later.', isBot: true }
                ]);
            }
            setIsOpen(true); // Open the chatbot
            setIsMinimized(false) //Restore if minimized
        } else {
            setIsOpen(false);
            console.log("Chatbot is already open.");
        }
    };

    const minimizeChatbot = () => {
        setIsMinimized(true);//Just hide the chatbot
        setIsOpen(false) //Keep the session active 
    };

    // const handleClose = async () => {
    //     try {
    //         const response = await terminateChat(userId);
    //         console.log("Terminate Chat Response:", response);
    //         setDisabledOptions(new Set());

    //         addToConversation(response.data.message, true, ['Y', 'N']);

    //         setConversation([]);
    //         setUserId("");
    //         localStorage.removeItem("userId"); // Clear stored user ID
    //         localStorage.removeItem("chatbotConversation"); // Clear chat history

    //         setIsOpen(false);
    //         setIsMinimized(false);

    //     } catch (error) {
    //         console.log('Error during termination', error);
    //         addToConversation('Error terminating the conversation. Please try again later.');
    //     }
    // };

    const handleClose = async () => {
        try {
            const response = await terminateChat(userId);
            console.log("Terminate Chat Response:", response);

            if (response?.data?.message) {
                const terminationMessage = response.data.message;

                // ✅ Check if message contains (Y/N) and extract options dynamically
                let options = [];
                if (terminationMessage.includes("(Y/N)")) {
                    options = ["Yes", "No"];
                }

                // ✅ Add the message & dynamically set options
                addToConversation(terminationMessage, true, options);
            } else {
                addToConversation("Error processing termination request. Please try again.", true);
            }

            // setCurrentStep(6); // ✅ Move to termination response step

        } catch (error) {
            console.log("Error during termination:", error);
            addToConversation("Error terminating the conversation. Please try again later.", true);
        }
    };

    // const handleOptionClick = async (option) => {
    //     try {
    //         console.log("Selected Option:", option);

    //         if (option === "Y" || option === "N") {
    //             await handleTerminateResponse(option);
    //             return;
    //         }

    //         setIsTyping(true);
    //         const response = await sendMessage(userId, option.trim());
    //         setIsTyping(false);
    //         console.log("🔥 API Response:", response);

    //         if (response?.error) {
    //             console.error("❌ Server Error:", response.error);
    //             setConversation((prev) => [
    //                 ...prev,
    //                 { text: "Invalid choice. Please select a valid option.", isBot: true, options: [] },
    //             ]);
    //             return;
    //         }

    //         // ✅ Remove previous options properly before setting new ones
    //         setOptions([]);

    //         // ✅ Handle "Our Services" selection
    //         if (option === "Our Services" && response.options?.length > 0) {
    //             console.log("📌 Received Service Options:", response.options);

    //             setConversation((prev) => [
    //                 ...prev.filter(msg => msg?.options && msg.options.length === 0), // ✅ Prevent undefined errors
    //                 { text: "Here are our services:", isBot: true },
    //                 { text: "Please select a service:", isBot: true, options: response.options },
    //             ]);

    //             setOptions(response.options);
    //             return;
    //         }

    //         // ✅ Handle "Book A Demo" selection
    //         if (option === "Book A Demo") {
    //             setConversation((prev) => [
    //                 ...prev.filter(msg => msg?.options && msg.options.length === 0), // ✅ Prevent undefined errors
    //                 { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
    //                 { text: "Please provide your name.", isBot: true },
    //             ]);
    //             setCurrentStep(1);
    //             return;
    //         }

    //         // ✅ Default case: Show backend message and options if available
    //         setConversation((prev) => [
    //             ...prev.filter(msg => msg?.options && msg.options.length === 0), // ✅ Prevent undefined errors
    //             { text: response.message, isBot: true, options: response.options || [] },
    //         ]);

    //         if (response.options?.length > 0) {
    //             setOptions(response.options);
    //         }

    //     } catch (error) {
    //         console.error("❌ Error handling option:", error);
    //     }
    // };



    const handleOptionClick = async (option) => {
        try {
            console.log("Selected Option:", option);

            if (option === "Y" || option === "N") {
                await handleTerminateResponse(option);
                return;
            }

            setIsTyping(true);
            const response = await sendMessage(userId, option.trim());
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

            // ✅ Clear previous options properly before setting new ones
            setOptions([]);
            await new Promise(resolve => setTimeout(resolve, 50)); // Ensure state update

            // ✅ Handle "Our Services" selection properly
            if (option === "Our Services" && response.options?.length > 0) {
                setOptions(response.options); // Ensure options are set only once
                setConversation((prev) => [
                    ...prev,
                    { text: "Here are our services:", isBot: true },
                    { text: "Please select a service:", isBot: true, options: response.options }, // Clickable options
                ]);
                return;
            }

            // ✅ Handle "Book A Demo" selection
            if (option === "Book A Demo") {
                setConversation((prev) => [
                    ...prev,
                    { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
                    { text: "Please provide your name.", isBot: true }, // ✅ First input request
                ]);
                setCurrentStep(1); // Move to details submission step
                return;
            }

            // ✅ Handle timeline prompt
            if (response.message === "When do you wish to start?") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true, options: response.options || [] },
                ]);
                setOptions(response.options);
                return;
            }

            // ✅ Handle user details prompt
            if (response.message === "Kindly provide your details to help us provide you the best service:") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true },
                    { text: "Please provide your name.", isBot: true }, // ✅ Start user details input immediately
                ]);
                setCurrentStep(1);
                return;
            }

            //Handle Callback preference prompt
            if (response.message === "Request a Call Back") {
                setConversation((prev) => [
                    ...prev,
                    { text: response.message, isBot: true },
                    { text: "", isBot: true, options: ["Yes", "No"] }
                ]);
                return;
            }
            // ✅ Default case: Show backend message and options if available
            setConversation((prev) => [
                ...prev,
                { text: response.message, isBot: true, options: response.options || [] },
            ]);

        } catch (error) {
            console.error("❌ Error handling option:", error);
        }
    };



    // const handleTerminateResponse = async (responseOption) => {
    //     try {
    //         if (!userId) {
    //             throw new Error("No active session to terminate.");
    //         }

    //         console.log("User termination response:", responseOption);

    //         // Call the backend to process the termination response
    //         const apiResponse = await terminateResponse(userId, responseOption);

    //         if (!apiResponse || !apiResponse.data) {
    //             throw new Error("No response from server.");
    //         }

    //         console.log("✅ Terminate Response API:", apiResponse.data);

    //         setConversation((prev) => [
    //             ...prev,
    //             { text: responseOption, isBot: false, isUser: true }, // User's response
    //             { text: apiResponse.data.message || "Unexpected response from server.", isBot: true }, // Backend response
    //         ]);

    //         // ✅ Auto-disable chatbot if termination message is received
    //         if (apiResponse.data.message.includes("Thank you for using our service")) {
    //             setTimeout(() => {
    //                 setIsOpen(false); // Close chatbot UI
    //                 setDisabledOptions(new Set()); // Disable options
    //                 setConversation([]); // Clear chat history
    //                 console.log("✅ Chatbot has been disabled.");
    //             }, 3000); // Delay for smooth transition
    //         }

    //     } catch (error) {
    //         console.error("❌ Error sending terminate response:", error.message);
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: error.message || "An unexpected error occurred. Please try again later.", isBot: true },
    //         ]);
    //     }
    // };

    const handleTerminateResponse = async (responseOption) => {
        try {
            if (!userId) {
                throw new Error("No active session to terminate.");
            }

            console.log("User selected termination response:", responseOption);

            // ✅ Send "Y" or "N" to the backend
            const apiResponse = await terminateResponse(userId, responseOption);

            if (!apiResponse || !apiResponse.data) {
                throw new Error("No response from server.");
            }

            console.log("✅ Termination Response API:", apiResponse.data);

            // ✅ Update chat with user's choice & bot's response
            setConversation((prev) => [
                ...prev,
                { text: responseOption, isBot: false, isUser: true }, // User's response ("Y" or "N")
                { text: apiResponse.data.message || "Unexpected response from server.", isBot: true }, // Backend response
            ]);

            // ✅ Remove previous options & prevent old buttons from appearing
            setDisabledOptions(new Set());

            // ✅ If termination is confirmed, close chatbot after 3s
            if (apiResponse.data.message.includes("Thank you for using our service")) {
                setTimeout(() => {
                    setIsOpen(false);
                    setConversation([]);
                    console.log("✅ Chatbot has been disabled.");
                }, 3000);
            }

        } catch (error) {
            console.error("❌ Error sending terminate response:", error.message);
            setConversation((prev) => [
                ...prev,
                { text: "An unexpected error occurred. Please try again later.", isBot: true },
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
                const response = await submitUserDetails(userId, `${updatedDetails.name},${updatedDetails.number},${updatedDetails.email}`);
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
                    { text: "Request a Call Back?", isBot: true, options: ["Yes", "No"] }

                ]);
                setOptions([]);
                setCurrentStep(4); // Move to callback preference step
            } catch (error) {
                console.error('Error sending user details:', error);
                setConversation((prev) => [
                    ...prev,
                    { text: error.message || 'An unexpected error occurred. Please try again later.', isBot: true },
                ]);
            }
        }
        setUserDetails(updatedDetails);
    };


    // const handleSubmitCallbackPreference = async (preference) => {
    //     try {
    //         await submitCallbackPreference(userId, preference);
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: 'Callback preference submitted successfully.', isBot: true, options: [] },
    //             { text: "Please give us a Ratings(*).", isBot: true },
    //         ]);
    //         setCurrentStep(5);
    //     } catch (error) {
    //         console.error('Error submitting callback preference:', error);
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: 'Error submitting callback preference. Please try again later.', isBot: true, options: [] },
    //         ]);
    //     }
    // };

    // const handleSubmitCallbackPreference = async (preference) => {
    //     try {
    //         const response = await submitCallbackPreference(userId, preference);

    //         if (response?.data?.message) {
    //             setConversation(prev => [...prev, { text: response.data.message, isBot: true }]);
    //             setOptions([]);
    //             setCurrentStep(5);
    //         } else {
    //             setConversation(prev => [...prev, { text: "Error submitting callback preference. Please try again.", isBot: true }]);
    //         }
    //     } catch (error) {
    //         console.error("Error submitting callback preference:", error);
    //         setConversation(prev => [...prev, { text: "Error submitting callback preference. Please try again.", isBot: true }]);
    //     }
    // };

    // const handleSubmitCallbackPreference = async (preference) => {
    //     try {

    //         // Send user preference (Yes/No) to the backend
    //         const response = await submitCallbackPreference(userId, preference);

    //         if (response?.data?.message) {
    //             // Update chat with user response
    //             setConversation(prev => [
    //                 ...prev,
    //                 { text: preference, isBot: false }, // User message
    //                 { text: response.data.message, isBot: true } // Bot response from API
    //             ]);

    //             // Remove the Yes/No options after selection
    //             setOptions([]);
    //             setCurrentStep(5);

    //         } else {
    //             // Handle case where no valid response is received from API
    //             setConversation(prev => [
    //                 ...prev,
    //                 { text: "⚠️ Error submitting callback preference. Please try again.", isBot: true }
    //             ]);
    //         }
    //     } catch (error) {
    //         console.error("❌ Error submitting callback preference:", error);

    //         setConversation(prev => [
    //             ...prev,
    //             { text: "⚠️ Network error. Please try again later.", isBot: true }
    //         ]);
    //     }
    // };

    // const handleSubmitCallbackPreference = async (preference) => {
    //     try {
    //         setOptions([]); // ✅ Clear buttons immediately
    //         const response = await submitCallbackPreference(userId, preference);

    //         if (response?.data?.message) {
    //             setConversation(prev => [...prev, { text: response.data.message, isBot: true }]);
    //         } else {
    //             setConversation(prev => [...prev, { text: "Error submitting callback preference. Please try again.", isBot: true }]);
    //         }
    //     } catch (error) {
    //         console.error("Error submitting callback preference:", error);
    //         setConversation(prev => [...prev, { text: "Error submitting callback preference. Please try again.", isBot: true }]);
    //     }
    // };

    const handleSubmitCallbackPreference = async (preference) => {
        console.log("Submitting preference:", preference); // ✅ Debug API request

        try {
            // ✅ Ensure chatbot processes only "Yes" or "No"
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
            setConversation(prev => [...prev, { text: "Error submitting callback preference. Please try again.", isBot: true }]);
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
            ]);

            setOptions([]); // Disable options after submission
            setIsRatingDisabled(true); // Disable the rating submission

            try {
                // Send satisfaction level to backend
                const response = await submitSatisfaction(userId, String(updatedReviewDetails.satisfactionLevel));

                if (response?.data?.message) {
                    setConversation((prev) => [
                        ...prev,
                        { text: response.data.message, isBot: true }, // ✅ Backend message displayed
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
        }
    };



    // const handleQuerySubmit = async () => {
    //     if (!currentQuery.trim() || isQueryDisabled) return;

    //     if (!userDetails.name || !userDetails.email || !userDetails.number) {
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: "Kindly provide your details to help us provide you the best service:", isBot: true },
    //             { text: "Please provide your name.", isBot: true },
    //         ]);
    //         setCurrentStep(1);
    //         return;
    //     }

    //     try {
    //         setIsQueryDisabled(true);

    //         if (currentQuery.trim()) {
    //             setConversation((prev) => [
    //                 ...prev,
    //                 { text: currentQuery, isBot: false, isUser: true },
    //             ]);
    //         }

    //         setConversation((prev) => [
    //             ...prev,
    //             { text: "Thank you for providing your details. Your query has been registered.", isBot: true },
    //         ]);

    //         setCurrentQuery("");
    //         const response = await submitQuery(userId, currentQuery);
    //         console.log(response);
    //     } catch (error) {
    //         console.error("Error submitting query:", error);
    //         setConversation((prev) => [
    //             ...prev,
    //             { text: "There was an error submitting your query. Please try again later.", isBot: true },
    //         ]);
    //     }
    // };

    const handleQuerySubmit = async () => {
        // Return early if there is no query text or if the query is disabled
        if (!currentQuery.trim() || isQueryDisabled) return;

        // Check if user details have been provided; if not, prompt for details
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

            // Store the current query text before clearing it
            const query = currentQuery.trim();

            // Add the user's query to the conversation display
            setConversation((prev) => [
                ...prev,
                { text: query, isBot: false, isUser: true },
            ]);

            // Notify the user that the query has been registered
            setConversation((prev) => [
                ...prev,
                { text: "Thank you for providing your details. Your query has been registered.", isBot: true },
            ]);

            // Clear the input field
            setCurrentQuery("");

            // Submit the query to your backend API
            const response = await submitQuery(userId, query);
            console.log("Response from submitQuery:", response);
        } catch (error) {
            console.error("Error submitting query:", error);
            setConversation((prev) => [
                ...prev,
                { text: "There was an error submitting your query. Please try again later.", isBot: true },
            ]);
        } finally {
            // Re-enable query submission regardless of success or error
            setIsQueryDisabled(false);
        }
    };



    // const handleOptionClick = async (option) => {
    //     try {
    //         console.log("Selected Option:", option);
    //         setDisabledOptions(new Set([...disabledOptions, option])); // Disable the clicked option

    //         const response = await sendMessage(userId, option);
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



    // const handleMicInput = async (formData) => {
    //     console.log("🔥 userId inside handleMicInput:", userId); // Debugging

    //     if (!userId) {
    //         console.error("❌ No user ID found! Audio query cannot be processed.");
    //         return;
    //     }
    //     try {
    //         const response = await submitQuery(userId, "", formData.get("file"));
    //         console.log("🎤 Received Transcribed Text:", response);

    //         if (response && response.text) {  // Ensure response contains valid text
    //             setCurrentQuery(response.text); // Auto-fill transcribed text in input field
    //             handleQuerySubmit(); // Auto-submit query
    //         } else {
    //             console.error("❌ No transcribed text received.");
    //         }
    //     } catch (error) {
    //         console.error("❌ Error processing audio:", error);
    //     }
    // };

    const handleMicInput = async (formData) => {
        // console.log("🔥 userId inside handleMicInput:", userId); // Debugging

        if (!userId) {
            console.error("❌ No user ID found! Audio query cannot be processed.");
            return;
        }

        try {
            // ✅ Ensure the correct key is used for the audio file
            const audioFile = formData.get("file");
            if (!audioFile) {
                console.error("❌ No audio file found in FormData.");
                return;
            }

            console.log("🎤 Sending audio file for transcription...");

            // ✅ Use `convertAudio` instead of `submitQuery`
            const response = await convertAudio(userId, audioFile);

            console.log("✅ Received Transcribed Text:", response);

            if (response && response.text) {
                setCurrentQuery(response.text); // ✅ Auto-fill transcribed text in input field
                handleQuerySubmit(); // ✅ Auto-submit query
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

            {isOpen && !isMinimized && (
                <div className="chatbot-frame">
                    <ChatbotHeader handleClose={handleClose} handleMinimize={minimizeChatbot} />
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

                    {currentStep === 4 && <CallbackPreference handleSubmitCallbackPreference={handleSubmitCallbackPreference} />}

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
                            userId={userId}  // ✅ Ensure userID is being passed


                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
