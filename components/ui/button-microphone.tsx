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
        if (text) {
            onVoiceSubmit(text);
            resetText();
        }
    }, [text, onVoiceSubmit]);
    return (
        <div className="flex flex-col justify-center items-center">
            <Button
                onMouseDown={handleStartRecording}
                onMouseUp={handleStopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={handleStopRecording}
                variant="outline"
                className="active:bg-red-500"
            >
                <svg
                    width="30px"
                    height="30px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="currentcolor">
                    <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentcolor" stroke-width="1.5" >
                    </rect>
                    <path d="M5 10V11C5 14.866 8.13401 18 12 18V18V18C15.866 18 19 14.866 19 11V10" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    </path>
                    <path d="M12 18V22M12 22H9M12 22H15" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    </path>
                </svg>

            </Button>
        </div>
    );
};

export { Microphone };
