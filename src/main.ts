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

let previousUserState = JSON.stringify(store.getUser());

store.subscribe(() => {
  const currentUserState = JSON.stringify(store.getUser());

  // This catches when login status changes AND when credits change
  if (previousUserState !== currentUserState) {
    previousUserState = currentUserState;
    router();
  }
});
