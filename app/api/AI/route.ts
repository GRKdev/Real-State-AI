import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
interface ApiResponse {
  text: string;
}
// Export the handler for the POST method using uppercase
export async function POST(req: Request): Promise<Response> {
  if (req.method === 'POST') {
    const { message } = await req.json();
    console.log('message:', message);

    try {
      const response = await openai.completions.create({
        model: 'ft:babbage-002:iand:api-pisos-v5:92Pa5Mv1',
        prompt: message,
        max_tokens: 150,
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
