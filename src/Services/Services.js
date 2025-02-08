import axios from 'axios';

const apiUrl = 'https://chatbot-api-b1jc.onrender.com';

export const initRecordingConversation = async (userId) => {
    return await axios.post(`${apiUrl}/chatbot/init_recording_conversation`, { user_id: userId });
};

export const startChat = async (userId) => {
    return await axios.post(`${apiUrl}/chatbot/start_chat`, { user_id: userId });
};

export const sendMessage = async (userId, message) => {
    return await axios.post(`${apiUrl}/chatbot/handle_chat`, { user_id: userId, message });
};

export const submitUserDetails = async (userId, details) => {
    return await axios.post(`${apiUrl}/chatbot/submit_details`, { user_id: userId, message: details });
};

export const submitCallbackPreference = async (userId, preference) => {
    return await axios.post(`${apiUrl}/chatbot/submit_callback_preference`, { user_id: userId, message: preference });
};

export const submitSatisfaction = async (userId, satisfactionLevel) => {
    return await axios.post(`${apiUrl}/chatbot/submit_satisfaction`, { user_id: userId, message: satisfactionLevel });
};

export const terminateChat = async (userId) => {
    return await axios.post(`${apiUrl}/chatbot/terminate`, { user_id: userId });
};

export const handleTerminateResponse = async (userId, response) => {
    return await axios.post(`${apiUrl}/chatbot/terminate_response`, { user_id: userId, response });
};

export const submitQuery = async (userId, query) => {
    return await axios.post(`${apiUrl}/chatbot/submit_query`, { user_id: userId, user_query: query });
};
