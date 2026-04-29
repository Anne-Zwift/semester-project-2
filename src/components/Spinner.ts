export function Spinner(): HTMLElement {
  const spinner = document.createElement('div');
  spinner.className =
    'w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto';
  return spinner;
}
