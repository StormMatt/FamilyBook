export type ExtraCategory = "insurance" | "transfer" | "sport" | "upgrade" | "dining";

export interface Extra {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ExtraCategory;
  icon: string;
  pricePerPerson: number;
  priceType: "per-person" | "per-booking";
  isRecommended: boolean;
  compatibleTypes: string[];
}

export interface SelectedExtra {
  extraId: string;
  quantity: number;
  totalPrice: number;
}
