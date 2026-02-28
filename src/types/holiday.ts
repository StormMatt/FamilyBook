export type HolidayType = "ski" | "beach" | "city" | "summer";

export type BoardBasis =
  | "room-only"
  | "bed-and-breakfast"
  | "half-board"
  | "full-board"
  | "all-inclusive";

export interface HolidayImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  maxOccupancy: number;
  pricePerPersonPerNight: number;
  boardBasis: BoardBasis;
  amenities: string[];
}

export interface DepartureOption {
  airport: string;
  airportCode: string;
  flightDurationMinutes: number;
  availableDates: string[];
  priceAdultReturn: number;
}

export interface IncludedItem {
  icon: string;
  label: string;
  detail?: string;
}

export interface Review {
  author: string;
  date: string;
  rating: number;
  title: string;
  body: string;
}

export interface PricingTier {
  label: string;
  basePrice: number;
}

export interface Holiday {
  id: string;
  slug: string;
  name: string;
  type: HolidayType;
  tagline: string;
  description: string;
  destination: {
    resort: string;
    country: string;
    region: string;
    countryCode: string;
  };
  images: HolidayImage[];
  durationNights: number;
  rooms: Room[];
  departures: DepartureOption[];
  included: IncludedItem[];
  notIncluded: string[];
  pricing: {
    fromPrice: number;
    pricingTiers: PricingTier[];
    deposit: number;
    depositType: "fixed" | "percentage";
  };
  rating: {
    average: number;
    count: number;
  };
  reviews: Review[];
  tags: string[];
  isFeatured: boolean;
  isSpecialOffer: boolean;
  specialOfferLabel?: string;
  originalFromPrice?: number;
  highlights: string[];
}
