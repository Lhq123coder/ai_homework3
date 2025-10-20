import { create } from 'zustand';

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  preferences: string;
  itinerary: any;
  expenses: any[];
  created_at: string;
}

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  currentTrip: null,
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  updateTrip: (id, updatedTrip) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === id ? { ...trip, ...updatedTrip } : trip
      ),
    })),
  deleteTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
    })),
}));

