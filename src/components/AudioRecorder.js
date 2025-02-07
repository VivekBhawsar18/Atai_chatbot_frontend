import React from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { submitAudioQuery } from "../Services/ChatbotService"; // Ensure the path is correct

const AudioRecorder = ({ chatbotId }) => {
    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('user_id', chatbotId);
        formData.append('audio_file', file, 'recording.wav');

        try {
            const response = await submitAudioQuery(formData);
            console.log('File uploaded successfully:', response);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="audio-recorder-container">
            <h3>🎙️ Voice Input</h3>
            <ReactMediaRecorder
                audio
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <div>
                        <p><strong>Status:</strong> {status}</p>
                        <button className="audio-btn start" onClick={startRecording}>🎤 Start Recording</button>
                        <button className="audio-btn stop" onClick={stopRecording}>🛑 Stop Recording</button>
                        {mediaBlobUrl && <audio className="audio-player" src={mediaBlobUrl} controls />}
                        {mediaBlobUrl && (
                            <button className="audio-btn upload" onClick={() => {
                                fetch(mediaBlobUrl)
                                    .then(res => res.blob())
                                    .then(blob => {
                                        const audioFile = new File([blob], 'recording.wav', { type: 'audio/wav' });
                                        handleFileUpload(audioFile);
                                    });
                            }}>
                                ⬆️ Upload Recording
                            </button>
                        )}
                    </div>
                )}
            />
        </div>

    );
};

export default AudioRecorder;
