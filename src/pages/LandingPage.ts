import { get } from '../api/Client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Listing } from '../types/Listing';
import { ListingCard } from '../components/ListingCard';
import { SearchBar } from '../components/SearchBar';

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

  const header = document.createElement('header');
  header.className =
    'flex flex-col md:flex-row justify-between items-center mb-10 gap-4';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-sans font-bold text-navy';
  title.textContent = 'Active Auctions';

  const gridContainer = document.createElement('div');
  gridContainer.id = 'listing-grid';

  let allListings: Listing[] = [];

  const searchBar = SearchBar((term) => {
    const filtered = allListings.filter(
      (item) =>
        item.title.toLocaleLowerCase().includes(term) ||
        item.tags?.some((tag) => tag.toLocaleLowerCase().includes(term)) ||
        (item.description || '').toLocaleLowerCase().includes(term),
    );
    renderListings(filtered, gridContainer);
  });

  header.append(title, searchBar);
  container.append(header, gridContainer);

  const loader = document.createElement('p');
  loader.textContent = 'Loading auctions...';
  loader.className = 'text-center py-10 font-sans';
  gridContainer.appendChild(loader);

  try {
    const response = await get<Listing[]>(
      `${API_ENDPOINTS.LISTINGS}?limit=12&_seller=true&_bids=true`,
    );

    allListings = response?.data || [];
    renderListings(allListings, gridContainer);
  } catch (error) {
    console.error(error);
    container.replaceChildren();
    const errorMsg = document.createElement('p');
    errorMsg.className =
      'mx-auto text-center justify-center items-center w-1/2 text-white py-4 px-4 bg-error rounded-lg';
    errorMsg.textContent = 'Failed to load auctions. Please try again later.';
    gridContainer.appendChild(errorMsg);
  }
}

function renderListings(listings: Listing[], gridTarget: HTMLElement) {
  gridTarget.replaceChildren();

  if (listings.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-gray-500 text-center py-10';
    emptyMsg.textContent = 'No auctions found.';
    gridTarget.appendChild(emptyMsg);
    return;
  }

  const grid = document.createElement('div');
  grid.className =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6';

  listings.forEach((item) => {
    grid.appendChild(ListingCard(item));
  });
  gridTarget.appendChild(grid);
}
