import React, { useRef, useState, useEffect } from 'react';
import { useRecordVoice } from "@/components/useRecordVoice";
import { Mic } from "lucide-react";
import { Button } from "./button";

interface MicrophoneProps {
    onVoiceSubmit: (text: string) => void;
}

const Microphone: React.FC<MicrophoneProps> = ({ onVoiceSubmit }) => {
    const { startRecording, stopRecording, text, resetText } = useRecordVoice();
    const isRecordingRef = useRef(false);

    const handleStartRecording = () => {
        isRecordingRef.current = true;
        startRecording();
    };

    const handleStopRecording = () => {
        isRecordingRef.current = false;
        stopRecording();
    };

    useEffect(() => {
        if (!isRecordingRef.current && text) {
            onVoiceSubmit(text);
            resetText(); // Assuming your hook provides a way to reset the text
        }
    }, [text, onVoiceSubmit, resetText]);
    return (
        <div className="flex flex-col justify-center items-center">
            <Button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                variant="outline"
            >
                <Mic />
            </Button>
        </div>
    );
};

export { Microphone };
