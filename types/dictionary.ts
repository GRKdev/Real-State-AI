export type Dictionary = {
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
        total_results: string;
        last_question: string;
        no_results: string;
        previous: string;
        next: string;
        more_pages: string;
        error_login: string;
        total_cost: string;
    },
    filters: {
        sign_in: string;
        title_filter: string;
        no_filters: string;
        price: string;
        bedroom: string;
        bathroom: string;
        square: string;
        searchbar: string;
        microphone: string;
    };
    welcomeMessage: {
    welcomeUser: {
        welcome: string;
        message: string;
        welcome_no_user: string;
      };
      overview: {
        title: string;
        description: string;
      };
      features: {
        title: string;
        items: string[]; 
      };
      fine_tuned: {
        title: string;
        description: string;
        items: string[];
      };
      technology: {
        title: string;
        items: string[]; 
      };
      examples: {
        title: string;
        description: string;
        items: string[]; 
      };
    };
    
}

  export type DictionaryProps = {
    dictionary: Dictionary;
};
