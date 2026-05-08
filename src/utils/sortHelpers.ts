import type { Listing } from '../types/Listing';

export function getMostPopularListings(
  listings: Listing[],
  limit = 6,
): Listing[] {
  return [...listings]
    .sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0))
    .slice(0, limit);
}
