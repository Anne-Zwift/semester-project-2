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
/* export async function fetchListingsSearch(
  query: string,
): Promise<ApiResponse<Listing[]> | null> {
  return get<Listing[]>(`auction/listings/search?q=${query}`);
} */

/* export async function fetchListingsSearch(
  query: string,
): Promise<ApiResponse<Listing[]> | null> {
  const response = await get<Listing[]>(
    `auction/listings/search?q=${query}&_seller=true&_bids=true&_active=true`
  );

  if (!response?.data) return response;

  const now = new Date().getTime();
  const searchTerm = query.toLowerCase();

  response.data = response.data.filter((item) => {
    const endsAt = new Date(item.endsAt).getTime();
    const isActive = endsAt > now;

    const matchesTitle = item.title.toLowerCase().includes(searchTerm);
    const matchesTags = item.tags && item.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    );
    const matchesDesc = item.description && item.description.toLowerCase().includes(searchTerm);

  return isActive && (matchesTitle || matchesTags || matchesDesc);
  });
  return response;
} */

/* export async function fetchListingsSearch(
  query: string
): Promise<ApiResponse<Listing[]> | null> {
  const term = query.toLowerCase().trim();

  if (term.length < 2) return null;

  const params = new URLSearchParams({
    q: term,
    _active: "true",
    _seller: "true",
    _bids: "true",
  });

  const response = await get<Listing[]>(
    `auction/listings/search?${params.toString()}`
  );

  if (!response?.data) return response;

  const sorted = response.data.sort((a, b) => {
    const aTitle = (a.title || "").toLowerCase();
    const bTitle = (b.title || "").toLowerCase();

    const aStarts = aTitle.startsWith(term);
    const bStarts = bTitle.startsWith(term);

    if (aStarts !== bStarts) {
      return Number(bStarts) - Number(aStarts);
    }

    return aTitle.length - bTitle.length;
  });

  return {
    ...response,
    data: sorted,
  };
} */

// Search by title and description, a mix of ended and active
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
