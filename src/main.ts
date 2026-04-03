import './style.css';
/* import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer'; */
import { router } from './router/router';
import { store } from './utils/store';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}
/* const nav = Navigation();
const footer = Footer();

app.prepend(nav);

app.appendChild(footer);

const content = document.querySelector<HTMLElement>('#content-area');

if (!content) {
  throw new Error('#content-area not found');
} */

router();

store.subscribe(() => {
  router();
});

window.addEventListener('popstate', router);
