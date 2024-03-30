export type Dictionary = {
    navbar: {
        searchbar: string;
    };
    extra_options: {
        title: string;
        bedrooms: string;
        bathrooms: string;
        parking: string;
        balcony: string;
        garden: string;
        elevator: string;
        heating: string;
        electrod: string;
        furnished: string;        
        terrace: string;

    };
    property_card: {
        month: string;
        room: string;
        rooms: string;
        bathroom: string;
        bathrooms: string;
    },
    filters: {
        title_filter: string;
        no_filters: string;
        price: string;
        bedroom: string;
        bathroom: string;
        square: string;
    };
}

export type DictionaryProps = {
    dictionary: Dictionary;
};