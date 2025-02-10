import axios from 'axios';


// Define the base URL for your API
const apiBaseURL = 'https://chatbot-api-b1jc.onrender.com'; // Ensure this is the correct URL for your deployed backend

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

        console.log("✅ Message sent:", response);
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
        return response.data;
    } catch (error) {
        console.error("❌ Error submitting details:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


// export const submitUserDetails = async (userId, details) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_details`, { user_id: userId, ...details }, axiosConfig);
//         console.log("✅ User details submitted:", response);
//         return response;
//     } catch (error) {
//         console.error("❌ Error submitting details:", error.response?.data || error.message);

//         return { error: error.response?.data || error.message };
//         // return { error: error };
//     }
// };

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
    if (!userId) {
        console.error("❌ Chatbot ID is missing. Cannot terminate chat.");
        return { error: "Chatbot ID is required." };
    }
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
        const response = await axios.post(`${apiBaseURL}/chatbot/terminate_response`, { user_id: userId, response: responseOption }, axiosConfig);
        console.log("✅ Terminate Response API:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error sending terminate response:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

// Function to submit a query
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

// Function to send audio to backend
export const submitAudioQuery = async (audioData) => {
    try {
        const response = await axios.post(`${apiBaseURL}/chatbot/convert_audio`, audioData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;  // Returns transcribed text
    } catch (error) {
        console.error("Error converting audio:", error);
        return { error: "Failed to process audio" };
    }
};



// import axios from 'axios';

// const apiBaseURL = 'https://chatbot-api-b1jc.onrender.com';

// const axiosConfig = {
//     headers: {
//         'Content-Type': 'application/json',
//         // 'Access-Control-Allow-Origin': '*',
//     },
// };

// export const initRecordingConversation = async (userId) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/init_recording_conversation`, { user_id: userId }, axiosConfig);
//         console.log("✅ Recording initialized:", response.data);
//         console.log(response.data);
//         return response;
//     } catch (error) {
//         console.error("❌ Error initializing recording:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const startChat = async (userId) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/start_chat`, { user_id: userId }, axiosConfig);
//         console.log("✅ Start Chat API Response:", response.data);

//         return response;
//     } catch (error) {
//         console.error("❌ Error starting chat:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const sendMessage = async (userId, message) => {
//     try {
//         console.log("Sending message:", { user_id: userId, message }); // Debugging line
//         const response = await axios.post(`${apiBaseURL}/chatbot/handle_chat`, { user_id: userId, message: message }, axiosConfig);
//         console.log("✅ Message sent:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("❌ Error sending message:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const submitUserDetails = async (userId, details) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_details`,
//             {
//                 user_id: userId,
//                 message: `${details.name},${details.number},${details.email}`
//             },
//             axiosConfig
//         );
//         console.log("✅ User details submitted:", response.data);
//         return response;
//     } catch (error) {
//         console.error("❌ Error submitting details:", error.response?.data || error.message);

//         return { error: error.response?.data || error.message };
//         // return { error: error };
//     }
// };

// export const submitCallbackPreference = async (userId, preference) => {
//     if (!userId) {
//         console.error("❌ User ID is missing. Cannot submit callback preference.");
//         return { error: "User ID is required." };
//     }
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_callback_preference`, { user_id: userId, message: preference }, axiosConfig);
//         console.log("✅ Callback preference submitted:", response.data);
//         return response;
//     } catch (error) {
//         console.error("❌ Error submitting callback preference:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const submitSatisfaction = async (userId, satisfaction) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_satisfaction`, { user_id: userId, message: satisfaction }, axiosConfig);
//         console.log("✅ Satisfaction submitted:", response.data);
//         return response;
//     } catch (error) {
//         console.error("❌ Error submitting satisfaction:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const terminateChat = async (userId) => {
//     if (!userId) {
//         console.error("❌ Chatbot ID is missing. Cannot terminate chat.");
//         return { error: "Chatbot ID is required." };
//     }
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/terminate`, { user_id: userId }, axiosConfig);
//         return response;
//     } catch (error) {
//         console.error('❌ Error terminating chat:', error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const handleTerminateResponse = async (userId, responseOption) => {
//     try {
//         const apiResponse = await axios.post(`${apiBaseURL}/chatbot/terminate_response`, { user_id: userId, response: responseOption }, axiosConfig);
//         console.log("✅ Terminate Response API:", apiResponse.data);
//         return apiResponse;
//     } catch (error) {
//         console.error("❌ Error sending terminate response:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const submitQuery = async (userId, query) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, { user_id: userId, user_query: query }, axiosConfig);
//         console.log("✅ Query submitted:", response.data);
//         return response;
//     } catch (error) {
//         console.error("❌ Error submitting query:", error.response?.data || error.message);
//         return { error: error.response?.data || error.message };
//     }
// };

// export const submitAudioQuery = async (formData) => {
//     try {
//         const response = await axios.post(`${apiBaseURL}/chatbot/submit_query`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         console.log("✅ Audio query submitted:", response.data);
//         return response;
//     } catch (error) {
//         console.error('Error submitting audio query:', error);
//         return { error: error.response?.data || error.message };
//     }
// };