// app/[lang]/ai/api/route.tsx
import OpenAI from 'openai';
import { currentUser } from '@clerk/nextjs';

// Helper to normalize user texts for lookup
function normalize(str: string) {
    return str
        .toLowerCase()
        .replace(/['-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Location name → ID mapping
const locationList: [string, number][] = [
    ['Andorra', 1], ['Andorra la Vella', 1], ['Canillo', 2], ['Encamp', 3], ['La Massana', 4],
    ['Ordino', 5], ['Sant Julia', 6], ['Escaldes-Engordany', 7], ['Escaldes', 7], ['Aixirivall', 8],
    ['Aixovall', 9], ['St-Coloma', 10], ['Anyós', 11], ['Arans', 12], ['Aravell', 13],
    ['Arinsal', 14], ['Aubinya', 15], ['Bixessarri', 16], ['Certers', 17], ['El Forn', 18],
    ['El Pas de la Casa', 19], ['El Serrat', 20], ['El Tarter', 21], ['Els Plans', 22],
    ['Envalira', 23], ['Erts', 24], ['Escas', 25], ['Fontaneda', 26], ['Incles', 27],
    ['Juberri', 28], ['La Cortinada', 29], ['La Margineda', 30],
    ["L'Aldosa de Canillo", 31], ["L'Aldosa de la Massana", 32],
    ['Les Bons', 33], ['Llorts', 34], ['Nagol', 35], ['Pal', 36],
    ['Prats', 37], ['Ransol', 38], ['Soldeu', 39]
];
const locationMap: Record<string, number> = {};
locationList.forEach(([name, id]) => {
    locationMap[normalize(name)] = id;
});

// Property-type name → ID mapping
const propertyTypeList: [string, number][] = [
    ['house', 1], ['chalet', 12], ['terraced house', 13], ['apartment', 2],
    ['apartment sub', 14], ['penthouse', 15], ['duplex', 16], ['studio', 17],
    ['loft', 18], ['hotel', 3], ['office', 4], ['commercial', 5], ['industrial', 6],
    ['land', 7], ['parking', 8], ['storage', 9], ['building', 10], ['other', 11]
];
const propertyTypeMap: Record<string, number> = {};
propertyTypeList.forEach(([name, id]) => {
    propertyTypeMap[normalize(name)] = id;
});

// Allowed amenities for boolean flags
const amenitySet = new Set([
    'terrace', 'parking', 'balcony', 'garden',
    'electrodometics', 'heating', 'elevator', 'furnished'
]);

// JSON Schema for GPT-4o structured output
const filterSchema = {
    type: "object",
    properties: {
        location: {
            type: ["string", "null"],
            description: "Comma-separated location names, or null"
        },
        transaction_type: {
            type: ["string", "null"],
            enum: ["sale", "rent", null],
            description: "Either 'sale', 'rent', or null if unspecified"
        },
        property_type: {
            type: ["string", "null"],
            description: "Comma-separated property types, or null"
        },
        minprice: { type: ["integer", "null"], description: "Minimum price, or null" },
        maxprice: { type: ["integer", "null"], description: "Maximum price, or null" },
        min_bedrooms: { type: ["integer", "null"], description: "Minimum bedrooms, or null" },
        max_bedrooms: { type: ["integer", "null"], description: "Maximum bedrooms, or null" },
        min_bathrooms: { type: ["integer", "null"], description: "Minimum bathrooms, or null" },
        max_bathrooms: { type: ["integer", "null"], description: "Maximum bathrooms, or null" },
        amenities: { type: "array", items: { type: "string" }, description: "List of amenities or []" }
    },
    required: [
        "location",
        "transaction_type",
        "property_type",
        "minprice",
        "maxprice",
        "min_bedrooms",
        "max_bedrooms",
        "min_bathrooms",
        "max_bathrooms",
        "amenities"
    ],
    additionalProperties: false
};

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
        }
    });

    if (req.method !== 'POST') {
        return new Response(null, { status: 405 });
    }

    const { message } = await req.json();
    console.log('User query:', message);

    const systemPrompt = `
You are a real estate search assistant. Extract filters into JSON using the provided schema—**output only the JSON**.
• **Use exactly one of these canonical location names** (no variants). If the user writes a partial or lowercase form, map it to the exact name below:
Andorra, Andorra la Vella, Canillo, Encamp, La Massana, Ordino, Sant Julia, Escaldes-Engordany, Escaldes, Aixirivall, Aixovall, St-Coloma, Anyós, Arans, Aravell, Arinsal, Aubinya, Bixessarri, Certers, El Forn, El Pas de la Casa, El Serrat, El Tarter, Els Plans, Envalira, Erts, Escas, Fontaneda, Incles, Juberri, La Cortinada, La Margineda, L'Aldosa de Canillo, L'Aldosa de la Massana, Les Bons, Llorts, Nagol, Pal, Prats, Ransol, Soldeu.

• **Use exactly one of these canonical property types** (no variants):  
  house, chalet, terraced_house, apartment, apartment_sub, penthouse, duplex,  
  studio, loft, hotel, office, commercial, industrial, land, parking, storage,  
  building, other.

• **Only list something in "amenities"** if the user explicitly says “with X” or “including X”. Supported amenities:  
  terrace, parking, balcony, garden, electrodometics, heating, elevator, furnished.

• **Translate** any non-English terms to English before generating JSON (e.g. "piso" → "apartment", "casa" → "house", "oficina" → "office").  
• Use **null** for any filter the user did **not** specify.  
• Use **[]** if no amenities.  
• Don't guess sale/rent or type if unspecified—leave as null.
`;
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "RealEstateSearchFilters",
                strict: true,
                schema: filterSchema
            }
        },
        max_tokens: 200,
        temperature: 0
    });
    console.log('GPT-4o response:', completion.choices[0].message.content);

    // Parse GPT output
    let filters;
    try {
        filters = JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
        filters = {
            location: null,
            transaction_type: null,
            property_type: null,
            minprice: null,
            maxprice: null,
            min_bedrooms: null,
            max_bedrooms: null,
            min_bathrooms: null,
            max_bathrooms: null,
            amenities: []
        };
    }

    // === UPDATED PARAM-BUILDING LOGIC ===
    const params = new URLSearchParams();

    // handle multi-location correctly
    if (filters.location) {
        const locIds = filters.location
            .split(',')
            .map((loc: string) => normalize(loc))
            .map((norm: string) => locationMap[norm])
            .filter(Boolean);
        if (locIds.length) {
            params.append('location', locIds.join(','));
        }
    }

    // only append transaction_type if explicitly set
    if (filters.transaction_type !== null) {
        params.append(
            'transaction_type',
            filters.transaction_type === 'rent' ? '2' : '1'
        );
    }

    // handle multi-property-type correctly
    if (filters.property_type) {
        const ptIds = filters.property_type
            .split(',')
            .map((pt: string) => normalize(pt))
            .map((norm: string) => propertyTypeMap[norm])
            .filter(Boolean);
        if (ptIds.length) {
            params.append('property_type', ptIds.join(','));
        }
    }

    if (typeof filters.minprice === 'number') {
        params.append('minprice', String(filters.minprice));
    }
    if (typeof filters.maxprice === 'number') {
        params.append('maxprice', String(filters.maxprice));
    }
    if (typeof filters.min_bedrooms === 'number') {
        params.append('minbed', String(filters.min_bedrooms));
    }
    if (typeof filters.max_bedrooms === 'number') {
        params.append('maxbed', String(filters.max_bedrooms));
    }
    if (typeof filters.min_bathrooms === 'number') {
        params.append('minbath', String(filters.min_bathrooms));
    }
    if (typeof filters.max_bathrooms === 'number') {
        params.append('maxbath', String(filters.max_bathrooms));
    }

    // amenities unchanged
    if (Array.isArray(filters.amenities)) {
        filters.amenities.forEach((am: string) => {
            const key = normalize(am);
            if (amenitySet.has(key)) {
                params.append(key, '1');
            }
        });
    }

    const queryString = params.toString();

    // Cost calculation
    const pT = completion.usage.prompt_tokens || 0;
    const cT = completion.usage.completion_tokens || 0;
    const total_cost = ((pT * 0.15) + (cT * 0.6)) / 1_000_000;

    console.log('Final query:', queryString);
    console.log('Cost (€ per 1M):', total_cost);

    return new Response(
        JSON.stringify({ text: queryString, total_cost }),
        { headers: { 'Content-Type': 'application/json' } }
    );
}