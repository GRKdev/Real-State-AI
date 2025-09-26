import { SupportedLocale } from "@/lib/property-metadata";

type ManagePropertiesDictionary = {
  headings: {
    publish: string;
    table: string;
  };
  translation: {
    banner: string;
    auto: string;
    single: string;
  };
  form: {
    labels: {
      title: string;
      photo: string;
      price: string;
      squareMeters: string;
      bedrooms: string;
      bathrooms: string;
      transactionType: string;
      parish: string;
      location: string;
      propertyType: string;
      description: string;
      amenities: string;
    };
    placeholders: {
      title: string;
      photo: string;
      price: string;
      squareMeters: string;
      bedrooms: string;
      bathrooms: string;
      description: string;
    };
    selects: {
      sameAsParish: string;
      selectType: string;
    };
    transactionTypes: Record<string, string>;
  };
  buttons: {
    reset: string;
    publish: string;
    publishing: string;
    delete: string;
    deleting: string;
  };
  messages: {
    createSuccess: string;
    createError: string;
    deleteSuccess: string;
    deleteError: string;
  };
  table: {
    empty: string;
    columns: {
      reference: string;
      title: string;
      price: string;
      parish: string;
      created: string;
      actions: string;
    };
  };
  validation: {
    titleLength: string;
    descriptionLength: string;
    pricePositive: string;
    priceFinite: string;
    squarePositive: string;
    squareFinite: string;
    bedroomsPositive: string;
    bedroomsFinite: string;
    bathroomsPositive: string;
    bathroomsFinite: string;
    transactionType: string;
    parish: string;
  };
};

export type Dictionary = {
  language_names: Record<SupportedLocale, string>;
  manage_properties: ManagePropertiesDictionary;
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
  };
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
    choose_model: string;
    model_finetune: string;
    model_system: string;
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
    system_prompts: {
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
};

export type DictionaryProps = {
  dictionary: Dictionary;
};
