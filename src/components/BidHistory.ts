import type { Bid } from '../types/Listing';
import { formatStaticDate } from '../utils/dateFormatter';

export function BidHistory(bids: Bid[] = []): HTMLElement {
  const container = document.createElement('div');
  container.className = 'mt-8 border-t border-gray-200 pt-6';

  const title = document.createElement('h2');
  title.className = 'text-lg font-sans font-bold text-navy gap-2';
  title.textContent = `Bid History (${bids.length})`;

  if (bids.length === 0) {
    const noBids = document.createElement('p');
    noBids.className =
      'text-gray-600 italic py-4 text-center bg-gray-50 rounded-lg';
    noBids.textContent = 'No bids yet';
    container.append(title, noBids);
    return container;
  }

  const tableWrapper = document.createElement('div');
  tableWrapper.className =
    'max-h-[400px] overflow-y-auto shadow-lg rounded-lg custom-scrollbar bg-white';

  const table = document.createElement('table');
  table.className = 'w-full text-left border-collapse';

  const tableHeader = document.createElement('thead');
  tableHeader.className =
    'sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm';
  const headerRow = document.createElement('tr');

  ['Bidder', 'Date', 'Amount'].forEach((text) => {
    const headerCell = document.createElement('th');
    headerCell.className =
      'px-4 py-3 text-xs font-bold uppercase text-gray-500 tracking-wider';
    headerCell.textContent = text;
    headerRow.appendChild(headerCell);
  });
  tableHeader.appendChild(headerRow);

  const tableBody = document.createElement('tbody');
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);

  sortedBids.forEach((bid) => {
    const tablerow = document.createElement('tr');
    tablerow.className =
      'border-b border-gray-100 odd:bg-white even:bg-gray-50/80 hover:bg-orange-50/50 transition-colors duration-200';

    const nameCell = document.createElement('td');
    nameCell.className = 'px-4 py-4 text-sm font-semibold text-gray-700';
    nameCell.textContent = bid.bidder?.name || 'Anonymous';

    const dateCell = document.createElement('td');
    dateCell.className = 'px-4 py-4 text-xs text-gray-600 font-mono';
    dateCell.textContent = formatStaticDate(bid.created);

    const amountCell = document.createElement('td');
    amountCell.className = 'px-4 py-4 text-sm font-bold text-navy text-right';
    amountCell.textContent = `${bid.amount} Credits`;

    tablerow.append(nameCell, dateCell, amountCell);

    tableBody.appendChild(tablerow);
  });
  table.append(tableHeader, tableBody);
  tableWrapper.appendChild(table);
  container.append(title, tableWrapper);
  return container;
}
