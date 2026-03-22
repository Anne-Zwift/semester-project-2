/**
 * Animated searchbar, triggers when the user starts typing.
 * Creates a search bar component with an input field.
 * The component allows the user to enter a query and submits it either by clicking the button or pressing the Enter key.
 * @param {function(string): void} onSearch - A callback function executed when the user submits a non-empty search query. The query string is passed as the argument.
 * @returns {HTMLDivElement} The container element for the search input component.
 */

export function SearchBar(onSearch: (query: string) => void): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'relative max-w-md w-full group';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search auctions...';
  input.className = `w-48 focus:w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 outline-none transition-all duration-500 ease-in-out focus:ring-2 focus:ring-navy focus:bg-white font-sans text-sm`;

  const icon = document.createElement('span');
  icon.className =
    'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors';
  icon.textContent = '🔍';

  input.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    onSearch(target.value.toLocaleLowerCase());
  });

  container.append(icon, input);
  return container;
}
