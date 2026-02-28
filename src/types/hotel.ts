export interface HotelImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface HotelAmenity {
  icon: string;
  label: string;
  category: "pool" | "dining" | "wellness" | "sport" | "kids" | "connectivity" | "general";
}

export interface HotelLocation {
  address: string;
  resort: string;
  country: string;
  countryCode: string;
  mapLat: number;
  mapLng: number;
  nearbyAttractions: string[];
  distanceToSlopes?: string;
  distanceToBeach?: string;
  distanceToCenter: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  description: string;
  maxOccupancy: number;
  sizeSqm: number;
  boardBasis: string;
  images: string[];
  highlights: string[];
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  starRating: number;
  tagline: string;
  description: string;
  holidaySlugs: string[];
  images: HotelImage[];
  amenities: HotelAmenity[];
  rooms: HotelRoom[];
  location: HotelLocation;
  checkInTime: string;
  checkOutTime: string;
  rating: {
    average: number;
    count: number;
    breakdown: { label: string; score: number }[];
  };
  highlights: string[];
  policies: string[];
}
