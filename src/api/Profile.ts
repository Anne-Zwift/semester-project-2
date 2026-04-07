import { get } from './Client';
import type { Profile } from '../types/Profile';
import type { ApiResponse } from '../types/Api';
import { store } from '../utils/store';
import type { Listing, Bid } from '../types/Listing';
import { put } from './Client';

export interface UserBid extends Bid {
  listing?: Listing;
}

export async function fetchProfile(): Promise<ApiResponse<Profile> | null> {
  const user = store.getUser();

  if (!user?.name) {
    throw new Error('User not found');
  }

  const response = await get<Profile>(`auction/profiles/${user.name}`);

  if (!response?.data) {
    throw new Error('Failed to fetch profile');
  }
  return response;
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
  return get<Listing[]>(`auction/profiles/${name}/wins`);
}
/* // search for profiles by name or bio properties
export async function fetchProfileSearch(query: string): Promise<ApiResponse<Profile[]> | null> {
  return get<Profile[]>(`auction/profiles/search?q=${query}`);
} */

export async function updateProfile(data: {
  banner?: { url: string; alt?: string };
  avatar?: { url: string; alt?: string };
  bio?: string;
}): Promise<ApiResponse<Profile> | null> {
  const name = store.getUser()?.name;
  if (!name) return null;

  return await put<Profile>(`/auction/profiles/${name}`, data);
}
