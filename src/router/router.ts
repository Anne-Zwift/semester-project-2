import { LandingPage } from '../pages/LandingPage';
import { DetailsPage } from '../pages/DetailsPage';

const routes: Record<string, () => void> = {
  '/': LandingPage,
  '/listing': DetailsPage,
};

export function router(): void {
  const path = window.location.pathname;
  const container = document.querySelector<HTMLElement>('#content-area');

  if (!container) return;

  container.innerHTML = '';

  if (path === '/' || path === '/index.html') {
    routes['/']();
  } else if (path.startsWith('/listing')) {
    routes['/listing']();
  } else {
    const h1 = document.createElement('h1');
    h1.textContent = '404 - Page Not Found';
    container.appendChild(h1);
  }
}
