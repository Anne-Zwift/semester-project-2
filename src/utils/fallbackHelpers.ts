/**
 * Attaches robust fallback and loading logic to an HTMLImageElement.
 * Handles CORS errors, browser caching, and smooth transitions.
 *
 * @param imgElement - The <img> element to enhance.
 * @param src - The primary image URL.
 * @param placeholder - The fallback image URL.
 */

export function setupImageWithFallback(
  imgElement: HTMLImageElement,
  src: string | undefined,
  placeholder: string,
): void {
  imgElement.referrerPolicy = 'no-referrer';

  imgElement.classList.add(
    'opacity-[0.01]',
    'transition-opacity',
    'duration-300',
  );

  imgElement.src = src || placeholder;

  imgElement.addEventListener('load', () => {
    imgElement.classList.remove('opacity-[0.01]');
    imgElement.classList.add('opacity-100');
  });

  const handleError = () => {
    imgElement.removeEventListener('error', handleError);

    if (imgElement.src !== placeholder) {
      imgElement.src = placeholder;
    }

    imgElement.classList.replace('opacity-[0.01]', 'opacity-100');
  };

  imgElement.addEventListener('error', handleError, { once: true });

  if (imgElement.complete) {
    imgElement.classList.remove('opacity-[0.01]');
    imgElement.classList.add('opacity-100');
  }
}
