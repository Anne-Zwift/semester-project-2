import { get } from './Client';
import type { Profile } from '../types/Profile';
import type { ApiResponse } from '../types/Api';
import { store } from '../utils/store';

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
