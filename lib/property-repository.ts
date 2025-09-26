import { Pool } from "pg";
import type { Property } from "@/types/property";
import { SUPPORTED_LOCALES, type AmenityKey, type SupportedLocale } from "@/lib/property-metadata";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set.");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

let schemaPromise: Promise<void> | null = null;

const ORDERED_LOCALES = [...SUPPORTED_LOCALES] as SupportedLocale[];

const AMENITY_COLUMNS: AmenityKey[] = [
  "terrace",
  "parking",
  "balcony",
  "garden",
  "elevator",
  "heating",
  "electrodometics",
  "furnished"
];

const PROPERTY_SELECT_COLUMNS = [
  "id",
  "title_en",
  "title_esp",
  "title_cat",
  "title_fr",
  "description_en",
  "description_esp",
  "description_cat",
  "description_fr",
  "photo",
  "square_meters",
  "bedrooms",
  "bathrooms",
  "price",
  "transaction_type",
  "real_state",
  "parish",
  "location",
  "property_type",
  ...AMENITY_COLUMNS,
  "clerk_user_id",
  "is_user_generated",
  "created_at"
].join(", ");

async function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS clerk_user_id text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_user_generated boolean DEFAULT false");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW()");

      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_en text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_esp text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_cat text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_fr text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_en text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_esp text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_cat text");
      await pool.query("ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_fr text");
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  const promise = schemaPromise;
  if (!promise) {
    throw new Error("Failed to initialize database schema.");
  }

  await promise;
}

type LocaleStrings = Record<SupportedLocale, string>;

export type PropertyInput = {
  baseLocale: SupportedLocale;
  titles: LocaleStrings;
  descriptions: LocaleStrings;
  price: number;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  transactionType: number;
  parish: number;
  propertyType?: number | null;
  location?: number | null;
  photo?: string | null;
  realState?: number | null;
  amenities: Record<AmenityKey, boolean>;
};

function mapBoolean(value: unknown): boolean {
  return value === true;
}

function sanitizeLocaleStrings(strings: LocaleStrings, baseLocale: SupportedLocale): LocaleStrings {
  const fallback = strings[baseLocale]?.trim() || strings.en?.trim() || "";
  const normalized: Partial<LocaleStrings> = {};

  for (const locale of ORDERED_LOCALES) {
    const value = strings[locale]?.trim();
    normalized[locale] = value && value.length > 0 ? value : fallback;
  }

  return normalized as LocaleStrings;
}

export async function listUserProperties(userId: string): Promise<Property[]> {
  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT ${PROPERTY_SELECT_COLUMNS} FROM properties WHERE clerk_user_id = $1 AND is_user_generated = true ORDER BY created_at DESC, id DESC`,
    [userId]
  );
  return rows as Property[];
}

export async function createUserProperty(userId: string, input: PropertyInput): Promise<Property> {
  await ensureSchema();

  const photo = input.photo?.trim() || "/logo2.webp";
  const location = input.location ?? input.parish;
  const realState = input.realState ?? 4;

  const titleStrings = sanitizeLocaleStrings(input.titles, input.baseLocale);
  const descriptionStrings = sanitizeLocaleStrings(input.descriptions, input.baseLocale);
  const amenityValues = AMENITY_COLUMNS.map((key) => mapBoolean(input.amenities[key]));

  const params = [
    titleStrings.en,
    titleStrings.es,
    titleStrings.ca,
    titleStrings.fr,
    descriptionStrings.en,
    descriptionStrings.es,
    descriptionStrings.ca,
    descriptionStrings.fr,
    photo,
    input.squareMeters,
    input.bedrooms,
    input.bathrooms,
    input.price,
    input.transactionType,
    realState,
    input.parish,
    location,
    input.propertyType ?? null,
    ...amenityValues,
    userId,
    true
  ];

  const insertColumns = [
    "title_en",
    "title_esp",
    "title_cat",
    "title_fr",
    "description_en",
    "description_esp",
    "description_cat",
    "description_fr",
    "photo",
    "square_meters",
    "bedrooms",
    "bathrooms",
    "price",
    "transaction_type",
    "real_state",
    "parish",
    "location",
    "property_type",
    ...AMENITY_COLUMNS,
    "clerk_user_id",
    "is_user_generated"
  ];

  const valuePlaceholders = [
    "$1", "$2", "$3", "$4",
    "$5", "$6", "$7", "$8",
    "$9", "$10", "$11", "$12",
    "$13", "$14", "$15", "$16",
    "$17", "$18",
    ...AMENITY_COLUMNS.map((_, idx) => `$${19 + idx}`),
    `$${19 + AMENITY_COLUMNS.length}`,
    `$${20 + AMENITY_COLUMNS.length}`
  ];

  const { rows } = await pool.query(
    `INSERT INTO properties (
      ${insertColumns.join(", ")}
    ) VALUES (
      ${valuePlaceholders.join(", ")}
    )
    RETURNING ${PROPERTY_SELECT_COLUMNS}`,
    params
  );

  return rows[0] as Property;
}

export async function deleteUserProperty(userId: string, propertyId: number): Promise<Property | null> {
  await ensureSchema();
  const { rows } = await pool.query(
    `DELETE FROM properties WHERE id = $1 AND clerk_user_id = $2 AND is_user_generated = true RETURNING ${PROPERTY_SELECT_COLUMNS}`,
    [propertyId, userId]
  );
  return rows[0] as Property | null;
}

export { pool as propertyPool };
