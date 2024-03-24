import { NextResponse } from "next/server";
import fetch from "node-fetch"; 
import FormData from "form-data"; 
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const base64Audio = body.audio;
  const audioBuffer = Buffer.from(base64Audio, "base64");

  // Use the form-data library to create a multipart form body
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("language", "ca");
  formData.append("file", audioBuffer, "input.wav"); // Use Buffer directly

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        // 'Content-Type': 'multipart/form-data' is set automatically by form-data
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error: any) {
    console.error("Error processing audio:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
