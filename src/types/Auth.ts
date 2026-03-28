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

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayLoad {
  email: string;
  password: string;
}
