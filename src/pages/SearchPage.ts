import type { Profile } from '../types/Profile';
import { SearchBar } from '../components/SearchBar';
import { ProfileCard } from '../components/ProfileCard';
import { fetchProfileSearch } from '../api/Profile';
import { showToast } from '../components/Toast';
import { router } from '../router/router';

function getSearchQuery(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

export async function SearchPage(): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.className = 'w-full max-w-6xl mx-auto px-4 md:px-8 py-12';

  const backButton = document.createElement('a');
  backButton.href = '/';
  backButton.textContent = '← Back to Auctions';
  backButton.className =
    'text-navy font-bold hover:underline mb-8 inline-block';
  backButton.setAttribute('data-link', '');

  backButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.history.pushState({}, '', '/');
    router();
  });

  container.appendChild(backButton);

  const header = document.createElement('header');
  header.className =
    'max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12';

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'flex flex-col gap-2';

  const title = document.createElement('h1');
  title.className =
    'text-3xl md:text-4xl font-sans font-extrabold text-navy tracking-tight';
  title.textContent = 'Search Profiles';

  const text = document.createElement('p');
  text.className = 'text-gray-500 text-lg max-w-md';
  text.textContent =
    'Discover and connect with other auctioneers in the community.';

  titleWrapper.append(title, text);

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'w-full max-w-md md:w-80';

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
      }, 800);
    },
    () => {
      const params = new URLSearchParams(window.location.search);
      window.history.pushState({}, '', `/search?${params.toString()}`);
      window.dispatchEvent(new Event('popstate'));
    },
    getSearchQuery(),
    '',
    'Search profiles...',
  );

  searchWrapper.append(searchBar);

  header.append(titleWrapper, searchWrapper);

  const gridContainer = document.createElement('div');
  gridContainer.id = 'listing-grid';
  gridContainer.className = 'mt-12';

  container.append(header, gridContainer);

  fetchAndRender();

  return container;

  async function fetchAndRender() {
    const searchQuery = getSearchQuery();

    gridContainer.replaceChildren();

    const skeletonGrid = document.createElement('div');
    skeletonGrid.className =
      'skeleton-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

    for (let i = 0; i < 6; i++) {
      const bone = document.createElement('div');
      bone.className = 'w-full h-48 bg-gray-200 animate-pulse rounded-xl';
      skeletonGrid.appendChild(bone);
    }
    gridContainer.appendChild(skeletonGrid);
    try {
      const response = await fetchProfileSearch(searchQuery);
      const profiles: Profile[] = response?.data || [];

      gridContainer.replaceChildren();

      if (profiles.length === 0) {
        const emptyWrapper = document.createElement('div');
        emptyWrapper.className = 'flex flex-col items-center gap-4 py-20';
        const emptyMsg = document.createElement('p');
        emptyMsg.className =
          'col-span-full text-gray-500 font-sans text-center py-12';
        emptyMsg.textContent = searchQuery
          ? `We couldn't find any profiles matching "${searchQuery}". Try a different name or keyword.`
          : 'Search for a profile by name or bio.';

        emptyWrapper.append(emptyMsg);

        if (searchQuery) {
          const clearBtn = document.createElement('button');
          clearBtn.className =
            'text-navy font-bold hover:underline cursor-pointer';
          clearBtn.textContent = '← Clear search and view all profiles';

          clearBtn.addEventListener('click', () => {
            window.history.pushState({}, '', '/search');
            const searchInput = document.querySelector(
              'input[type="text"]',
            ) as HTMLInputElement;
            if (searchInput) {
              searchInput.value = '';
            }
            router();
          });
          emptyWrapper.append(clearBtn);
        }
        gridContainer.appendChild(emptyWrapper);
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
}
