import type { Extra } from "@/types/extras";
import extrasData from "./data/extras.json";

const extras = extrasData as Extra[];

export async function getAllExtras(): Promise<Extra[]> {
  return extras;
}

export async function getExtrasByType(holidayType: string): Promise<Extra[]> {
  return extras.filter(
    (e) => e.compatibleTypes.includes(holidayType) || e.compatibleTypes.includes("*")
  );
}

export async function getExtraById(id: string): Promise<Extra | undefined> {
  return extras.find((e) => e.id === id);
}
