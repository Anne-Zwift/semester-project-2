import type { Media } from './Media';
import type { Listing, Bid } from './Listing';

export interface ProfileCount {
  listings: number;
  wins: number;
}

export interface Profile {
  name: string;
  email: string;
  bio?: string | null;
  banner?: Media | null;
  avatar?: Media | null;
  credits: number;
  wins?: Listing[];
  bids?: Bid[];
  _count?: ProfileCount;
  venueManager?: boolean;
}
