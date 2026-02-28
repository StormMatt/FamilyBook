"use client";

import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { BookingState, BookingAction } from "@/types/booking";

const initialState: BookingState = {
  currentStep: 1,
  holidaySlug: "",
  selectedRoomId: null,
  selectedAirportCode: null,
  selectedDate: null,
  adultCount: 2,
  childCount: 0,
  selectedExtras: [],
  guests: [],
  contactInfo: {},
  paymentInfo: {},
  agreedToTerms: false,
  bookingReference: null,
  totalPrice: 0,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "SET_ROOM":
      return { ...state, selectedRoomId: action.roomId };
    case "SET_AIRPORT":
      return { ...state, selectedAirportCode: action.airportCode };
    case "SET_DATE":
      return { ...state, selectedDate: action.date };
    case "SET_ADULT_COUNT":
      return { ...state, adultCount: action.count };
    case "SET_CHILD_COUNT":
      return { ...state, childCount: action.count };
    case "ADD_EXTRA": {
      const existing = state.selectedExtras.find((e) => e.extraId === action.extra.extraId);
      if (existing) {
        return {
          ...state,
          selectedExtras: state.selectedExtras.map((e) =>
            e.extraId === action.extra.extraId ? action.extra : e
          ),
        };
      }
      return { ...state, selectedExtras: [...state.selectedExtras, action.extra] };
    }
    case "REMOVE_EXTRA":
      return {
        ...state,
        selectedExtras: state.selectedExtras.filter((e) => e.extraId !== action.extraId),
      };
    case "CLEAR_EXTRAS":
      return { ...state, selectedExtras: [] };
    case "UPDATE_GUEST": {
      const guests = [...state.guests];
      guests[action.index] = { ...guests[action.index], ...action.guest };
      return { ...state, guests };
    }
    case "SET_CONTACT":
      return { ...state, contactInfo: { ...state.contactInfo, ...action.contact } };
    case "SET_PAYMENT":
      return { ...state, paymentInfo: { ...state.paymentInfo, ...action.payment } };
    case "SET_AGREED_TO_TERMS":
      return { ...state, agreedToTerms: action.agreed };
    case "SET_TOTAL_PRICE":
      return { ...state, totalPrice: action.price };
    case "CONFIRM_BOOKING":
      return { ...state, bookingReference: action.reference };
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: Dispatch<BookingAction>;
} | null>(null);

export function BookingProvider({
  children,
  initialSlug,
  initialDate,
  initialAirport,
}: {
  children: React.ReactNode;
  initialSlug: string;
  initialDate?: string;
  initialAirport?: string;
}) {
  const [state, dispatch] = useReducer(bookingReducer, {
    ...initialState,
    holidaySlug: initialSlug,
    selectedDate: initialDate ?? null,
    selectedAirportCode: initialAirport ?? null,
  });

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
