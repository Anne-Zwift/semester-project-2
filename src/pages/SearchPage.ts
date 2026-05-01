import type { Profile } from '../types/Profile';
import { SearchBar } from '../components/SearchBar';
import { ProfileCard } from '../components/ProfileCard';
import { fetchProfileSearch } from '../api/Profile';
import { showToast } from '../components/Toast';

function getSearchQuery(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

export async function SearchPage(): Promise<HTMLElement> {
  const container = document.createElement('div');

  const header = document.createElement('header');
  header.className =
    'flex flex-col md:flex-row justify-between items-center mb-4 gap-4 pb-4 border-b border-gray-100';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-sans font-bold text-navy';
  title.textContent = 'Search Profiles';

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
        } else {
          params.delete('q');
        }

        window.history.pushState({}, '', `/search?${params.toString()}`);
        window.dispatchEvent(new Event('popstate'));
      }, 400);
    },
    () => {
      const params = new URLSearchParams(window.location.search);
      window.history.pushState({}, '', `/search?${params.toString()}`);
      window.dispatchEvent(new Event('popstate'));
    },
    getSearchQuery(),
  );

  header.append(title, searchBar);
  container.append(header, gridContainer);

  async function fetchAndRender() {
    const searchQuery = getSearchQuery();

    gridContainer.replaceChildren();

    const skeletonGrid = document.createElement('div');
    skeletonGrid.className =
      'skeleton-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    gridContainer.appendChild(skeletonGrid);

    try {
      const response = await fetchProfileSearch(searchQuery);
      const profiles: Profile[] = response?.data || [];

      gridContainer.replaceChildren();

      if (profiles.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-gray-500 font-sans text-center py-20';
        emptyMsg.textContent = searchQuery
          ? `No profiles found for "${searchQuery}"`
          : 'Search for a profile by name or bio.';
        gridContainer.appendChild(emptyMsg);
        return;
      }

      const grid = document.createElement('div');
      grid.className =
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6';
      profiles.forEach((profile) => {
        grid.appendChild(ProfileCard(profile));
      });
      gridContainer.appendChild(grid);
    } catch (_error) {
      showToast('Failed to load profiles. Please try again later', 'error');
      gridContainer.replaceChildren();

      const errorMsg = document.createElement('p');
      errorMsg.textContent = 'Failed to load profiles. Please try again.';
      errorMsg.className = 'text-center text-red-500 py-10';
      gridContainer.appendChild(errorMsg);
    }
  }
  fetchAndRender();
  return container;
}
