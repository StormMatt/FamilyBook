import type { Holiday } from "@/types/holiday";
import type { FilterParams } from "@/types/filters";
import { applyFilters } from "./filters";
import holidaysData from "./data/holidays.json";

const holidays = holidaysData as Holiday[];

export async function getAllHolidays(): Promise<Holiday[]> {
  return holidays;
}

export async function getHolidayBySlug(slug: string): Promise<Holiday | undefined> {
  return holidays.find((h) => h.slug === slug);
}

export async function getFeaturedHolidays(limit = 6): Promise<Holiday[]> {
  return holidays.filter((h) => h.isFeatured).slice(0, limit);
}

export async function getSpecialOffers(limit = 4): Promise<Holiday[]> {
  return holidays.filter((h) => h.isSpecialOffer).slice(0, limit);
}

export async function filterHolidays(
  params: FilterParams
): Promise<{ holidays: Holiday[]; total: number }> {
  const filtered = applyFilters(holidays, params);
  return { holidays: filtered, total: filtered.length };
}
