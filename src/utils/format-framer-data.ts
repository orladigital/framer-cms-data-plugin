import { CollectionItem } from "framer-plugin";

export function formatFramerCmsData(item: CollectionItem): Record<string, any> {
  const result: Record<string, any> = {};
  const slugByLocale = JSON.stringify(item.slugByLocale);
  for (const key in item.fieldData) {
    const value = item.fieldData[key];

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      result[key] = value;
    } else if (value instanceof Date) {
      result[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      result[key] = value.map((v) =>
        typeof v === "object" ? JSON.stringify(v) : v
      );
    } else {
      result[key] = JSON.stringify(value);
    }
  }

  return { id: item.id, itemData: result, slug: item.slug, slugByLocale };
}
