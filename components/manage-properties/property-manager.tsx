"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDictionary } from "@/hooks/useDictionary";
import type { Property } from "@/types/property";
import {
  AMENITY_OPTIONS,
  LOCATION_OPTIONS,
  PARISH_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  type SupportedLocale,
  type AmenityKey,
} from "@/lib/property-metadata";

interface PropertyManagerProps {
  lang: string;
  initialProperties: Property[];
}

interface FormState {
  title: string;
  description: string;
  price: string;
  squareMeters: string;
  bedrooms: string;
  bathrooms: string;
  transactionType: string;
  parish: string;
  propertyType: string;
  location: string;
  photo: string;
  amenities: Record<AmenityKey, boolean>;
}

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

const localeTitleKeyMap: Record<SupportedLocale, keyof Property> = {
  en: "title_en",
  es: "title_esp",
  ca: "title_cat",
  fr: "title_fr",
};

const currencyLocaleMap: Record<SupportedLocale, string> = {
  en: "en-GB",
  es: "es-ES",
  ca: "ca-AD",
  fr: "fr-FR",
};

const createAmenityDefaults = (): Record<AmenityKey, boolean> => {
  return AMENITY_OPTIONS.reduce<Record<AmenityKey, boolean>>((acc, option) => {
    acc[option.key] = false;
    return acc;
  }, {} as Record<AmenityKey, boolean>);
};

const INITIAL_STATE: FormState = {
  title: "",
  description: "",
  price: "",
  squareMeters: "",
  bedrooms: "",
  bathrooms: "",
  transactionType: TRANSACTION_TYPE_OPTIONS[0].value.toString(),
  parish: PARISH_OPTIONS[0].value.toString(),
  propertyType: "",
  location: "",
  photo: "",
  amenities: createAmenityDefaults(),
};

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
};

export function PropertyManager({ lang, initialProperties }: PropertyManagerProps) {
  const effectiveLocale: SupportedLocale = isSupportedLocale(lang) ? (lang as SupportedLocale) : ("en" as SupportedLocale);

  const manageDict = useDictionary("manage_properties");
  const languageNamesDict = useDictionary("language_names");
  const amenitiesDict = useDictionary("extra_options");

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(currencyLocaleMap[effectiveLocale] ?? "en-GB", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
      }),
    [effectiveLocale]
  );

  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [message, setMessage] = useState<MessageState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const apiBase = useMemo(() => `/${lang}/api/properties`, [lang]);

  if (!manageDict || !languageNamesDict || !amenitiesDict) {
    return null;
  }

  const localeLabel = languageNamesDict[effectiveLocale] ?? LOCALE_LABELS[effectiveLocale];
  const translationLocales = SUPPORTED_LOCALES.filter((code) => code !== effectiveLocale);
  const translationLabels = translationLocales.map((code) => languageNamesDict[code] ?? LOCALE_LABELS[code]);
  const translationNote = translationLocales.length
    ? manageDict.translation.auto.replace("{languages}", translationLabels.join(", "))
    : manageDict.translation.single;
  const translationBanner = manageDict.translation.banner
    .replace("{language}", localeLabel)
    .replace("{note}", translationNote);

  const propertyTitleKey = localeTitleKeyMap[effectiveLocale] ?? "title_en";

  const resetForm = () => {
    setFormState({ ...INITIAL_STATE, amenities: createAmenityDefaults() });
    setMessage(null);
  };

  const handleInputChange = (field: keyof FormState) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      description: event.target.value,
    }));
  };

  const toggleAmenity = (key: AmenityKey) => (checked: boolean | "indeterminate") => {
    setFormState((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: checked === true,
      },
    }));
  };

  const getAmenityLabel = (key: AmenityKey) => {
    if (key === "electrodometics") {
      return amenitiesDict.electrod;
    }
    return (amenitiesDict as Record<string, string>)[key] ?? key;
  };

  const validateNumericField = (
    value: number,
    positiveMessage: string,
    finiteMessage: string,
    allowZero = false
  ) => {
    if (Number.isNaN(value) || (!allowZero && value <= 0)) {
      throw new Error(positiveMessage);
    }
    if (!Number.isFinite(value)) {
      throw new Error(finiteMessage);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      price: Number(formState.price),
      squareMeters: Number(formState.squareMeters),
      bedrooms: Number(formState.bedrooms),
      bathrooms: Number(formState.bathrooms),
      transactionType: Number(formState.transactionType),
      parish: Number(formState.parish),
      propertyType: formState.propertyType ? Number(formState.propertyType) : null,
      location: formState.location ? Number(formState.location) : null,
      photo: formState.photo.trim() || null,
      amenities: formState.amenities,
      locale: effectiveLocale,
    };

    try {
      if (!payload.title || payload.title.length < 4) {
        throw new Error(manageDict.validation.titleLength);
      }
      if (!payload.description || payload.description.length < 10) {
        throw new Error(manageDict.validation.descriptionLength);
      }

      validateNumericField(
        payload.price,
        manageDict.validation.pricePositive,
        manageDict.validation.priceFinite
      );
      validateNumericField(
        payload.squareMeters,
        manageDict.validation.squarePositive,
        manageDict.validation.squareFinite
      );
      validateNumericField(
        payload.bedrooms,
        manageDict.validation.bedroomsPositive,
        manageDict.validation.bedroomsFinite,
        true
      );
      validateNumericField(
        payload.bathrooms,
        manageDict.validation.bathroomsPositive,
        manageDict.validation.bathroomsFinite,
        true
      );

      if (![1, 2].includes(payload.transactionType)) {
        throw new Error(manageDict.validation.transactionType);
      }
      if (!PARISH_OPTIONS.some((option) => option.value === payload.parish)) {
        throw new Error(manageDict.validation.parish);
      }
    } catch (validationError) {
      setMessage({
        type: "error",
        text:
          validationError instanceof Error
            ? validationError.message
            : manageDict.messages.createError,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const errorMessage = typeof errorPayload?.error === "string"
          ? errorPayload.error
          : manageDict.messages.createError;
        throw new Error(errorMessage);
      }

      const created: Property = await response.json();
      setProperties((prev) => [created, ...prev]);
      resetForm();
      setMessage({ type: "success", text: manageDict.messages.createSuccess });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : manageDict.messages.createError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (propertyId: number) => {
    setMessage(null);
    setDeletingId(propertyId);
    try {
      const response = await fetch(`${apiBase}/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const errorMessage = typeof errorPayload?.error === "string"
          ? errorPayload.error
          : manageDict.messages.deleteError;
        throw new Error(errorMessage);
      }

      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
      setMessage({ type: "success", text: manageDict.messages.deleteSuccess });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : manageDict.messages.deleteError,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">{manageDict.headings.publish}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{translationBanner}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">{manageDict.form.labels.title}</Label>
              <Input
                id="title"
                value={formState.title}
                onChange={handleInputChange("title")}
                placeholder={manageDict.form.placeholders.title}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="photo">{manageDict.form.labels.photo}</Label>
              <Input
                id="photo"
                value={formState.photo}
                onChange={handleInputChange("photo")}
                placeholder={manageDict.form.placeholders.photo}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">{manageDict.form.labels.price}</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={formState.price}
                onChange={handleInputChange("price")}
                placeholder={manageDict.form.placeholders.price}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="squareMeters">{manageDict.form.labels.squareMeters}</Label>
              <Input
                id="squareMeters"
                type="number"
                min="0"
                step="1"
                value={formState.squareMeters}
                onChange={handleInputChange("squareMeters")}
                placeholder={manageDict.form.placeholders.squareMeters}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bedrooms">{manageDict.form.labels.bedrooms}</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                step="1"
                value={formState.bedrooms}
                onChange={handleInputChange("bedrooms")}
                placeholder={manageDict.form.placeholders.bedrooms}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bathrooms">{manageDict.form.labels.bathrooms}</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                step="1"
                value={formState.bathrooms}
                onChange={handleInputChange("bathrooms")}
                placeholder={manageDict.form.placeholders.bathrooms}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="transactionType">{manageDict.form.labels.transactionType}</Label>
              <select
                id="transactionType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                value={formState.transactionType}
                onChange={handleInputChange("transactionType")}
              >
                {TRANSACTION_TYPE_OPTIONS.map((option) => {
                  const label = manageDict.form.transactionTypes[String(option.value)] ?? option.label;
                  return (
                    <option key={option.value} value={option.value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="parish">{manageDict.form.labels.parish}</Label>
              <select
                id="parish"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                value={formState.parish}
                onChange={handleInputChange("parish")}
              >
                {PARISH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">{manageDict.form.labels.location}</Label>
              <select
                id="location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                value={formState.location}
                onChange={handleInputChange("location")}
              >
                <option value="">{manageDict.form.selects.sameAsParish}</option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="propertyType">{manageDict.form.labels.propertyType}</Label>
              <select
                id="propertyType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                value={formState.propertyType}
                onChange={handleInputChange("propertyType")}
              >
                <option value="">{manageDict.form.selects.selectType}</option>
                {PROPERTY_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">{manageDict.form.labels.description}</Label>
            <textarea
              id="description"
              value={formState.description}
              onChange={handleDescriptionChange}
              placeholder={manageDict.form.placeholders.description}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">{manageDict.form.labels.amenities}</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {AMENITY_OPTIONS.map((option) => (
                <label key={option.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={formState.amenities[option.key]}
                    onCheckedChange={toggleAmenity(option.key)}
                  />
                  {getAmenityLabel(option.key)}
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                message.type === "error"
                  ? "border-destructive text-destructive"
                  : "border-green-500 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
              {manageDict.buttons.reset}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? manageDict.buttons.publishing : manageDict.buttons.publish}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{manageDict.headings.table}</h2>
        {properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">{manageDict.table.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">{manageDict.table.columns.reference}</th>
                  <th className="px-3 py-2 text-left font-medium">{manageDict.table.columns.title}</th>
                  <th className="px-3 py-2 text-left font-medium">{manageDict.table.columns.price}</th>
                  <th className="px-3 py-2 text-left font-medium">{manageDict.table.columns.parish}</th>
                  <th className="px-3 py-2 text-left font-medium">{manageDict.table.columns.created}</th>
                  <th className="px-3 py-2 text-right font-medium">{manageDict.table.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((property) => {
                  const localizedTitle = property[propertyTitleKey] ?? property.title_en;
                  return (
                    <tr key={property.id}>
                      <td className="px-3 py-2 font-mono text-xs uppercase">{property.id}</td>
                      <td className="px-3 py-2">{localizedTitle}</td>
                      <td className="px-3 py-2">{currencyFormatter.format(property.price)}</td>
                      <td className="px-3 py-2">
                        {PARISH_OPTIONS.find((option) => option.value === property.parish)?.label ?? property.parish}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {property.created_at
                          ? new Date(property.created_at).toLocaleString(currencyLocaleMap[effectiveLocale] ?? "en-GB")
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(property.id)}
                          disabled={deletingId === property.id}
                        >
                          {deletingId === property.id
                            ? manageDict.buttons.deleting
                            : manageDict.buttons.delete}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}


