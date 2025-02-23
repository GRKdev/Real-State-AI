import React, { useRef, useState, useEffect } from 'react';
import { useRecordVoice } from "@/components/useRecordVoice";
import { Button } from "./button";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuth } from '@clerk/clerk-react';
import { useDictionary } from '@/hooks/useDictionary';


interface MicrophoneProps {
    onVoiceSubmit: (text: string) => void;
}

const Microphone: React.FC<MicrophoneProps> = ({ onVoiceSubmit }) => {
    const { start, stop, text, resetText } = useRecordVoice();
    const [isRecording, setIsRecording] = useState(false);
    const recordingTimeoutRef = useRef<number | null>(null);
    const { isSignedIn } = useAuth();
    const filtersDict = useDictionary('filters');

    useEffect(() => {
    }, [isSignedIn]);

    const toggleRecording = () => {
        if (!isSignedIn) return;

        setIsRecording(current => {
            if (!current) {
                start();
                if (recordingTimeoutRef.current !== null) {
                    clearTimeout(recordingTimeoutRef.current);
                }
                recordingTimeoutRef.current = window.setTimeout(() => {
                    stop();
                    setIsRecording(false);
                }, 15000);
                return true;
            } else {
                stop();
                if (recordingTimeoutRef.current !== null) {
                    clearTimeout(recordingTimeoutRef.current);
                    recordingTimeoutRef.current = null;
                }
                return false;
            }
        });
    };

    useEffect(() => {
        if (text) {
            onVoiceSubmit(text);
            resetText();
        }
    }, [text, onVoiceSubmit]);

    useEffect(() => {
        return () => {
            if (recordingTimeoutRef.current !== null) {
                clearTimeout(recordingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col justify-center items-center pl-2">
            <div className="tooltip-container">
                {!isSignedIn && <Tooltip message={filtersDict?.microphone ?? 'Sign in to use microphone'}>{null}</Tooltip>}
                <Button
                    onClick={toggleRecording}
                    variant="outline"
                    className={`active:bg-red-500 ${isRecording ? 'bg-red-500 hover:bg-red-500 animate-pulse' : ''}`}
                    style={isRecording ? {
                        animation: 'pulseAnimation 2s infinite',
                        boxShadow: '0 0 0 0 rgba(255, 0, 0, 1)'
                    } : {}}
                    disabled={!isSignedIn}
                >
                    <svg
                        width="30px"
                        height="30px"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="currentcolor">
                        <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentcolor" strokeWidth="1.5" >
                        </rect>
                        <path d="M5 10V11C5 14.866 8.13401 18 12 18V18V18C15.866 18 19 14.866 19 11V10" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        </path>
                        <path d="M12 18V22M12 22H9M12 22H15" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        </path>
                    </svg>

                </Button>
            </div>
        </div>
    );
};

export { Microphone };
