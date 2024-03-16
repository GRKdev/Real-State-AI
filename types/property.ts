export type Property = {
    reference_number: string;
    title_cat: string;
    title_es: string;
    title_en: string;
    photo: string;
    square_meters: number;
    bedrooms: number;
    bathrooms: number;
    price: number;
    transaction_type: number;
    real_state: number;
  };

export type PropertyCardProps = {
    property: Property;
    className?: string;
    style?: React.CSSProperties;
};