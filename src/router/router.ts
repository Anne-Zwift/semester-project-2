import { LandingPage } from '../pages/LandingPage';
import { DetailsPage } from '../pages/DetailsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

const routes: Record<string, () => Promise<HTMLElement>> = {
  '/': LandingPage,
  '/listing': DetailsPage,
  '/register': RegisterPage,
  '/login': LoginPage,

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

  const route = path.startsWith('/listing') ? DetailsPage : routes[path];

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
