export const i18n = {
    defaultLocale: "en",
    locales: ["ca","es","en", "fr"],
  } as const;
  
  export type Locale = (typeof i18n)["locales"][number];