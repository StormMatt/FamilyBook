import type { Holiday } from "@/types/holiday";
import type { FilterParams, SortOption } from "@/types/filters";

export function applyFilters(holidays: Holiday[], params: FilterParams): Holiday[] {
  let result = [...holidays];

  if (params.type && params.type.length > 0) {
    result = result.filter((h) => params.type!.includes(h.type));
  }

  if (params.destination && params.destination.length > 0) {
    result = result.filter((h) =>
      params.destination!.some(
        (d) =>
          h.destination.resort.toLowerCase().includes(d.toLowerCase()) ||
          h.destination.country.toLowerCase().includes(d.toLowerCase())
      )
    );
  }

  if (params.departureAirport && params.departureAirport.length > 0) {
    result = result.filter((h) =>
      h.departures.some((d) => params.departureAirport!.includes(d.airportCode))
    );
  }

  if (params.priceMin !== undefined) {
    result = result.filter((h) => h.pricing.fromPrice >= params.priceMin!);
  }

  if (params.priceMax !== undefined) {
    result = result.filter((h) => h.pricing.fromPrice <= params.priceMax!);
  }

  if (params.durationMin !== undefined) {
    result = result.filter((h) => h.durationNights >= params.durationMin!);
  }

  if (params.durationMax !== undefined) {
    result = result.filter((h) => h.durationNights <= params.durationMax!);
  }

  if (params.boardBasis && params.boardBasis.length > 0) {
    result = result.filter((h) =>
      h.rooms.some((r) => params.boardBasis!.includes(r.boardBasis))
    );
  }

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.destination.resort.toLowerCase().includes(q) ||
        h.destination.country.toLowerCase().includes(q) ||
        h.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return sortHolidays(result, params.sort ?? "featured");
}

export function sortHolidays(holidays: Holiday[], sort: SortOption): Holiday[] {
  const sorted = [...holidays];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.pricing.fromPrice - b.pricing.fromPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.pricing.fromPrice - a.pricing.fromPrice);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating.average - a.rating.average);
    case "duration-asc":
      return sorted.sort((a, b) => a.durationNights - b.durationNights);
    case "featured":
    default:
      return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

export function parseSearchParams(params: Record<string, string | string[]>): FilterParams {
  const get = (key: string) => {
    const v = params[key];
    if (!v) return undefined;
    return Array.isArray(v) ? v : [v];
  };
  const getNum = (key: string) => {
    const v = params[key];
    if (!v || Array.isArray(v)) return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  return {
    type: get("type") as FilterParams["type"],
    destination: get("destination"),
    departureAirport: get("departureAirport"),
    boardBasis: get("boardBasis") as FilterParams["boardBasis"],
    priceMin: getNum("priceMin"),
    priceMax: getNum("priceMax"),
    durationMin: getNum("durationMin"),
    durationMax: getNum("durationMax"),
    sort: (params["sort"] as FilterParams["sort"]) ?? "featured",
    q: typeof params["q"] === "string" ? params["q"] : undefined,
  };
}
