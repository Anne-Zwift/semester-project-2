import './style.css';
import { router } from './router/router';
import { store } from './utils/store';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

router();

window.addEventListener('popstate', () => {
  router();
});

let previousLoginStatus = store.getToken() !== null;

store.subscribe(() => {
  const currentLoginStatus = store.getToken() !== null;

  if (previousLoginStatus !== currentLoginStatus) {
    previousLoginStatus = currentLoginStatus;
    router();
  }
});
