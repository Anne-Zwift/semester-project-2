import type { ApiResponse } from '../types/Api';
import type { Bid, Listing } from '../types/Listing';
import { API_ENDPOINTS } from '../utils/constants';
import { get, post } from './Client';

export async function fetchListingId(
  id: string,
): Promise<ApiResponse<Listing> | null> {
  return get<Listing>(
    `${API_ENDPOINTS.LISTINGS}/${id}?_seller=true&_bids=true`,
  );
}

export async function placeBid(
  id: string,
  amount: number,
): Promise<ApiResponse<Bid> | null> {
  return post<Bid>(`${API_ENDPOINTS.LISTINGS}/${id}/bids`, { amount });
}
