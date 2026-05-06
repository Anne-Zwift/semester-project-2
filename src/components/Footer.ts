import { router } from '../router/router';
/**
 * Creates the main application footer.
 * @return {HTMLElement} The footer element.
 */

export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className =
    'w-full bg-white/50 backdrop-blur-sm border-t border-gray-100 py-10 mt-auto';

  const footerContainer = document.createElement('div');
  footerContainer.className =
    'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-6';

  const brand = document.createElement('div');
  brand.className =
    'flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105';

  const logoImg = document.createElement('img');
  logoImg.src = '/assets/brand-logo.svg';
  logoImg.alt = 'Auction Logo';
  logoImg.className = 'h-7 w-auto';

  brand.appendChild(logoImg);
  brand.addEventListener('click', () => {
    window.history.pushState({}, '', '/');
    router();
  });

  const metaContainer = document.createElement('div');
  metaContainer.className =
    'flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500 font-normal';

  const copyright = document.createElement('p');
  copyright.className = 'text-gray-500 text-sm';
  copyright.textContent = `© ${new Date().getFullYear()} Semester Project 2`;

  const separator = document.createElement('span');
  separator.className = 'hidden sm:inline text-gray-200 select-none';
  separator.textContent = '|';

  const contactLink = document.createElement('a');
  contactLink.href = 'mailto:contact@blog.com';
  contactLink.className =
    'hover:text-navy hover:underline transition-colors duration-300';
  contactLink.textContent = 'Contact Us';

  metaContainer.append(copyright, separator, contactLink);

  footerContainer.append(brand, metaContainer);
  footer.appendChild(footerContainer);

  return footer;
}
