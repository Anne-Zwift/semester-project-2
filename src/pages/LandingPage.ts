import { router } from '../router/router';
import { get } from '../api/Client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Listing } from '../types/Listing';
import { ListingCard } from '../components/ListingCard';
import { SearchBar } from '../components/SearchBar';
import { fetchListingsByTag, fetchListingsSearch } from '../api/Listings';
import { showToast } from '../components/Toast';
import { SkeletonCard } from '../components/SkeletonCard';
import { Carousel } from '../components/Carousel';

/**Renders the main Auction Landing Page structure.
 * Fetches the latest auction listings (12) from the API, manages loading states, and triggers the grid rendering. Targets the '#content-area' element for DOM injection.
 * @async function.
 * @returns {Promise<void>} the main container for the page content.
 */

export async function LandingPage(
  searchQuery: string = '',
  activeTag: string = '',
): Promise<HTMLElement> {
  const container = document.createElement('div');
  let allListings: Listing[] = [];
  let currentPage = 1;

  const header = document.createElement('header');
  header.className =
    'flex flex-col md:flex-row justify-between items-center mb-4 gap-4 pb-4 border-b border-gray-100';

  const popularTags = [
    'jewelry',
    'vintage',
    'art',
    'fashion',
    'electronics',
    'animal',
    'furniture',
    'chair',
    'watches',
  ];

  const tagBar = document.createElement('div');
  tagBar.className =
    'flex items-center gap-2 mt-4 mb-6 px-4 max-w-full overflow-x-auto pb-2 scrollbar-none touch-pan-x';

  popularTags.forEach((tag) => {
    tagBar.appendChild(createChip(tag, activeTag));
  });

  const title = document.createElement('h1');
  title.className =
    'text-3xl font-sans font-extrabold text-navy mt-10 md:ml-10';
  title.textContent = 'Discover Auctions';

  const divider = document.createElement('hr');
  divider.className = 'border-gray-100 my-12 mx-4 md:mx-0';

  const gridContainer = document.createElement('div');
  gridContainer.id = 'listing-grid';
  gridContainer.className = 'mx-2';

  let timeout: number;

  const searchBar = SearchBar(
    (term) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const trimmed = term.trim();
        const params = new URLSearchParams(window.location.search);

        if (trimmed.length > 0) {
          params.set('q', trimmed);
          params.delete('tag');
        } else {
          params.delete('q');
        }

        window.history.pushState({}, '', `/?${params.toString()}`);
        window.dispatchEvent(new Event('popstate'));
      }, 800);
    },
    () => {
      const params = new URLSearchParams(window.location.search);
      params.delete('tag');
      window.history.pushState({}, '', `/?${params.toString()}`);
      window.dispatchEvent(new Event('popstate'));
    },
    searchQuery,
    activeTag,
  );

  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'w-full mb-4';

  header.append(title, searchBar);
  container.append(header, tagBar, carouselContainer, gridContainer);

  if (searchQuery) {
    const input = searchBar.querySelector('input');
    input?.focus();
  }

  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.className =
    'button-primary justify-center w-48 cursor-pointer mx-auto mt-10 mb-20 hidden';
  loadMoreBtn.textContent = 'Load More Auctions';

  loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    await fetchAndRender(currentPage);
  });
  function createChip(tag: string, active: string): HTMLButtonElement {
    const chip = document.createElement('button');
    chip.className = `text-[11px] md:text-xs font-mono px-2.5 py-1 md:px-3 md:py-1.5 my-2 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
      active === tag
        ? 'bg-navy text-white border-navy shadow-xs scale-95'
        : 'bg-white border-gray-200 text-gray-600 hover:bg-navy hover:text-white hover:border-navy'
    }`;
    chip.textContent = `#${tag}`;
    chip.addEventListener('click', () => {
      const params = new URLSearchParams();
      params.set('tag', tag);
      window.history.pushState({}, '', `/?${params.toString()}`);
      window.dispatchEvent(new Event('popstate'));
    });
    return chip;
  }
  async function fetchAndRender(page: number) {
    if (page === 1) {
      carouselContainer.replaceChildren();

      const skeletonGrid = document.createElement('div');
      skeletonGrid.className =
        'skeleton-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6';

      for (let i = 0; i < 12; i++) {
        skeletonGrid.appendChild(SkeletonCard());
      }
      gridContainer.appendChild(skeletonGrid);
    }

    try {
      let response;

      if (searchQuery.trim()) {
        response = await fetchListingsSearch(searchQuery);
        loadMoreBtn.classList.add('hidden');
      } else if (activeTag.trim()) {
        response = await fetchListingsByTag(activeTag);
        loadMoreBtn.classList.add('hidden');
      } else {
        response = await get<Listing[]>(
          `${API_ENDPOINTS.LISTINGS}?limit=12&page=${page}&sort=endsAt&sortOrder=asc&_active=true&_seller=true&_bids=true`,
        );
      }

      const newListings = response?.data || [];

      if (!searchQuery && newListings.length === 12) {
        loadMoreBtn.classList.replace('hidden', 'flex');
      } else {
        loadMoreBtn.classList.replace('flex', 'hidden');
      }

      if (page === 1) {
        allListings = newListings;

        carouselContainer.replaceChildren();
        divider.remove();

        if (
          !searchQuery.trim() &&
          !activeTag.trim() &&
          allListings.length > 0
        ) {
          carouselContainer.appendChild(Carousel(allListings));
        }
        carouselContainer.after(divider);

        gridContainer.replaceChildren();

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'mt-12 mb-10 mx-4 md:mx-0 flex flex-col gap-2';

        const gridTitle = document.createElement('h2');
        gridTitle.className = 'text-2xl font-bold text-navy text-sans';

        const gridDescription = document.createElement('p');
        gridDescription.className = 'text-gray-600 text-md';

        if (searchQuery.trim()) {
          gridTitle.textContent = 'Search Results';
          gridDescription.textContent = `Showing items matching "${searchQuery}"`;

          const clearLink = document.createElement('span');
          clearLink.textContent = 'Clear search';
          clearLink.className =
            'text-navy font-bold underline cursor-pointer ml-2';
          clearLink.onclick = () => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
          };
          gridDescription.appendChild(clearLink);
        } else if (activeTag.trim()) {
          gridTitle.textContent = `Tag: #${activeTag}`;
          gridDescription.textContent = `Browsing all items categorized under this tag.`;
        } else {
          gridTitle.textContent = 'Explore All Auctions';
          gridDescription.textContent =
            'Discover unique items and place your bids today.';
        }

        titleWrapper.append(gridTitle, gridDescription);
        gridContainer.appendChild(titleWrapper);

        renderListings(
          allListings,
          gridContainer,
          true,
          searchQuery
            ? { type: 'search', query: searchQuery }
            : activeTag
              ? { type: 'tag', tag: activeTag }
              : undefined,
        );
      } else {
        allListings = [...allListings, ...newListings];
        renderListings(newListings, gridContainer, true);
      }

      const seenTags = new Set(popularTags);
      allListings.forEach((listing) => {
        listing.tags?.forEach((tag) => {
          if (!seenTags.has(tag)) {
            seenTags.add(tag);
            tagBar.appendChild(createChip(tag, activeTag));
          }
        });
      });
    } catch (_error) {
      showToast('Failed to load auctions. Please try again later', 'error');
      gridContainer.replaceChildren();
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
  context?: { type: 'search'; query: string } | { type: 'tag'; tag: string },
) {
  if (!append) {
    gridTarget.replaceChildren();
  } else {
    const loader = gridTarget.querySelector('.loader-text');
    if (loader) loader.remove();
  }

  if (listings.length === 0 && !append) {
    const emptyContainer = document.createElement('div');
    emptyContainer.className =
      'col-span-full flex flex-col items-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200';

    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'text-gray-500 font-sans mb-4';
    if (context?.type === 'search') {
      emptyMsg.textContent = `No results found for '${context.query}'`;
    } else if (context?.type === 'tag') {
      emptyMsg.textContent = `No listing found for #${context.tag}`;
    } else {
      emptyMsg.textContent = 'No active auctions available.';
    }

    const clearBtn = document.createElement('button');
    clearBtn.className = 'text-navy font-bold hover:underline cursor-pointer';
    clearBtn.textContent = '← Clear search and view all auctions';

    clearBtn.addEventListener('click', () => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
      router();
    });

    emptyContainer.append(emptyMsg, clearBtn);
    gridTarget.appendChild(emptyContainer);
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
