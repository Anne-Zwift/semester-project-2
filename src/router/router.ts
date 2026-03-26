import { LandingPage } from '../pages/LandingPage';
import { DetailsPage } from '../pages/DetailsPage';

const routes: Record<string, () => Promise<HTMLElement>> = {
  '/': LandingPage,
  '/listing': DetailsPage,

  '/login': async () => {
    const div = document.createElement('div');
    div.textContent = 'Login Page coming soon...';
    div.className = 'text-center mt-20 text-gray-500 italic';
    return div;
  },

  '/register': async () => {
    const div = document.createElement('div');
    div.textContent = 'Register Page coming soon...';
    div.className = 'text-center mt-20 text-gray-500 italic';
    return div;
  },

  '/profile': async () => {
    const div = document.createElement('div');
    div.textContent = 'Profile Page coming soon...';
    div.className = 'text-center mt-20 text-gray-500 italic';
    return div;
  },
};

export async function router(): Promise<void> {
  const path = window.location.pathname;
  const pageRoot = document.querySelector<HTMLElement>('#content-area');

  if (!pageRoot) return;

  pageRoot.replaceChildren();

const route = path.startsWith('/listing')
? DetailsPage
: routes[path];

  if (route) {
    const page = await route();
    pageRoot.appendChild(page);
  } else {
    const errorHeading = document.createElement('h1');
    errorHeading.className = 'text-2xl font-bold mt-10 text-center';
    errorHeading.textContent = '404 - Page Not Found';
    pageRoot.appendChild(errorHeading);
  }

  
}
