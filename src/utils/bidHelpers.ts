import type { Bid } from '../types/Listing';

export function getHighestBid(bids: Bid[] = []): Bid | null {
  if (bids.length === 0) return null;
  return bids.reduce((prev, current) =>
    prev.amount > current.amount ? prev : current,
  );
}

export function getLatestBid(bids: Bid[] = []): Bid | null {
  if (bids.length === 0) return null;
  return [...bids].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
  )[0];
}
