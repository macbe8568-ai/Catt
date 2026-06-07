export interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  iconName: string;
  details: string[];
}

export interface CateringItem {
  id: string;
  name: string;
  category: "Welcome Drinks" | "Starters" | "Main Course" | "Desserts" | "Live Counters & Stalls";
  description: string;
  isPopular?: boolean;
}

export interface CateringPackage {
  id: string;
  name: string;
  pricePerPlate: number;
  description: string;
  includes: string[];
  itemsExample: string[];
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  guestCount: number;
  selectedPackageId: string;
  selectedServices: string[]; // service ids
  customCateringItems: string[]; // catering item ids
  additionalNotes?: string;
  estimatedTotal: number;
  createdAt: string;
  status: "Pending Approval" | "Confirmed" | "Completed";
}

export interface PortfolioItem {
  id: string;
  category: "All" | "Mandap & Decor" | "Catering Feast" | "Royal Reception" | "Traditional Rituals";
  title: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  relationship: string; // e.g. "Bride", "Groom", "Father of the Bride"
  date: string;
  location: string;
}
