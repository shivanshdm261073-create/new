export interface HotelListing {
  id: string;
  property: string;
  website: string;
  websiteUrl: string;
  area: string;
  roomSetup: string;
  maxGuests: number;
  pricePerNight: number;
  totalPrice: number;
  taxesIncluded: boolean;
  taxAmount?: number;
  privateBeachProof: string;
  cancellationPolicy: string;
  link: string;
  currency: string;
  notes?: string;
  available: boolean;
  starRating?: number;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  maxBudget: number;
  requirePrivateBeach: boolean;
}

export type SortField = 'totalPrice' | 'property' | 'website' | 'area';
export type SortDirection = 'asc' | 'desc';
