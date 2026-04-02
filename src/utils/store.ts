import type { Profile } from '../types/Profile';
import type { AuthState } from '../types/Auth';
import {
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_PROFILE,
  STORAGE_KEY_API_KEY,
} from './constants';

/**
 * Application State Store.
 * A centralized singleton that manages global state including the user profile, authentication status, and access tokens.
 * Features:
 * - Stores the authentication token, API Key and profile data to localStorage.
 * - Rehydrates state automatically upon class instantiation (page refresh).
 * - Provides helper methods for retrieving credentials and user balance.
 * - Supports reactive subscriptions for UI re-rendering on state changes.
 */

type Subscriber = () => void;

class Store {
  private state: AuthState = {
    user: null,
    accessToken: null,
    isLoggedIn: false,
  };

  private subscribers: Set<Subscriber> = new Set();

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach((cb) => cb());
  }

  public saveLogin(profile: Profile, accessToken: string) {
    this.state.user = profile;
    this.state.accessToken = accessToken;
    this.state.isLoggedIn = true;

    localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));

    this.notify();
  }

  public getToken(): string | null {
    return (
      this.state.accessToken || localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN)
    );
  }

  public getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEY_API_KEY);
  }

  public getUser(): Profile | null {
    if (this.state.user) return this.state.user;

    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!savedProfile) return null;

    try {
      return JSON.parse(savedProfile);
    } catch {
      return null;
    }
  }

  public getCredits(): number {
    return this.state.user?.credits ?? 0;
  }

  constructor() {
    const savedToken = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);

    if (savedToken && savedProfile) {
      this.state.accessToken = savedToken;

      this.state.isLoggedIn = true;
      try {
        this.state.user = JSON.parse(savedProfile);
      } catch (e) {
        console.error('Failed to parse profile from storage', e);
        this.clear();
      }
    }
  }

  public clear() {
    this.state.user = null;
    this.state.accessToken = null;
    this.state.isLoggedIn = false;
    localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_API_KEY);

    this.notify();
  }
}

export const store = new Store();
