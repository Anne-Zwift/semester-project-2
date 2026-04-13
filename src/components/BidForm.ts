import type { Listing } from '../types/Listing';
import { getHighestBid } from '../utils/bidHelpers';
import { store } from '../utils/store';
import { placeBid } from '../api/Listings';
import { router } from '../router/router';

/**
 * Creates and manages the Bidding section for a listing.
 * This function acts as a "Gatekeeper," checking user permissions (auth, ownership, expiry)
 * before deciding whether to show a login prompt, a warning, or the active bidding form.
 * * @param {Listing} item - The current listing object containing bid history and metadata.
 * @returns {HTMLElement} A container element containing the appropriate UI state.
 */

export function BidForm(item: Listing): HTMLElement {
  const container = document.createElement('div');
  container.className =
    'my-6 p-6 bg-gray-50 rounded-2xl border border-gray-100';
  const user = store.getUser();
  const token = store.getToken();
  const isOwner = user?.name === item.seller?.name;
  const isExpired = new Date(item.endsAt) < new Date();

  if (!token) {
    const loginPrompt = document.createElement('div');
    loginPrompt.className = 'text-sm text-gray-600 text-center';
    loginPrompt.textContent = 'You have to be logged in to place bids. ';

    const loginLink = createLink('/login', 'Login');
    const registerLink = createLink('/register', 'Register');

    loginPrompt.append(registerLink, ' or ', loginLink);
    container.appendChild(loginPrompt);
    return container;
  }

  if (isOwner) {
    const ownerMsg = document.createElement('p');
    ownerMsg.className =
      'text-sm text-warning font-semibold italic text-center';
    ownerMsg.textContent = 'You cannot bid on your own listing.';
    container.appendChild(ownerMsg);
    return container;
  }

  if (isExpired) {
    const endedMsg = document.createElement('p');
    endedMsg.className = 'text-sm text-error font-semibold italic text-center';
    endedMsg.textContent =
      'This auction has ended. No more bids can be placed.';
    container.appendChild(endedMsg);
    return container;
  }

  renderActiveForm(container, item);
  return container;
}

/**
 * Renders the actual interactive form elements and handles the submission logic.
 * Encapsulates the bidding logic, API interaction, and UI updates.
 * * @param {HTMLElement} container - The parent element to append the form to.
 * @param {Listing} item - The listing data used to calculate minimum bid requirements.
 * @private
 */

function renderActiveForm(container: HTMLElement, item: Listing) {
  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const highestBid = getHighestBid(item.bids);
  const minNextBid = (highestBid?.amount || 0) + 1;

  const label = document.createElement('label');
  label.className = 'text-sm font-bold text-navy';
  label.textContent = `Place a bid (Min. ${minNextBid} Credits)`;

  const input = document.createElement('input');
  input.type = 'number';
  input.min = minNextBid.toString();
  input.value = minNextBid.toString();
  input.className =
    'p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-navy';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'button-action';
  submitButton.textContent = 'Place Bid';

  form.append(label, input, submitButton);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(input.value);

    const existingError = form.querySelector('.error-msg');
    if (existingError) existingError.remove();

    try {
      const response = await placeBid(item.id, amount);

      if (response?.data) {
        const successMsg = document.createElement('p');
        successMsg.className = 'text-success text-center';
        successMsg.textContent = 'Your bid was successfully placed.';
        await store.fetchAndUpdateProfile();
        router();
      }
    } catch (error: unknown) {
      const errorMsg = document.createElement('p');
      errorMsg.className = 'text-error text-center';
      let displayMessage = 'Something went wrong. Your bid was not placed.';

      if (error instanceof Error) {
        displayMessage = error.message;
      }

      errorMsg.textContent = displayMessage;

      form.appendChild(errorMsg);
      console.warn('Bid failed:', displayMessage);
    }
  });
  container.appendChild(form);
}

/**
 * Utility function to create standardized internal navigation links.
 * * @param {string} href - The destination URL path.
 * @param {string} text - The visible label for the link.
 * @returns {HTMLAnchorElement} A styled anchor tag ready for the router.
 */

function createLink(href: string, text: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.className = 'text-navy font-bold hover:underline';
  link.textContent = text;
  link.setAttribute('data-link', '');
  return link;
}
