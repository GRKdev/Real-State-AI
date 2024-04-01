import OpenAI from 'openai';
import { auth } from '@clerk/nextjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://oai.hconeai.com/v1",
  defaultHeaders: {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  },
});
interface ApiResponse {
  text: string;
}
const modelKey = process.env.OPENAI_FT_MODEL as string;

export async function POST(req: Request): Promise<Response> {
  const {userId} = auth();
  if(!userId){
    return new Response("Unauthorized", { status: 401 });
  }
  if (req.method === 'POST') {
    const { message } = await req.json();
    console.log('message:', message);

    try {
      const response = await openai.completions.create({
        model: modelKey,
        prompt: message,
        max_tokens: 50,
        temperature: 0,
        stop: ['%'],
      });

      // Return a JSON response with the text completion
      const apiResponse: ApiResponse = { text: response.choices[0].text };
      console.log('API response:', apiResponse);
  
      
      return new Response(JSON.stringify(apiResponse), {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error calling OpenAI:', error);
      // Return a server error response
      return new Response(JSON.stringify({ error: 'Failed to fetch response from OpenAI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // Method Not Allowed for non-POST requests
    return new Response(null, { status: 405 });
  }
}
