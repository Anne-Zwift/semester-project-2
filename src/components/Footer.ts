import { router } from '../router/router';
/**
 * Creates the main application footer.
 * @return {HTMLElement} The footer element.
 */

export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'w-full bg-white/80 border-t border-gray-100 py-8 mt-auto';

  const footerContainer = document.createElement('div');
  footerContainer.className =
    'max-w-7xl mx-auto bg-white/80 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-left gap-1';

  const brand = document.createElement('div');
  brand.className = 'flex items-center gap-2 cursor-pointer';

  const logoImg = document.createElement('img');
  logoImg.src = '/assets/logo-mobile.svg';
  logoImg.alt = 'Auction Logo';
  logoImg.className =
    'h-8 text-left transition-transform duration-200 hover:scale-105';

  brand.appendChild(logoImg);
  brand.addEventListener('click', () => {
    window.history.pushState({}, '', '/');
    router();
  });

  const copyright = document.createElement('p');
  copyright.className = 'text-gray-500 text-sm';
  copyright.textContent = `© ${new Date().getFullYear()} Semester Project 2`;

  const contactLink = document.createElement('a');
  contactLink.href = 'mailto:contact@blog.com';
  contactLink.className =
    'text-gray-400 text-sm hover:text-navy transition-colors';
  contactLink.textContent = 'Contact Us';

  brand.append(logoImg);
  footerContainer.append(brand, copyright, contactLink);
  footer.appendChild(footerContainer);

  return footer;
}
