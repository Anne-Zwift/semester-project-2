import { get } from '../api/Client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Listing } from '../types/Listing';

/**Renders the main Auction Landing Page structure.
 * Fetches the latest auction listings (12) from the API, manages loading states, and triggers the grid rendering. Targets the '#content-area' element for DOM injection.
 * @async function.
 * @returns {Promise<void>} the main container for the page content.
 */

export async function LandingPage(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>('#content-area');

  if (!container) {
    console.error('Target container #content-area not found');
    return;
  }

  container.replaceChildren();
  const loader = document.createElement('p');
  loader.textContent = 'Loading auctions...';
  loader.className = 'text-center py-10 font-geist';
  container.appendChild(loader);

  try {
    const response = await get<Listing[]>(
      `${API_ENDPOINTS.LISTINGS}?limit=12&_seller=true&_bids=true`,
    );

    const listings = response?.data || [];

    renderListings(listings, container);
  } catch (error) {
    console.error(error);
    container.replaceChildren();
    const errorMsg = document.createElement('p');
    errorMsg.className =
      'mx-auto text-center justify-center items-center w-1/2 text-white py-4 px-4 bg-error rounded-lg';
    errorMsg.textContent = 'Failed to load auctions. Please try again later.';
    container.appendChild(errorMsg);
  }
}

function renderListings(listings: Listing[], container: HTMLElement) {
  container.replaceChildren();
  if (listings.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-gray-500 text-center py-10';
    emptyMsg.textContent = 'No auctions found.';
    container.appendChild(emptyMsg);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

  listings.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'p-4 border-(--color-navy) rounded-lg shadow-sm';
    card.textContent = item.title;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}
