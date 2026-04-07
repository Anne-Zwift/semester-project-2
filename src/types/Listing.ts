import type { Media } from './Media';
import type { Profile } from './Profile';

export interface Bid {
  id: string;
  amount: number;
  bidder: Profile;
  created: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  media: Media[];
  created: string;
  updated: string;
  endsAt: string;
  seller?: Profile;
  bids?: Bid[];
  _count?: {
    bids: number;
  };
}

export interface UserBid extends Bid {
  listing?: Listing;
}
