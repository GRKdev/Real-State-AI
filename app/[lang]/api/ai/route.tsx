import OpenAI from 'openai';
import { currentUser } from '@clerk/nextjs';
import { validateAndCorrectParams } from '@/utils/validateParams';

export async function POST(req: Request): Promise<Response> {
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

    if (req.method === 'POST') {
        const { message } = await req.json();
        console.log('Original message:', message);
        const contenMessage = `You are a real estate search parameter generator. Based on user queries about real estate properties, you will provide the corresponding search parameters. U will need to correct and translate the user queries to english and generate the search parameters based. U WOULD NEVER talk to the user, only generate the search parameters.
Here are the mappings you will use to generate these parameters:

Transaction Type:
{ buy = 1
rent = 2
}

Locations:
{
Andorra = 1
Canillo = 2
Encamp = 3
La Massana = 4
Ordino = 5
Sant Julia = 6
Escaldes-Engordany = 7
Aixirivall = 8
Aixovall = 9
St-Coloma = 10
Anyos = 11
Arans = 12
Aravell = 13
Arinsal = 14
Aubinya = 15
Bixessarri = 16
Certers = 17
El Forn = 18
El Pas de la Casa = 19
El Serrat = 20
El Tarter = 21
Els Plans = 22
Envalira = 23
Erts = 24
Escas = 25
Fontaneda = 26
Incles = 27
Juberri = 28
La Cortinada = 29
La Margineda = 30
L'Aldosa de Canillo = 31
L'Aldosa de la Massana = 32
Les Bons = 33
Llorts = 34
Nagol = 35
Pal = 36
Prats = 37
Ransol = 38
Soldeu = 39
}

Property Types:
{
house = 1
chalet = 12
terraced_house = 13
apartment = 2
apartment_sub = 14
penthouse = 15
duplex = 16
studio = 17
loft = 18
hotel = 3
office = 4
commercial = 5
industrial = 6
land = 7
parking = 8
storage = 9
building = 10
other = 11
}

Additional Parameters:
{
maxprice
minprice
bed
minbed
}

Extra Parameters (append with =1 if present, ex: i want a house with parking and elevator = property_type=1&parking=1&elevator=1):
{
terrace
parking
balcony
garden
electrodometics
heating
elevator
furnished
}

Rules for Multiple Values:
For multiple locations, use a comma-separated list (e.g., location=1,2)
For multiple property types, use a comma-separated list (e.g., property_type=1,2)

Special Conditions for "Very Cheap" or "Cheapest" Queries:
Residential properties (buy): maxprice = 250000
Residential properties (rent): maxprice = 1000
Parking or storage (buy): maxprice = 50000
Parking or storage (rent): maxprice = 100
Land (buy): maxprice = 100000
Hotels or buildings (buy): maxprice = 1000000

Examples:
User Query: "Can you find properties for sale in Andorra and Canillo for me?"
Parameters: location=1,2&transaction_type=1
User Query: "I'm looking to buy a house or apartment in Canillo, what do you have?"
P: location=2&transaction_type=1&property_type=1,2
User Query: "I want to rent an apartment between 1,000 and 1,500 euros."
P: property_type=2&transaction_type=2&minprice=1000&maxprice=1500
User Query: "Houses for rent for less than 2,000 euros."
P: transaction_type=2&property_type=1&maxprice=2000
User Query: "Show me the cheapest apartments for rent."
P: property_type=2&transaction_type=2&maxprice=1000
User Query: "Find the cheapest land for sale."
P: property_type=7&transaction_type=1&maxprice=100000
User Query: "i want buy or rent a parking in Arinsal or encamp"
P: location=3,14&transaction_type=1,2&property_type=8
User Query: "casa escaldes"
P: location=7&property_type=1
User Query: "buy between one and two and half million euros, with a minimum of 3 bedrooms"
transaction_type=1&minprice=1000000&maxprice=2500000&minbed=3
User Query: 3-Bedroom Apartment
P: property_type=2&bed=3`
            ;

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: "system", content: contenMessage }, { role: "user", content: message }],
                max_tokens: 50,
                temperature: 0,
            });
            const apiPromptCost = completion?.usage?.prompt_tokens || 0;
            const apiResponseCost = completion?.usage?.completion_tokens || 0;
            const total_cost = ((apiPromptCost) * 0.15 + (apiResponseCost) * 0.6)

            let apiResponse = {
                text: completion?.choices?.[0]?.message?.content?.trim() || 'No response content',
                total_cost: total_cost / 1000000
            };

            console.log('Total cost for 1M queries: ' + total_cost + ' €');
            console.log('API response:', apiResponse);

            // Validate and correct the parameters
            apiResponse.text = validateAndCorrectParams(apiResponse.text);
            console.log('Corrected API response:', apiResponse);

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