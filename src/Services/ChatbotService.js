import axios from 'axios';


const apiBaseURL = 'https://chatbot-api-b1jc.onrender.com';
// const apiBaseURL = 'http://127.0.0.1:5000';

// Axios configuration for default headers
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },

};

// Function to initialize the conversation recording
export const initRecordingConversation = async (userId) => {
    try {

        const response = await axios.post(`${apiBaseURL}/chatbot/init_recording_conversation`, { user_id: userId }, axiosConfig);
        console.log("✅ Recording initialized:", response);
        return response;
    } catch (error) {
        console.error("❌ Error initializing recording:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

// Function to start the chat
export const startChat = async (userId) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/start_chat`, { user_id: userId }, axiosConfig);
        console.log("✅ Start Chat API Response:", response);
        return response;
    } catch (error) {
        console.error("❌ Error starting chat:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

// Function to send a message
export const sendMessage = async (userId, message) => {

    try {
        console.log("Sending message:", { user_id: userId, message });
        const response = await axios.post(`${apiBaseURL}/chatbot/handle_chat`, { user_id: userId, message: message.trim(), }, axiosConfig);

        console.log("✅ Message sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error sending message:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

//Function to submit user details


export const submitUserDetails = async (userId, details) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('message', details);

    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_details`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("✅ User details submitted:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error submitting details:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};



// Function to submit callback preference
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

// Function to submit user satisfaction

export const submitSatisfaction = async (userId, satisfaction) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/submit_satisfaction`, { user_id: userId, message: String(satisfaction) }, axiosConfig);
        console.log("✅ Satisfaction submitted:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error submitting satisfaction:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


// export const submitSatisfaction = async (user_id, satisfactionData) => {
//     try {
//         const response = await axios.post('${apiBaseURL}/chatbot/submit_satisfaction', satisfactionData);

//         console.log("✅ Satisfaction submitted:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error submitting satisfaction:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };



// Function to terminate the chat
export const terminateChat = async (userId) => {

    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/terminate`, { user_id: userId }, axiosConfig);
        return response;
    } catch (error) {
        console.error('❌ Error terminating chat:', error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

// Function to handle the terminate response
export const terminateResponse = async (userId, responseOption) => {
    try {
        if (!userId) throw new Error("❌ User ID is required for termination response.");


        const response = await axios.post(`${apiBaseURL}/chatbot/terminate_response`, { user_id: userId, response: responseOption }, axiosConfig);
        console.log("✅ Terminate Response API:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error sending terminate response:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


// export const submitQuery = async (userId, query, formData) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 "user_id": userId
//             },
//         });

//         console.log("Response from submitQuery:", response);
//         return response.data;
//     } catch (error) {
//         console.error("Error submitting query:", error);
//         throw error;
//     }
// };


// export const submitQuery = async (userId, query = "", audioFile = null) => {
//     try {
//         const formData = new FormData();
//         formData.append("user_id", userId);
//         formData.append("user_query", query || ""); // Ensure query is always sent

//         if (audioFile) {
//             formData.append("audio_file", audioFile, "audio.wav"); // Send audio if available
//         }

//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, formData, {
//             headers: { "Accept": "application/json" }, // No need to set Content-Type
//         });

//         console.log("✅ Query submitted successfully:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error submitting query:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

export const submitQuery = async (userId, query = "", audioFile = null) => {
    try {
        if (!userId) throw new Error("❌ User ID is required"); // Ensure user_id exists

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("user_query", query || ""); // Ensure query is always sent

        if (audioFile) {
            formData.append("file", audioFile, "audio.wav"); // Ensure correct format
        }
        console.log("🚀 Sending request to API with userId:", userId);

        const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, formData, {
            headers: { "Accept": "application/json" }, // Do not manually set Content-Type
        });

        console.log("✅ Query submitted successfully:", response);
        return response;
    } catch (error) {
        console.error("❌ Error submitting query:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const convertAudio = async (userId, audioFile) => {
    try {
        if (!userId) throw new Error("❌ User ID is required");
        if (!audioFile) throw new Error("❌ Audio file is required");

        const formData = new FormData();
        formData.append("user_id", userId);  // ✅ Send user ID
        formData.append("file", audioFile, "audio.wav");  // ✅ Send audio file

        console.log("🎤 Sending audio file for conversion...");

        const response = await axios.post(`${apiBaseURL}/convert_audio`, formData, {
            headers: { "Accept": "application/json" },  // Don't set Content-Type manually
        });

        console.log("✅ Transcribed Text:", response);
        return response;
    } catch (error) {
        console.error("❌ Error converting audio:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


// import axios from "axios";

// const apiBaseURL = "https://chatbot-api-b1jc.onrender.com";

// // ✅ Create a reusable Axios instance with timeout
// const axiosInstance = axios.create({
//     baseURL: apiBaseURL,
//     timeout: 15000, // 15 seconds timeout
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // ✅ Helper function to handle errors
// const handleApiError = (error, functionName) => {
//     const errorMessage = error.response?.data || error.message;
//     console.error(`❌ Error in ${functionName}:`, errorMessage);
//     return { error: errorMessage };
// };

// // ✅ Function to initialize conversation recording
// export const initRecordingConversation = async (userId) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         const response = await axiosInstance.post("/chatbot/init_recording_conversation", {
//             user_id: userId
//         });

//         console.log("✅ Recording initialized:", response.data);
//         return response;
//     } catch (error) {
//         return handleApiError(error, "initRecordingConversation");
//     }
// };

// // ✅ Function to start the chat
// export const startChat = async (userId) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         const response = await axiosInstance.post("/chatbot/start_chat", { user_id: userId });

//         console.log("✅ Start Chat API Response:", response.data);
//         return response;
//     } catch (error) {
//         return handleApiError(error, "startChat");
//     }
// };



// // ✅ Function to send a message
// export const sendMessage = async (userId, message) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         console.log("🚀 Sending message:", { user_id: userId, message });
//         const response = await axiosInstance.post("/chatbot/handle_chat", {
//             user_id: userId,
//             message: message.trim(),
//         });

//         console.log("✅ Message sent:", response.data);
//         return response;
//     } catch (error) {
//         return handleApiError(error, "sendMessage");
//     }
// };

// // ✅ Function to submit user details
// export const submitUserDetails = async (userId, details) => {
//     if (!userId) return { error: "User ID is required." };

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("message", details);

//     try {
//         const response = await axiosInstance.post("/chatbot/submit_details", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });

//         console.log("✅ User details submitted:", response.data);
//         return response;
//     } catch (error) {
//         return handleApiError(error, "submitUserDetails");
//     }
// };

// // ✅ Function to submit callback preference
// export const submitCallbackPreference = async (userId, preference) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         const response = await axiosInstance.post("/chatbot/submit_callback_preference", {
//             user_id: userId,
//             message: preference,
//         });

//         console.log("✅ Callback preference submitted:", response.data);
//         return response.data;
//     } catch (error) {
//         return handleApiError(error, "submitCallbackPreference");
//     }
// };

// // ✅ Function to submit user satisfaction
// export const submitSatisfaction = async (userId, satisfaction) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         const response = await axiosInstance.post("/chatbot/submit_satisfaction", {
//             user_id: userId,
//             message: String(satisfaction),
//         });

//         console.log("✅ Satisfaction submitted:", response.data);
//         return response.data;
//     } catch (error) {
//         return handleApiError(error, "submitSatisfaction");
//     }
// };

// // ✅ Function to terminate the chat
// export const terminateChat = async (userId) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         const response = await axiosInstance.post("/chatbot/terminate", { user_id: userId });
//         return response.data;
//     } catch (error) {
//         return handleApiError(error, "terminateChat");
//     }
// };

// // ✅ Function to handle terminate response
// export const terminateResponse = async (userId, responseOption) => {
//     if (!userId) return { error: "User ID is required." };

//     try {
//         const response = await axiosInstance.post("/chatbot/terminate_response", {
//             user_id: userId,
//             response: responseOption,
//         });

//         console.log("✅ Terminate Response API:", response.data);
//         return response.data;
//     } catch (error) {
//         return handleApiError(error, "terminateResponse");
//     }
// };

// // ✅ Function to submit a query
// export const submitQuery = async (userId, query = "", audioFile = null) => {
//     if (!userId) return { error: "User ID is required." };

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("user_query", query || "");

//     if (audioFile) {
//         formData.append("file", audioFile, "audio.wav");
//     }

//     try {
//         console.log("🚀 Sending query for user:", userId);
//         const response = await axiosInstance.post("/chatbot/submit_query", formData, {
//             headers: { "Accept": "application/json" },
//         });

//         console.log("✅ Query submitted successfully:", response.data);
//         return response.data;
//     } catch (error) {
//         return handleApiError(error, "submitQuery");
//     }
// };

// // ✅ Function to convert audio to text
// export const convertAudio = async (userId, audioFile) => {
//     if (!userId) return { error: "User ID is required." };
//     if (!audioFile) return { error: "Audio file is required." };

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("file", audioFile, "audio.wav");

//     try {
//         console.log("🎤 Sending audio file for conversion...");
//         const response = await axiosInstance.post("/convert_audio", formData, {
//             headers: { "Accept": "application/json" },
//         });

//         console.log("✅ Transcribed Text:", response.data);
//         return response.data;
//     } catch (error) {
//         return handleApiError(error, "convertAudio");
//     }
// };
