import { LandingPage } from '../pages/LandingPage';
import { DetailsPage } from '../pages/DetailsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { Navigation } from '../components/Navigation';
import { store } from '../utils/store';
import { ProfilePage } from '../pages/ProfilePage';
import { SearchPage } from '../pages/SearchPage';

const protectedRoutes = ['/profile', '/search'];
const authRoutes = ['/login', '/register'];

const routes: Record<string, () => Promise<HTMLElement>> = {
  '/': LandingPage,
  '/listing': DetailsPage,
  '/register': RegisterPage,
  '/login': LoginPage,
  '/profile': ProfilePage,
  '/search': SearchPage,
};

export async function router(): Promise<void> {
  const app = document.querySelector<HTMLElement>('#app');

  if (!app) return;

  const path = window.location.pathname;

  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const tag = params.get('tag') || '';
  const profileName = params.get('name') ?? '';

  const isLoggedIn = Boolean(store.getToken());

  if (!isLoggedIn && protectedRoutes.includes(path)) {
    window.history.pushState({}, '', '/login');
    return router();
  }

  if (isLoggedIn && authRoutes.includes(path)) {
    window.history.pushState({}, '', '/profile');
    return router();
  }

  app.replaceChildren();

  const nav = Navigation();

  const pageRoot = document.createElement('main');
  pageRoot.id = 'main-content';
  pageRoot.className =
    'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8';

  app.append(nav, pageRoot);

  if (path === '/') {
    const hiddenTitle = document.createElement('h1');
    hiddenTitle.className = 'sr-only';
    hiddenTitle.textContent = 'Auctionic - Latest Auction Listings';
    pageRoot.prepend(hiddenTitle);

    const page = await LandingPage(query, tag);
    pageRoot.appendChild(page);
  } else if (path === '/profile') {
    const page = await ProfilePage(profileName);
    pageRoot.appendChild(page);
  } else if (path.startsWith('/listing')) {
    const page = await DetailsPage();
    pageRoot.appendChild(page);
  } else if (routes[path]) {
    const page = await routes[path]();
    pageRoot.appendChild(page);
  } else {
    const errorHeading = document.createElement('h1');
    errorHeading.className = 'text-2xl font-bold mt-10 text-center';
    errorHeading.textContent = '404 - Page Not Found';
    pageRoot.appendChild(errorHeading);
  }
}
