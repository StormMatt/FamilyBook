import type { Hotel } from "@/types/hotel";
import hotelsData from "./data/hotels.json";

const hotels = hotelsData as Hotel[];

export async function getAllHotels(): Promise<Hotel[]> {
  return hotels;
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  return hotels.find((h) => h.slug === slug);
}

export async function getHotelByHolidaySlug(holidaySlug: string): Promise<Hotel | undefined> {
  return hotels.find((h) => h.holidaySlugs.includes(holidaySlug));
}

export async function getHotelsByStarRating(min: number): Promise<Hotel[]> {
  return hotels.filter((h) => h.starRating >= min);
}

export async function getHotelsByCountry(countryCode: string): Promise<Hotel[]> {
  return hotels.filter((h) => h.location.countryCode === countryCode);
}
