import OpenAI from 'openai';
import { auth, currentUser  } from '@clerk/nextjs';

export async function POST(req: Request): Promise<Response> {
  const { userId } = auth();
  const user = await currentUser();
  const user_email = user?.emailAddresses[0]?.emailAddress || 'anonymous';

  // if (!userId) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://oai.hconeai.com/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-Property-Session": "real-state",
      "Helicone-User-Id": user_email
    },
  });

  interface ApiResponse {
    text: string;
  }

  const modelKey = process.env.OPENAI_FT_MODEL as string;

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

      const apiResponse: ApiResponse = { text: response.choices[0].text };
      console.log('API response:', apiResponse);
  
      
      return new Response(JSON.stringify(apiResponse), {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch response from OpenAI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(null, { status: 405 });
  }
}
