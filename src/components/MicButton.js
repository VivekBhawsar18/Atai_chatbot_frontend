import React, { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { convertAudio } from "../Services/ChatbotService";

const MicButton = ({ userId, setCurrentQuery }) => {
    const [isRecording, setIsRecording] = useState(false);

    console.log("🔥 userId in MicButton.js:", userId); // ✅ Debugging

    const handleStop = async (blobUrl, blob) => {
        console.log("🎤 Recording Stopped. Sending audio...");

        if (!userId) {
            console.error("❌ No chatbot session found.");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", userId);  // ✅ Send user_id
        formData.append("file", blob, "audio.wav");

        try {
            const response = await convertAudio(userId, blob);
            console.log("✅ Received Transcribed Text:", response);

            if (response && response.text) {
                setCurrentQuery(response.text); // ✅ Auto-fill transcribed text
            } else {
                console.error("❌ No transcribed text received.");
            }
        } catch (error) {
            console.error("❌ Error processing audio:", error.response?.data || error.message);
        }
    };

    return (
        <ReactMediaRecorder
            audio
            onStop={handleStop}
            render={({ startRecording, stopRecording }) => (
                <button
                    className={`mic-button ${isRecording ? "recording" : ""}`}
                    onMouseDown={() => {
                        setIsRecording(true);
                        startRecording();
                    }}
                    onMouseUp={() => {
                        setIsRecording(false);
                        stopRecording();
                    }}
                >
                    <i className="fa fa-microphone" aria-hidden="true"></i>
                </button>
            )}
        />
    );
};

export default MicButton;

// import React, { useState } from "react";
// import { ReactMediaRecorder } from "react-media-recorder";
// import { convertAudio } from "../Services/ChatbotService";

// const MicButton = ({ userId, setCurrentQuery }) => {
//     const [isRecording, setIsRecording] = useState(false);

//     // console.log("🔥 userId in MicButton.js:", userId); // ✅ Debugging

//     const handleStop = async (blobUrl, blob) => {
//         // console.log("🎤 Recording Stopped. Sending audio...");

//         if (!userId) {
//             console.error("❌ No chatbot session found.");
//             return;
//         }

//         try {
//             const response = await convertAudio(userId, blob);
//             console.log("✅ Received Transcribed Text:", response);

//             if (response && response.text) {
//                 setCurrentQuery(response.text); // ✅ Auto-fill transcribed text
//             } else {
//                 console.error("❌ No transcribed text received.");
//             }
//         } catch (error) {
//             console.error("❌ Error processing audio:", error.response?.data || error.message);
//         }
//     };

//     return (
//         <ReactMediaRecorder
//             audio
//             onStop={handleStop}
//             render={({ startRecording, stopRecording }) => (
//                 <button
//                     className={`mic-button ${isRecording ? "recording" : ""}`}
//                     onMouseDown={() => {
//                         setIsRecording(true);
//                         startRecording();
//                     }}
//                     onMouseUp={() => {
//                         setIsRecording(false);
//                         stopRecording();
//                     }}
//                 >
//                     <i className="fa fa-microphone" aria-hidden="true"></i>
//                 </button>
//             )}
//         />
//     );
// };

// export default MicButton;
