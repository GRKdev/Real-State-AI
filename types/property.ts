export type Property = {
    reference_number: string;
    title_cat: string;
    title_esp: string;
    title_en: string;
    title_fr: string;
    description_en: string;
    description_esp: string;
    description_cat: string;
    description_fr: string;
    photo: string;
    square_meters: number;
    bedrooms: number;
    bathrooms: number;
    price: number;
    transaction_type: number;
    real_state: number;
    parish: number;
  };

export type PropertyCardProps = {
    property: Property;
    className?: string;
    style?: React.CSSProperties;
};