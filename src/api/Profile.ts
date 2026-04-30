import { get } from './Client';
import type { Profile } from '../types/Profile';
import type { ApiResponse } from '../types/Api';

import type { Listing, Bid } from '../types/Listing';
import { put } from './Client';

export interface UserBid extends Bid {
  listing?: Listing;
}

export async function fetchProfile(
  name: string,
): Promise<ApiResponse<Profile> | null> {
  if (!name) throw new Error('Name is required');
  return await get<Profile>(`auction/profiles/${name}`);
}

export async function fetchProfileListings(
  name: string,
): Promise<ApiResponse<Listing[]> | null> {
  return get<Listing[]>(`auction/profiles/${name}/listings?_bids=true`);
}

export async function fetchProfileBids(
  name: string,
): Promise<ApiResponse<UserBid[]> | null> {
  return get<UserBid[]>(`auction/profiles/${name}/bids?_listings=true`);
}

export async function fetchProfileWins(
  name: string,
): Promise<ApiResponse<Listing[]> | null> {
  return get<Listing[]>(`auction/profiles/${name}/wins?_listings=true`);
}

// Search for profiles by name or bio properties
export async function fetchProfileSearch(
  query: string,
): Promise<ApiResponse<Profile[]> | null> {
  if (!query.trim()) return null;
  const params = new URLSearchParams({ q: query });
  return get<Profile[]>(`auction/profiles/search?${params}`);
}

export async function updateProfile(
  name: string,
  data: {
    banner?: { url: string; alt?: string };
    avatar?: { url: string; alt?: string };
    bio?: string;
  },
): Promise<ApiResponse<Profile> | null> {
  if (!name) return null;

  return await put<Profile>(`/auction/profiles/${name}`, data);
}
