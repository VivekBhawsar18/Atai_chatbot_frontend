import React, { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { submitAudioQuery } from "../Services/ChatbotService"; // Connect to API

const MicButton = ({ chatbotId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const handleStop = (blobUrl, blob) => {
        setAudioBlob(blob);
    };

    const handleSendAudio = async () => {
        if (!audioBlob) return;

        const formData = new FormData();
        formData.append("file", audioBlob, "audio.wav");

        const response = await submitAudioQuery(formData);
        console.log("🎙️ Audio Transcription:", response.text);
    };

    return (
        <ReactMediaRecorder
            audio
            onStop={handleStop}
            render={({ startRecording, stopRecording }) => (
                <div className="mic-container">
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
                        🎤
                    </button>
                    {audioBlob && (
                        <button onClick={handleSendAudio} className="send-audio-button">
                            🚀 Send
                        </button>
                    )}
                </div>
            )}
        />
    );
};

export default MicButton;
