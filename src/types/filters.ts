import type { HolidayType, BoardBasis } from "./holiday";

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "duration-asc"
  | "featured";

export interface FilterParams {
  type?: HolidayType[];
  destination?: string[];
  departureAirport?: string[];
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  boardBasis?: BoardBasis[];
  sort?: SortOption;
  q?: string;
}
