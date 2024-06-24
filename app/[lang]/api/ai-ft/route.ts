import OpenAI from 'openai';
import { auth, currentUser } from '@clerk/nextjs';
import { validateAndCorrectParams } from '@/utils/validateParams';

interface ApiResponse {
  text: string;
  total_cost: number;
}

export async function POST(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const { userId } = auth();
  const user = await currentUser();
  const user_email = user?.emailAddresses[0]?.emailAddress || 'anonymous';

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://oai.hconeai.com/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-Property-Session": "real-state",
      "Helicone-User-Id": user_email
    },
  });

  const modelKey = process.env.OPENAI_FT_MODEL as string;

  try {
    const { message } = await req.json();
    console.log('Original message:', message);

    const { correctedMessage, cost: total_cost_gpt35 } = await correctText(openai, message);

    if (correctedMessage === '%') {
      console.log('Corrected message is "%", skipping AI call');
      return new Response(JSON.stringify({ message: 'Invalid question' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const correct_message = correctedMessage + '%';
    console.log('Corrected message:', correct_message);

    const response = await openai.completions.create({
      model: modelKey,
      prompt: correct_message,
      max_tokens: 50,
      temperature: 0,
      stop: ['%'],
    });

    let total_cost_ft = 0;
    if (response.usage) {
      const apiPromptCost = response.usage.prompt_tokens || 0;
      const apiResponseCost = response.usage.completion_tokens || 0;
      total_cost_ft = (apiPromptCost + apiResponseCost) * 0.0000016;
    }

    const total_cost = total_cost_ft + total_cost_gpt35;

    let apiResponse: ApiResponse = { 
      text: response.choices[0].text,
      total_cost: total_cost / 1000000
    };

    console.log('API response:', apiResponse);

    apiResponse.text = validateAndCorrectParams(apiResponse.text);
    console.log('Corrected API response:', apiResponse);

    return new Response(JSON.stringify(apiResponse), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in POST function:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function correctText(openai: OpenAI, message: string): Promise<{ correctedMessage: string, cost: number }> {
  try {
    const contenMessage = `Your job is correct and translate messages from users that find properties in a real state web. Correct the following text for any grammatical or typographical errors, the text could be in English, Spanish, Catalan, or French, translated into English when after corrected.\nIMPORTANT NOTE: Glossary u need to use: Terraced house, Chalet, Apartment, Studio, Loft, Penthouse(Dont use Attic use Penthouse instaed), land, duplex, hotel, office, commercial, indrustrial, land, parking, storage, building.\nExamples: "Casa en andorra." u would translate into "House in Andorra" or "comprar piso" to "buy house". Your are not a chatbot, if the user wants to talk or ask something, you should send a char "%" instead of a correct message. U need to the the same if user ask something not related to find/buy properties.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: "system", content: contenMessage }, { role: "user", content: message }],
      max_tokens: 50,
      temperature: 0,
    });

    if (completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content) {
      let total_cost_gpt35 = 0;
      if (completion.usage) {
        const apiPromptCost = completion.usage.prompt_tokens || 0;
        const apiResponseCost = completion.usage.completion_tokens || 0;
        total_cost_gpt35 = (apiPromptCost) * 0.5 + (apiResponseCost) * 1.5;
      }

      return {
        correctedMessage: completion.choices[0].message.content.trim(),
        cost: total_cost_gpt35
      };
    } else {
      throw new Error('No content received from OpenAI completion');
    }

  } catch (error) {
    console.error('Error correcting text:', error);
    throw new Error('Failed to correct text');
  }
}
