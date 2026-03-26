import { get } from '../api/Client';
import { API_ENDPOINTS } from '../utils/constants';
import type { Listing } from '../types/Listing';
import { CountdownTimer } from '../components/CountdownTimer';
import { BidHistory } from '../components/BidHistory';
import { router } from '../router/router';

/**Renders the main Details Page structure with img and smaller image variants.
 * @async function.
 * @returns {Promise<void>} the main container for the page content.
 */

export async function DetailsPage(): Promise<HTMLElement> {
  const container = document.createElement('div');

  const loader = document.createElement('p');
  loader.textContent = 'Loading listing...';
  loader.className = 'min-h-[300px] text-center py-10';
  container.appendChild(loader);

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    container.textContent = 'Listing not found.';
    return container;
  }

  try {
    const response = await get<Listing>(
      `${API_ENDPOINTS.LISTINGS}/${id}?_seller=true&_bids=true`,
    );
    const item = response?.data;

    if (!item) {
      container.textContent = 'Listing data is missing.';
      return container;
    }

    const pageWrapper = document.createElement('div');
    pageWrapper.className =
      'max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10';

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'flex flex-col gap-4';

    const backButton = document.createElement('a');
    backButton.textContent = 'Back to Auction';
    backButton.className = 'button-primary w-48 cursor-pointer';

    backButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.history.pushState({}, '', '/');
      router();
    });

    const infoContainer = document.createElement('div');
    infoContainer.className = 'flex flex-col gap-6';

    const title = document.createElement('h1');
    title.className = 'text-3xl font-sans font-bold text-navy tracking-tight';
    title.textContent = item.title;

    const description = document.createElement('p');
    description.className = 'font-sans text-gray-600 tracking-wide italic';
    description.textContent = item.description || 'No description provided';

    const timer = CountdownTimer(item.endsAt, 'details');

    const history = BidHistory(item.bids);

    const mainImg = document.createElement('img');
    mainImg.src =
      item.media?.[0]?.url || 'https://placehold.co/600x400?text=No+Image';
    mainImg.alt = item.title;
    mainImg.className =
      'w-full aspect-video object-cover rounded-2xl shadow-md';
    galleryContainer.appendChild(mainImg);

    if (item.media?.length) {
      const thumbRow = document.createElement('div');
      thumbRow.className = 'flex gap-2 overflow-x-auto';

      item.media.forEach((imgObj) => {
        const thumb = document.createElement('img');
        thumb.src = imgObj.url;
        thumb.alt = item.title;
        thumb.className =
          'w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-navy transition-all';

        thumb.addEventListener('click', () => {
          mainImg.src = imgObj.url;
        });

        thumbRow.appendChild(thumb);
      });

      galleryContainer.appendChild(thumbRow);
    }
    infoContainer.append(backButton, title, timer, description, history);
    pageWrapper.appendChild(galleryContainer);
    pageWrapper.appendChild(infoContainer);
    container.replaceChildren(pageWrapper);
  } catch (error) {
    console.error('The API call failed:', error);
    container.textContent = "Oops! We couldn't find that auction.";
  }
  return container;
}
