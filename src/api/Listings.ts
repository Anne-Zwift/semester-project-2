import type { ApiResponse } from '../types/Api';
import type { Bid, Listing } from '../types/Listing';
import { API_ENDPOINTS } from '../utils/constants';
import { del, get, post, put } from './Client';

export async function fetchListingId(
  id: string,
): Promise<ApiResponse<Listing> | null> {
  return get<Listing>(
    `${API_ENDPOINTS.LISTINGS}/${id}?_seller=true&_bids=true`,
  );
}

// Search for listings by their title or description properties
export async function fetchListingsSearch(query: string): Promise<ApiResponse<Listing[]> | null> {
  return get<Listing[]>(`auction/listings/search?q=${query}`);
}

export async function placeBid(
  id: string,
  amount: number,
): Promise<ApiResponse<Bid> | null> {
  return post<Bid>(`${API_ENDPOINTS.LISTINGS}/${id}/bids`, { amount });
}

export async function createListing(
  data: Partial<Listing>,
): Promise<ApiResponse<Listing> | null> {
  return post<Listing>(API_ENDPOINTS.LISTINGS, data);
}

export async function updateListing(
  id: string,
  data: Partial<Listing>,
): Promise<ApiResponse<Listing> | null> {
  return put<Listing>(`${API_ENDPOINTS.LISTINGS}/${id}`, data);
}

export async function deleteListing(
  id: string,
): Promise<ApiResponse<void> | null> {
  return del<void>(`${API_ENDPOINTS.LISTINGS}/${id}`);
}
