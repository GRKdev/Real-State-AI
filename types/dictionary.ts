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
    }
}

export type DictionaryProps = {
    dictionary: Dictionary;
};