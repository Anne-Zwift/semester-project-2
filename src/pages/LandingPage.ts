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

export async function LandingPage(): Promise<HTMLElement> {
  const container = document.createElement('div');
  let allListings: Listing[] = [];
  let currentPage = 1;

  const header = document.createElement('header');
  header.className =
    'flex flex-col md:flex-row justify-between items-center mb-10 gap-4';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-sans font-bold text-navy';
  title.textContent = 'Active Auctions';

  const gridContainer = document.createElement('div');
  gridContainer.id = 'listing-grid';

  const searchBar = SearchBar((term) => {
    const filtered = allListings.filter(
      (item) =>
        item.title.toLocaleLowerCase().includes(term) ||
        item.tags?.some((tag) => tag.toLocaleLowerCase().includes(term)) ||
        (item.description || '').toLocaleLowerCase().includes(term),
    );
    renderListings(filtered, gridContainer, false);
    loadMoreBtn.classList.add('hidden');
  });

  header.append(title, searchBar);
  container.append(header, gridContainer);

  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.className =
    'button-primary justify-center w-48 cursor-pointer mx-auto mt-10 mb-20 hidden';
  loadMoreBtn.textContent = 'Load More Auctions';

  loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    await fetchAndRender(currentPage);
  });

  async function fetchAndRender(page: number) {
    if (page === 1) {
      const loader = document.createElement('p');
      loader.textContent = 'Loading auctions...';
      loader.className = 'text-center py-10 font-sans loader-text';
      gridContainer.appendChild(loader);
    }

    try {
      const response = await get<Listing[]>(
        `${API_ENDPOINTS.LISTINGS}?limit=12&page=${page}&sort=endsAt&sortOrder=asc&_active=true&_seller=true&_bids=true`,
      );

      const newListings = response?.data || [];

      if (newListings.length === 12) {
        loadMoreBtn.classList.remove('hidden');
        loadMoreBtn.classList.add('flex');
      } else {
        loadMoreBtn.classList.add('hidden');
        loadMoreBtn.classList.remove('flex');
      }

      if (page === 1) {
        allListings = newListings;
        renderListings(allListings, gridContainer, false);
      } else {
        allListings = [...allListings, ...newListings];
        renderListings(newListings, gridContainer, true);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = document.createElement('p');
      errorMsg.className =
        'mx-auto text-center justify-center items-center w-1/2 text-white py-4 px-4 bg-error rounded-lg';
      errorMsg.textContent = 'Failed to load auctions. Please try again later.';
      gridContainer.replaceChildren(errorMsg);
      loadMoreBtn.classList.add('hidden');
    }
  }

  fetchAndRender(currentPage);
  container.append(loadMoreBtn);
  return container;
}

function renderListings(
  listings: Listing[],
  gridTarget: HTMLElement,
  append: boolean,
) {
  if (!append) {
    gridTarget.replaceChildren();
  } else {
    const loader = gridTarget.querySelector('.loader-text');
    if (loader) loader.remove();
  }

  if (listings.length === 0 && !append) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-gray-500 text-center py-10';
    emptyMsg.textContent = 'No auctions found.';
    gridTarget.appendChild(emptyMsg);
    return;
  }

  let grid = gridTarget.querySelector('.listing-grid-inner');
  if (!grid) {
    grid = document.createElement('div');
    grid.className =
      'listing-grid-inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6';
    gridTarget.appendChild(grid);
  }

  listings.forEach((item) => {
    grid!.appendChild(ListingCard(item));
  });
}
