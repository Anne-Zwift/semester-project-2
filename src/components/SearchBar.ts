/**
 * Animated searchbar, triggers when the user starts typing.
 * Creates a search bar component with an input field.
 * The component allows the user to enter a query and submits it either by clicking the button or pressing the Enter key.
 * @param {function(string): void} onSearch - A callback function executed when the user submits a non-empty search query. The query string is passed as the argument.
 * @returns {HTMLDivElement} The container element for the search input component.
 */

export function SearchBar(
  onSearch: (value: string) => void,
  onTagClear: () => void,
  initialValue: string = '',
  activeTag: string = '',
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col items-end gap-2 w-full max-w-md';

  const container = document.createElement('div');
  container.className = 'relative w-full group';

  const icon = document.createElement('span');
  icon.className =
    'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors text-sm';
  icon.textContent = '🔍';

  const input = document.createElement('input');
  const isExpanded = !!initialValue || !!activeTag;
  input.value = initialValue;
  input.type = 'text';
  input.placeholder = activeTag
    ? `Browsing #${activeTag}...`
    : 'Search auctions...';
  input.disabled = !!activeTag;
  input.className = `${isExpanded ? 'w-full' : 'w-full md:w-48 md:focus:w-full'} pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 outline-none transition-all duration-500 ease-in-out focus:ring-2 focus:ring-navy focus:bg-white font-sans text-sm disabled:opacity-50 disabled:cursor-not-allowed`;

  if (initialValue) {
    input.addEventListener('focus', () => {
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  input.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    onSearch(target.value.toLocaleLowerCase());
  });

  container.append(icon, input);

  if (activeTag) {
    const pill = document.createElement('div');
    pill.className =
      'flex items-center gap-2 px-3 py-1 bg-navy text-white text-xs font-sans rounded-full';

    const label = document.createElement('span');
    label.textContent = `#${activeTag}`;

    const clearBtn = document.createElement('button');
    clearBtn.className =
      'hover:text-gray-300 transition-colors cursor-pointer font-bold';
    clearBtn.textContent = 'X';
    clearBtn.setAttribute('aria-label', 'Clear tag filter');
    clearBtn.addEventListener('click', onTagClear);

    pill.append(label, clearBtn);
    wrapper.append(container, pill);
  } else {
    wrapper.append(container);
  }
  return wrapper;
}
