import './style.css';
import { router } from './router/router';

router();

window.addEventListener('popstate', () => router());

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const link = target.closest<HTMLAnchorElement>('[data-link]');

  if (link) {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      window.history.pushState(null, '', href);
      router();
    }
  }
});
