import type { Listing } from '../types/Listing';
import { formatStaticDate } from '../utils/dateFormatter';
import { getHighestBid } from '../utils/bidHelpers';
import { CountdownTimer } from './CountdownTimer';
import { store } from '../utils/store';

export function ListingCard(item: Listing): HTMLElement {
  const isLoggedIn = !!store.getToken();
  const card = document.createElement('article');
  card.className =
    'flex flex-col h-full justify-between bg-white rounded-xl shadow-md overflow-hidden border-gray-200 hover:shadow-lg transition-shadow';

  const imageContainer = document.createElement('div');
  imageContainer.className =
    'relative aspect-square w-full bg-cyan-100 overflow-hidden';

  const img = document.createElement('img');
  img.src =
    item.media?.[0]?.url ||
    'https://images.unsplash.com/photo-1615485736894-a2d2e6d4cd9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9ja3VwfGVufDB8fDB8fHwy';
  img.alt = item.title;
  img.className = 'w-full h-full object-cover';
  img.setAttribute('crossorigin', 'anonymous');
  img.referrerPolicy = 'no-referrer';

  const timer = CountdownTimer(item.endsAt, 'card');
  imageContainer.appendChild(timer);
  imageContainer.appendChild(img);

  const body = document.createElement('div');
  body.className = 'p-4 flex flex-col gap-2 flex-grow';

  const sellerInfo = document.createElement('p');
  sellerInfo.className = 'text-xs text-gray-600 font-mono';
  sellerInfo.textContent = `Posted by: ${item.seller?.name || 'Unknown'}`;

  const postedDate = document.createElement('p');
  postedDate.className = 'text-xs text-gray-600 font-mono';

  const dateText = formatStaticDate(item.created);
  postedDate.textContent = `Posted date: ${dateText}`;

  const title = document.createElement('h2');
  title.className =
    'pt-4 text-lg font-sans font-bold text-navy leading-6 line-clamp-2 break-words';
  title.textContent = item.title;

  const description = document.createElement('p');
  description.className =
    'text-sm font-medium font-sans text-navy line-clamp-3';
  description.textContent = item.description || 'No description provided';

  const bidsContainer = document.createElement('div');
  bidsContainer.className =
    'mt-6 p-3 bg-orange-50 rounded-lg border border-orange-100 flex flex-col gap-1';

  const bidsHeader = document.createElement('span');
  bidsHeader.className =
    'text-[10px] font-bold text-gray-600 uppercase tracking-wider';
  bidsHeader.textContent = 'Current Highest Bid';
  bidsContainer.appendChild(bidsHeader);

  const currentWinner = getHighestBid(item.bids);

  if (currentWinner) {
    const bidSummaryRow = document.createElement('div');
    bidSummaryRow.className =
      'flex justify-between items-start font-mono text-sm';

    const nameDisplay = document.createElement('span');
    nameDisplay.className = 'text-gray-700 font-bold';
    nameDisplay.textContent = currentWinner?.bidder?.name || 'Anonymous';

    const bidDetails = document.createElement('div');
    bidDetails.className = 'text-right flex flex-col items-end';

    const amountDisplay = document.createElement('span');
    amountDisplay.className = 'block font-bold text-navy';
    amountDisplay.textContent = `${currentWinner?.amount} Credits`;

    const bidDate = document.createElement('span');
    bidDate.className = 'block text-[10px] text-gray-600 font-medium';
    bidDate.textContent = currentWinner?.created
      ? formatStaticDate(currentWinner.created)
      : '';

    bidDetails.append(amountDisplay, bidDate);
    bidSummaryRow.append(nameDisplay, bidDetails);
    bidsContainer.appendChild(bidSummaryRow);
  } else {
    const noBids = document.createElement('span');
    noBids.className = 'text-xs text-gray-600 italic';
    noBids.textContent = 'No bids yet. Be the first to bid';
    bidsContainer.appendChild(noBids);
  }

  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'flex flex-wrap gap-2 mt-2';

  if (item.tags && item.tags.length > 0) {
    item.tags.forEach((tag) => {
      const tagSpan = document.createElement('span');
      tagSpan.className =
        'text-xs font-mono px-2 py-0.5 rounded-full border border-gray-200 bg-gray-100 hover:bg-navy hover:text-white hover:border-navy transition-colors cursor-pointer';
      tagSpan.textContent = `#${tag}`;

      tagSpan.addEventListener('click', () => {
        const params = new URLSearchParams();
        params.set('tag', tag);
        window.history.pushState({}, '', `/?${params.toString()}`);
        window.dispatchEvent(new Event('popstate'));
      });

      tagsContainer.appendChild(tagSpan);
    });
  }

  const footer = document.createElement('div');
  footer.className =
    'p-4 bg-gray-50 border-t border-gray-100 mt-auto text-center flex flex-col gap-3';

  if (!isLoggedIn) {
    const loginPrompt = document.createElement('p');
    loginPrompt.className = 'text-xs font-mono text-gray-600 mb-4 px-2';
    loginPrompt.textContent = 'You have to be logged in to place bids. Please ';

    const registerLink = document.createElement('a');
    registerLink.href = '/register';
    registerLink.className = 'text-navy font-bold hover:underline';
    registerLink.textContent = 'Register ';
    registerLink.setAttribute('data-link', '');

    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.className = 'text-navy font-bold hover:underline';
    loginLink.textContent = 'Login ';
    loginLink.setAttribute('data-link', '');

    loginPrompt.append(registerLink, 'or ', loginLink);
    footer.append(loginPrompt);
  }

  const viewButton = document.createElement('a');
  viewButton.href = `/listing/index.html?id=${item.id}`;
  viewButton.setAttribute('data-link', '');
  viewButton.className = 'button-primary w-full';
  viewButton.textContent = 'View Details';

  body.append(
    sellerInfo,
    postedDate,
    title,
    description,
    bidsContainer,
    tagsContainer,
  );
  footer.append(viewButton);
  card.append(imageContainer, body, footer);

  return card;
}
