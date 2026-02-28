import type { SelectedExtra } from "./extras";

export interface GuestInfo {
  title: "Mr" | "Mrs" | "Ms" | "Dr";
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  isLeadGuest: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
}

export interface PaymentInfo {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface BookingState {
  currentStep: BookingStep;
  holidaySlug: string;
  selectedRoomId: string | null;
  selectedAirportCode: string | null;
  selectedDate: string | null;
  adultCount: number;
  childCount: number;
  selectedExtras: SelectedExtra[];
  guests: Partial<GuestInfo>[];
  contactInfo: Partial<ContactInfo>;
  paymentInfo: Partial<PaymentInfo>;
  agreedToTerms: boolean;
  bookingReference: string | null;
  totalPrice: number;
}

export type BookingAction =
  | { type: "SET_STEP"; step: BookingStep }
  | { type: "SET_ROOM"; roomId: string }
  | { type: "SET_AIRPORT"; airportCode: string }
  | { type: "SET_DATE"; date: string }
  | { type: "SET_ADULT_COUNT"; count: number }
  | { type: "SET_CHILD_COUNT"; count: number }
  | { type: "ADD_EXTRA"; extra: SelectedExtra }
  | { type: "REMOVE_EXTRA"; extraId: string }
  | { type: "CLEAR_EXTRAS" }
  | { type: "UPDATE_GUEST"; index: number; guest: Partial<GuestInfo> }
  | { type: "SET_CONTACT"; contact: Partial<ContactInfo> }
  | { type: "SET_PAYMENT"; payment: Partial<PaymentInfo> }
  | { type: "SET_AGREED_TO_TERMS"; agreed: boolean }
  | { type: "SET_TOTAL_PRICE"; price: number }
  | { type: "CONFIRM_BOOKING"; reference: string };

export interface SavedBooking {
  reference: string;
  holidaySlug: string;
  holidayName: string;
  destination: string;
  selectedDate: string;
  selectedAirportCode: string;
  selectedRoomId: string;
  adultCount: number;
  childCount: number;
  selectedExtras: SelectedExtra[];
  guests: Partial<GuestInfo>[];
  contactInfo: Partial<ContactInfo>;
  totalPrice: number;
  bookedAt: string;
  durationNights: number;
  hotelName?: string;
  hotelSlug?: string;
}
