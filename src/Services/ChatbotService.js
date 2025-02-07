import axios from 'axios';

const apiBaseURL = 'https://chatbot-api-b1jc.onrender.com';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
    },
};

export const initRecordingConversation = async (userId) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/init_recording_conversation`, { user_id: userId }, axiosConfig);
        console.log("✅ Recording initialized:", response.data);
        console.log(response.data);
        return response;
    } catch (error) {
        console.error("❌ Error initializing recording:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const startChat = async (userId) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/start_chat`, { user_id: userId }, axiosConfig);
        console.log("✅ Start Chat API Response:", response.data);

        return response;
    } catch (error) {
        console.error("❌ Error starting chat:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const sendMessage = async (userId, message) => {
    try {
        console.log("Sending message:", message); // Debugging line
        const response = await axios.post(`${apiBaseURL}/chatbot/handle_chat`, { user_id: userId, message }, axiosConfig);
        console.log("✅ Message sent:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error sending message:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const submitUserDetails = async (userId, details) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_details`, { user_id: userId, message: details }, axiosConfig);
        console.log("✅ User details submitted:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error submitting details:", error.response?.data || error.message);

        return { error: error.response?.data || error.message };
        // return { error: error };
    }
};

export const submitCallbackPreference = async (userId, preference) => {
    if (!userId) {
        console.error("❌ User ID is missing. Cannot submit callback preference.");
        return { error: "User ID is required." };
    }
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_callback_preference`, { user_id: userId, message: preference }, axiosConfig);
        console.log("✅ Callback preference submitted:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error submitting callback preference:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const submitSatisfaction = async (userId, satisfaction) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_satisfaction`, { user_id: userId, message: satisfaction }, axiosConfig);
        console.log("✅ Satisfaction submitted:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error submitting satisfaction:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const terminateChat = async (chatbotId) => {
    if (!chatbotId) {
        console.error("❌ Chatbot ID is missing. Cannot terminate chat.");
        return { error: "Chatbot ID is required." };
    }
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/terminate`, { user_id: chatbotId }, axiosConfig);
        return response;
    } catch (error) {
        console.error('❌ Error terminating chat:', error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const handleTerminateResponse = async (userId, response) => {
    try {
        const apiResponse = await axios.post(`${apiBaseURL}/chatbot/terminate_response`, { user_id: userId, response }, axiosConfig);
        console.log("✅ Terminate Response API:", apiResponse.data);
        return apiResponse;
    } catch (error) {
        console.error("❌ Error sending terminate response:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const submitQuery = async (userId, query) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, { user_id: userId, user_query: query }, axiosConfig);
        console.log("✅ Query submitted:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error submitting query:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const submitAudioQuery = async (formData) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("✅ Audio query submitted:", response.data);
        return response;
    } catch (error) {
        console.error('Error submitting audio query:', error);
        return { error: error.response?.data || error.message };
    }
};












// import axios from 'axios';

// // const apiBaseURL = 'https://atchatbot.pythonanywhere.com';
// // const apiBaseURL = 'http://localhost:5000';
// const apiBaseURL = 'https://chatbot-api-b1jc.onrender.com/chatbot';

// const axiosConfig = {
//     headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*', // Allow all origins (development only)
//     },
// };

// /**
//  * Initializes recording for conversation
//  */
// export const initRecordingConversation = async (userId) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/init_recording_conversation`, { user_id: userId }, axiosConfig);
//         console.log("✅ Recording initialized:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error initializing recording:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Starts a chat session
//  */
// export const startChat = async (userId) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/start_chat`, { user_id: userId }, axiosConfig);
//         console.log("✅ Start Chat API Response:", response.data);
//         if (response?.data) {
//             return response.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error starting chat:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Sends a message
//  */
// export const sendMessage = async (userId, message) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/handle_chat`, { user_id: userId, message: message }, axiosConfig);
//         console.log("✅ Message sent:", response.data);
//         if (response?.data) {
//             return response.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error sending message:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Submits user details
//  */
// export const submitUserDetails = async (userId, details) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/submit_details`, { user_id: userId, message: details }, axiosConfig);
//         console.log("✅ User details submitted:", response.data);
//         if (response?.data) {
//             return response.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error submitting details:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Submits callback preference
//  */
// export const submitCallbackPreference = async (userId, preference) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/submit_callback_preference`, { user_id: userId, message: preference }, axiosConfig);
//         console.log("✅ Callback preference submitted:", response.data);
//         if (response?.data) {
//             return response.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error submitting callback preference:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Submits user satisfaction
//  */
// export const submitSatisfaction = async (userId, satisfaction) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/submit_satisfaction`, { user_id: userId, message: satisfaction }, axiosConfig);
//         console.log("✅ Satisfaction submitted:", response.data);
//         if (response?.data) {
//             return response.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error submitting satisfaction:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Terminates chat session
//  */
// // export const terminateChat = async (chatbotId) => {
// //     try {
// //         const response = await axios.post(`${apiBaseURL}/terminate`, { user_id: chatbotId }, axiosConfig);
// //         console.log("✅ Termination Response:", response.data);
// //         if (response?.data) {
// //             return response.data;
// //         }
// //         throw new Error("Invalid response structure");
// //     } catch (error) {
// //         console.error("❌ Error terminating chat:", error.response?.data || error.message);
// //         return { error: error.response?.data || error.message };
// //     }
// // };

// export const terminateChat = async (chatbotId) => {
//     try {
//         const response = await axios.post(`https://chatbot-api-b1jc.onrender.com/chatbot/terminate`, { user_id: chatbotId });
//         return response.data;
//     } catch (error) {
//         console.error('❌ Error terminating chat:', error);
//         throw error;
//     }
// };


// /**
//  * Handles terminate chat response (Y/N)
//  */
// export const handleTerminateResponse = async (userId, response) => {
//     try {
//         const apiResponse = await axios.post(`${apiBaseURL}/terminate_response`, { user_id: userId, response }, axiosConfig);
//         console.log("✅ Terminate Response API:", apiResponse.data);

//         if (apiResponse?.data) {
//             return apiResponse.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error sending terminate response:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// /**
//  * Submits user query
//  */
// export const submitQuery = async (userId, query) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/submit_query`, { user_id: userId, user_query: query }, axiosConfig);
//         console.log("✅ Query submitted:", response.data);
//         if (response?.data) {
//             return response.data;
//         }
//         throw new Error("Invalid response structure");
//     } catch (error) {
//         console.error("❌ Error submitting query:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const submitAudioQuery = async (formData) => {
//     try {
//         const response = await axios.post(`https://chatbot-api-b1jc.onrender.com/chatbot/submit_query`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error submitting audio query:', error);
//         throw error;
//     }
// };




// // export const submitAudioQuery = async (chatbotId, audioFile) => {
// //     const formData = new FormData();
// //     formData.append("user_id", chatbotId);
// //     formData.append("audio_file", audioFile);

// //     try {
// //         const response = await axios.post(`${apiBaseURL}/submit_query`, {
// //             method: "POST",
// //             body: formData,
// //         });

// //         const data = await response.json();
// //         if (!response.ok) {
// //             throw new Error(data.message || "Failed to submit audio query");
// //         }

// //         return data;
// //     } catch (error) {
// //         console.error("Error submitting audio query:", error);
// //         throw error;
// //     }
// // };


// /**
//  * Uploads audio file as user query
//  */
// // export const submitAudioQuery = async (formData) => {
// //     try {
// //         const response = await axios.post(`${apiBaseURL}/submit_audio_query`, formData, {
// //             headers: {
// //                 'Content-Type': 'multipart/form-data',
// //             },
// //         });
// //         console.log("✅ Audio query submitted:", response.data);
// //         if (response?.data) {
// //             return response.data;
// //         }
// //         throw new Error("Invalid response structure");
// //     } catch (error) {
// //         console.error("❌ Error submitting audio query:", error.response?.data || error.message);
// //         return { error: error.response?.data || error.message };
// //     }
// // };
