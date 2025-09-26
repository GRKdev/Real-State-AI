import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import {
  AMENITY_OPTIONS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type AmenityKey,
  type SupportedLocale,
} from "@/lib/property-metadata";
import {
  createUserProperty,
  listUserProperties,
  type PropertyInput,
} from "@/lib/property-repository";

const OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_LOCALE: SupportedLocale = "en";

type LocalizedText = {
  title: string;
  description: string;
};

type LocalizedMap = Partial<Record<SupportedLocale, LocalizedText>>;

type ParsedPropertyPayload = {
  title: string;
  description: string;
  price: number;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  transactionType: number;
  parish: number;
  propertyType: number | null;
  location: number | null;
  photo: string | null;
  amenities: Record<AmenityKey, boolean>;
  baseLocale: SupportedLocale;
};

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
};

const sanitizeAmenities = (input: unknown): Record<AmenityKey, boolean> => {
  const amenities: Record<AmenityKey, boolean> = AMENITY_OPTIONS.reduce((acc, option) => {
    acc[option.key] = false;
    return acc;
  }, {} as Record<AmenityKey, boolean>);

  if (typeof input !== "object" || input === null) {
    return amenities;
  }

  for (const option of AMENITY_OPTIONS) {
    const value = (input as Record<string, unknown>)[option.key];
    amenities[option.key] = value === true;
  }

  return amenities;
};

function parsePropertyPayload(payload: any): ParsedPropertyPayload {
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";
  const description = typeof payload?.description === "string" ? payload.description.trim() : "";
  const price = Number(payload?.price);
  const squareMeters = Number(payload?.squareMeters);
  const bedrooms = Number(payload?.bedrooms);
  const bathrooms = Number(payload?.bathrooms);
  const transactionType = Number(payload?.transactionType);
  const parish = Number(payload?.parish);
  const propertyType = payload?.propertyType === null || payload?.propertyType === "" || typeof payload?.propertyType === "undefined"
    ? null
    : Number(payload.propertyType);
  const location = payload?.location === null || payload?.location === "" || typeof payload?.location === "undefined"
    ? null
    : Number(payload.location);
  const photo = typeof payload?.photo === "string" ? payload.photo.trim() : null;
  const localeInput = typeof payload?.locale === "string" ? payload.locale.trim() : "";
  const baseLocale = isSupportedLocale(localeInput) ? localeInput : DEFAULT_LOCALE;

  return {
    title,
    description,
    price,
    squareMeters,
    bedrooms,
    bathrooms,
    transactionType,
    parish,
    propertyType,
    location,
    photo,
    amenities: sanitizeAmenities(payload?.amenities),
    baseLocale,
  };
}

function validatePayload(data: ParsedPropertyPayload) {
  if (!data.title || data.title.length < 4) {
    throw new Error("Title must be at least 4 characters long.");
  }
  if (!data.description || data.description.length < 10) {
    throw new Error("Description must be at least 10 characters long.");
  }

  const numericFields: Array<[number, string, boolean?]> = [
    [data.price, "Price"],
    [data.squareMeters, "Square meters"],
    [data.bedrooms, "Bedrooms", true],
    [data.bathrooms, "Bathrooms", true],
  ];

  numericFields.forEach(([value, label, allowZero]) => {
    if (Number.isNaN(value) || (!allowZero && value <= 0)) {
      throw new Error(`${label} must be a positive number.`);
    }
    if (!Number.isFinite(value)) {
      throw new Error(`${label} must be a finite number.`);
    }
  });

  if (![1, 2].includes(data.transactionType)) {
    throw new Error("Invalid transaction type supplied.");
  }
  if (!Number.isInteger(data.parish) || data.parish <= 0) {
    throw new Error("Parish is required.");
  }

  if (data.propertyType !== null && Number.isNaN(data.propertyType)) {
    throw new Error("Invalid property type supplied.");
  }
  if (data.location !== null && Number.isNaN(data.location)) {
    throw new Error("Invalid location supplied.");
  }
}

const createOpenAIClient = (userId?: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const headers: Record<string, string> = {};
  if (process.env.HELICONE_API_KEY) {
    headers["Helicone-Auth"] = `Bearer ${process.env.HELICONE_API_KEY}`;
    headers["Helicone-Property-Session"] = "real-state";
    headers["Helicone-User-Id"] = userId ?? "anonymous";
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL ?? "https://oai.hconeai.com/v1",
    defaultHeaders: Object.keys(headers).length ? headers : undefined,
  });
};

async function translatePropertyContent(
  baseLocale: SupportedLocale,
  title: string,
  description: string,
  userId?: string,
): Promise<LocalizedMap> {
  const targetLocales = SUPPORTED_LOCALES.filter((locale) => locale !== baseLocale);
  if (!targetLocales.length) {
    return {};
  }

  const client = createOpenAIClient(userId);
  if (!client) {
    return {};
  }

  const localeDescriptions = targetLocales
    .map((locale) => `${locale} (${LOCALE_LABELS[locale]})`)
    .join(", ");

  const systemPrompt = `You translate real-estate listing content into the requested locales. Return JSON only with one top-level key per locale code (e.g. "es"). Each locale must map to an object with "title" and "description" fields containing fluent marketing copy. Keep prices and measurements unchanged. Titles must stay under 80 characters. Target locales: ${localeDescriptions}.`;
  const userPayload = JSON.stringify({
    base_locale: baseLocale,
    target_locales: targetLocales,
    title,
    description,
  });

  try {
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPayload },
      ],
      temperature: 0.2,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, LocalizedText>;
    const result: LocalizedMap = {};

    for (const locale of targetLocales) {
      const record = parsed[locale];
      if (record?.title && record?.description) {
        result[locale] = {
          title: record.title.trim(),
          description: record.description.trim(),
        };
      }
    }

    return result;
  } catch (error) {
    console.error("Translation request failed", error);
    return {};
  }
}

async function buildLocalizedFields(
  payload: ParsedPropertyPayload,
  userId?: string,
): Promise<{ titles: Record<SupportedLocale, string>; descriptions: Record<SupportedLocale, string> }> {
  const base: LocalizedMap = {
    [payload.baseLocale]: {
      title: payload.title,
      description: payload.description,
    },
  };

  const translations = await translatePropertyContent(
    payload.baseLocale,
    payload.title,
    payload.description,
    userId,
  );

  const titles: Record<SupportedLocale, string> = {} as Record<SupportedLocale, string>;
  const descriptions: Record<SupportedLocale, string> = {} as Record<SupportedLocale, string>;

  for (const locale of SUPPORTED_LOCALES) {
    const text = (locale === payload.baseLocale ? base[locale] : translations[locale]) ?? base[payload.baseLocale]!;
    titles[locale] = text.title.trim();
    descriptions[locale] = text.description.trim();
  }

  return { titles, descriptions };
}

export async function GET(): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const properties = await listUserProperties(userId);
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Failed to list user properties", error);
    return NextResponse.json({ error: "Unable to load properties." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed: ParsedPropertyPayload;
  try {
    const body = await request.json();
    parsed = parsePropertyPayload(body);
    validatePayload(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let localizedTitles: Record<SupportedLocale, string>;
  let localizedDescriptions: Record<SupportedLocale, string>;

  try {
    const localized = await buildLocalizedFields(parsed, userId ?? undefined);
    localizedTitles = localized.titles;
    localizedDescriptions = localized.descriptions;
  } catch (error) {
    console.error("Failed to generate translations", error);
    const fallbackTitles: Record<SupportedLocale, string> = {} as Record<SupportedLocale, string>;
    const fallbackDescriptions: Record<SupportedLocale, string> = {} as Record<SupportedLocale, string>;
    for (const locale of SUPPORTED_LOCALES) {
      fallbackTitles[locale] = parsed.title;
      fallbackDescriptions[locale] = parsed.description;
    }
    localizedTitles = fallbackTitles;
    localizedDescriptions = fallbackDescriptions;
  }

  const payload: PropertyInput = {
    baseLocale: parsed.baseLocale,
    titles: localizedTitles,
    descriptions: localizedDescriptions,
    price: parsed.price,
    squareMeters: parsed.squareMeters,
    bedrooms: parsed.bedrooms,
    bathrooms: parsed.bathrooms,
    transactionType: parsed.transactionType,
    parish: parsed.parish,
    propertyType: parsed.propertyType,
    location: parsed.location,
    photo: parsed.photo,
    amenities: parsed.amenities,
  };

  try {
    const property = await createUserProperty(userId, payload);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Failed to create property", error);
    return NextResponse.json({ error: "Failed to create property." }, { status: 500 });
  }
}

