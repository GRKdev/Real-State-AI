export type SelectOption = {
  value: number;
  label: string;
};

export type AmenityOption = {
  key: AmenityKey;
  label: string;
};

export const TRANSACTION_TYPE_OPTIONS: SelectOption[] = [
  { value: 1, label: 'Sale' },
  { value: 2, label: 'Rent' }
];

export const PARISH_OPTIONS: SelectOption[] = [
  { value: 1, label: 'Andorra la Vella' },
  { value: 2, label: 'Canillo' },
  { value: 3, label: 'Encamp' },
  { value: 4, label: 'La Massana' },
  { value: 5, label: 'Ordino' },
  { value: 6, label: 'Sant Julia' },
  { value: 7, label: 'Escaldes-Engordany' }
];

export const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: 1, label: 'House' },
  { value: 2, label: 'Apartment' },
  { value: 3, label: 'Hotel' },
  { value: 4, label: 'Office' },
  { value: 5, label: 'Commercial' },
  { value: 6, label: 'Industrial' },
  { value: 7, label: 'Land' },
  { value: 8, label: 'Parking' },
  { value: 9, label: 'Storage' },
  { value: 10, label: 'Building' },
  { value: 11, label: 'Other' },
  { value: 12, label: 'Chalet' },
  { value: 13, label: 'Terraced House' },
  { value: 14, label: 'Apartment Sub' },
  { value: 15, label: 'Penthouse' },
  { value: 16, label: 'Duplex' },
  { value: 17, label: 'Studio' },
  { value: 18, label: 'Loft' }
];

export const LOCATION_OPTIONS: SelectOption[] = [
  { value: 1, label: 'Andorra la Vella' },
  { value: 2, label: 'Canillo' },
  { value: 3, label: 'Encamp' },
  { value: 4, label: 'La Massana' },
  { value: 5, label: 'Ordino' },
  { value: 6, label: 'Sant Julia' },
  { value: 7, label: 'Escaldes-Engordany' },
  { value: 8, label: 'Aixirivall' },
  { value: 9, label: 'Aixovall' },
  { value: 10, label: 'St-Coloma' },
  { value: 11, label: 'Anyos' },
  { value: 12, label: 'Arans' },
  { value: 13, label: 'Aravell' },
  { value: 14, label: 'Arinsal' },
  { value: 15, label: 'Aubinya' },
  { value: 16, label: 'Bixessarri' },
  { value: 17, label: 'Certers' },
  { value: 18, label: 'El Forn' },
  { value: 19, label: 'El Pas de la Casa' },
  { value: 20, label: 'El Serrat' },
  { value: 21, label: 'El Tarter' },
  { value: 22, label: 'Els Plans' },
  { value: 23, label: 'Envalira' },
  { value: 24, label: 'Erts' },
  { value: 25, label: 'Escas' },
  { value: 26, label: 'Fontaneda' },
  { value: 27, label: 'Incles' },
  { value: 28, label: 'Juberri' },
  { value: 29, label: 'La Cortinada' },
  { value: 30, label: 'La Margineda' },
  { value: 31, label: "L''Aldosa de Canillo" },
  { value: 32, label: "L''Aldosa de la Massana" },
  { value: 33, label: 'Les Bons' },
  { value: 34, label: 'Llorts' },
  { value: 35, label: 'Nagol' },
  { value: 36, label: 'Pal' },
  { value: 37, label: 'Prats' },
  { value: 38, label: 'Ransol' },
  { value: 39, label: 'Soldeu' }
];

export const REAL_ESTATE_OPTIONS: SelectOption[] = [
  { value: 1, label: 'Baron & Cabot' },
  { value: 2, label: 'Deloitte' },
  { value: 3, label: 'Blackrock' },
  { value: 4, label: 'Particular' }
];

export const AMENITY_OPTIONS = [
  { key: 'terrace', label: 'Terrace' },
  { key: 'parking', label: 'Parking' },
  { key: 'balcony', label: 'Balcony' },
  { key: 'garden', label: 'Garden' },
  { key: 'elevator', label: 'Elevator' },
  { key: 'heating', label: 'Heating' },
  { key: 'electrodometics', label: 'Appliances' },
  { key: 'furnished', label: 'Furnished' }
] as const;

export type AmenityKey = typeof AMENITY_OPTIONS[number]['key'];

export const SUPPORTED_LOCALES = ['en', 'es', 'ca', 'fr'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  ca: 'Catalan'
};

