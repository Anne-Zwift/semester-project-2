import { LandingPage } from '../pages/LandingPage';
import { DetailsPage } from '../pages/DetailsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { Navigation } from '../components/Navigation';
import { store } from '../utils/store';
import { ProfilePage } from '../pages/ProfilePage';

const protectedRoutes = ['/profile'];
const authRoutes = ['/login', '/register'];

const routes: Record<string, () => Promise<HTMLElement>> = {
  '/': LandingPage,
  '/listing': DetailsPage,
  '/register': RegisterPage,
  '/login': LoginPage,
  '/profile': ProfilePage,
};

export async function router(): Promise<void> {
  const app = document.querySelector<HTMLElement>('#app');

  if (!app) return;

  const path = window.location.pathname;
  const isLoggedIn = Boolean(store.getToken());

  if (!isLoggedIn && protectedRoutes.includes(path)) {
    window.history.pushState({}, '', '/login');
    return router();
  }

  if (isLoggedIn && authRoutes.includes(path)) {
    window.history.pushState({}, '', '/');
    return router();
  }

  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  const nav = Navigation();

  const pageRoot = document.createElement('div');
  pageRoot.id = 'content-area';

  app.append(nav, pageRoot);

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
