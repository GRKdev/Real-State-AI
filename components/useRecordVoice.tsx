"use client";
import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/utils/blobToBase64";
import { useLocale } from '@/contexts/localeContext';

export const useRecordVoice = () => {
    const [text, setText] = useState<string>("");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recording, setRecording] = useState<boolean>(false);
    const isRecording = useRef<boolean>(false);
    const chunks = useRef<BlobPart[]>([]);
    const { locale } = useLocale();


    const start = () => {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            isRecording.current = true;
            mediaRecorder.start();
            setRecording(true);
        }
    };


    const stop = () => {
        if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
            mediaRecorder.stop();
            isRecording.current = false;
            setRecording(false);
        }
    };

    const speechToText_endpont = locale + '/api/speechToText';

    const getText = async (base64data: any) => {
        try {
            const response = await fetch(speechToText_endpont, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    audio: base64data,
                    language: locale,
                }),
            }).then((res) => res.json());
            const { text } = response;
            setText(text);
        } catch (error) {
            console.log(error);
        }
    };
    const resetText = () => {
        setText("");
        chunks.current = [];
    };
    const initialMediaRecorder = (stream: MediaStream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (ev) => {
            chunks.current.push(ev.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
            blobToBase64(audioBlob, getText);
        };

        setMediaRecorder(mediaRecorder);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(initialMediaRecorder);
        }
    }, []);

    return { recording, start, stop, text, resetText };
};