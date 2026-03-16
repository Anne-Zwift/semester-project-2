import type { Profile } from './Profile';

export interface AuthResponse {
  data: Profile & {
    accessToken: string;
  };
}

export interface AuthState {
  user: Profile | null;
  accessToken: string | null;
  apiKey?: string | null;
  isLoggedIn: boolean;
}
