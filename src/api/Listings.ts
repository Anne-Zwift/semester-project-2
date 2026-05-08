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

// Search by title and description
export async function fetchListingsSearch(
  query: string,
  activeOnly = true,
): Promise<ApiResponse<Listing[]> | null> {
  const params = new URLSearchParams({
    q: query,
    _seller: 'true',
    _bids: 'true',
    ...(activeOnly && { _active: 'true' }),
  });

  const response = await get<Listing[]>(`auction/listings/search?${params}`);

  if (!response?.data) return response;

  const now = new Date().getTime();
  response.data = response.data.filter(
    (item) => new Date(item.endsAt).getTime() > now,
  );

  return response;
}

// Filter by tag and optionally active
export async function fetchListingsByTag(
  tag: string,
  activeOnly = true,
): Promise<ApiResponse<Listing[]> | null> {
  const params = new URLSearchParams({
    _tag: tag,
    _seller: 'true',
    _bids: 'true',
    ...(activeOnly && { _active: 'true' }),
  });
  const response = await get<Listing[]>(`auction/listings?${params}`);

  if (!response?.data) return response;

  const now = new Date().getTime();
  response.data = response.data.filter(
    (item) => new Date(item.endsAt).getTime() > now,
  );

  return response;
}

export async function fetchPopularListings(): Promise<ApiResponse<
  Listing[]
> | null> {
  return get<Listing[]>(
    `${API_ENDPOINTS.LISTINGS}?limit=100&_active=true&_bids=true&_seller=true`,
  );
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
