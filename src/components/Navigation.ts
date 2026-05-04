import { router } from '../router/router';
import { store } from '../utils/store';
import { ListingForm } from './ListingForm';

/**
 * Creates the main navigation bar
 * This component handles navigation clicks using the router.
 * @returns {HTMLElement} The navigation container element.
 */

export function Navigation(): HTMLElement {
  const navigation = document.createElement('nav');
  navigation.setAttribute('aria-label', 'Main navigation');
  navigation.className =
    'sticky top-0 z-50 w-full flex h-16 items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100';

  const isLoggedIn = Boolean(store.getToken());
  const currentPath = window.location.pathname;

  const brand = document.createElement('a');
  brand.href = '/';
  brand.setAttribute('aria-label', 'Auction Home');
  brand.className = 'flex items-center cursor-pointer';

  const logo = document.createElement('img');
  logo.src = '/assets/logo.svg';
  logo.alt = 'Auction Logo';
  logo.className =
    'h-8 w-auto transition-transform duration-200 hover:scale-105';

  brand.appendChild(logo);
  brand.addEventListener('click', () => {
    window.history.pushState({}, '', '/');
    router();
  });

  const linkContainer = document.createElement('div');
  linkContainer.className = 'hidden md:flex gap-x-6 items-center';

  const allLinks = [
    { name: 'Home', path: '/', requiresLogin: false, alwaysShow: true },
    { name: 'Find Users', path: '/search', requiresLogin: true },
    {
      name: 'Login',
      path: '/login',
      requiresLogin: false,
      hideIfLoggedIn: true,
    },
    {
      name: 'Register',
      path: '/register',
      requiresLogin: false,
      hideIfLoggedIn: true,
    },
    { name: 'Profile', path: '/profile', requiresLogin: true },
  ];

  allLinks.forEach((link) => {
    if (isLoggedIn && link.hideIfLoggedIn) return;
    if (!isLoggedIn && link.requiresLogin && !link.alwaysShow) return;

    const anchor = document.createElement('a');
    anchor.href = link.path;
    anchor.textContent = link.name;

    const isActive = currentPath === link.path;
    anchor.className = `relative text-sm font-medium transition-all duration-200 ${isActive ? 'text-navy underline underline-offset-4 decoration-2' : 'text-gray-500 hover:text-navy hover:scale-105'}`;

    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      window.history.pushState({}, '', link.path);
      router();
    });

    linkContainer.appendChild(anchor);
  });

  const authSection = document.createElement('div');
  authSection.className = 'flex items-center gap-4';

  if (isLoggedIn) {
    const createListingBtn = document.createElement('button');
    createListingBtn.textContent = 'Create';
    createListingBtn.className =
      'px-3 py-1.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy/90 shadow-sm active:scale-95';

    createListingBtn.addEventListener('click', () => {
      const modal = ListingForm(undefined, () => {
        window.history.pushState({}, '', '/profile');
        router();
      });
      document.body.append(modal);
    });

    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'flex items-center gap-3 border-l pl-4 ml-2';

    const credits = document.createElement('div');
    credits.setAttribute(
      'aria-label',
      `You have ${store.getCredits()} credits available`,
    );
    credits.className = 'hidden sm:flex flex-col items-end';

    const amount = document.createElement('span');
    amount.id = 'nav-credits-amount';
    amount.className = 'text-xs font-mono font-bold text-navy';
    amount.textContent = String(store.getCredits());

    store.subscribe(() => {
      const el = document.getElementById('nav-credits-amount');
      if (el) {
        el.textContent = String(store.getCredits());
      }
    });

    const designationLabel = document.createElement('span');
    designationLabel.className =
      'text-[10px] uppercase text-gray-400 tracking-normal';
    designationLabel.textContent = 'Credits';

    credits.append(amount, designationLabel);

    const profileAvatar = document.createElement('div');
    profileAvatar.className =
      'w-9 h-9 rounded-full bg-navy flex items-center justify-center text-xs text-white font-bold border-2 border-gray-100 shadow-sm';
    const user = store.getUser?.();
    profileAvatar.textContent = user?.name?.slice(0, 2).toUpperCase() || '?';

    profileWrapper.append(credits, profileAvatar);
    authSection.prepend(profileWrapper);

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.className =
      'text-sm text-red-600 hover:text-red-700 font-medium hover:underline';
    logoutButton.addEventListener('click', () => {
      store.clear();
      window.history.pushState({}, '', '/');
      router();
    });
    authSection.appendChild(logoutButton);
    authSection.prepend(createListingBtn);
    authSection.prepend(profileWrapper);
  }

  const mobileMenuBar = document.createElement('button');
  mobileMenuBar.className =
    'md:hidden flex flex-col justify-center items-center gap-[3px] p-2 group';
  mobileMenuBar.setAttribute('aria-label', 'Toggle navigation menu');
  mobileMenuBar.setAttribute('aria-expanded', 'false');
  mobileMenuBar.setAttribute('aria-controls', 'mobile-drawer');

  const createBar = (index: number) => {
    const bar = document.createElement('span');
    bar.className = `nav-bar bar-${index}`;
    return bar;
  };

  const bar1 = createBar(1);
  const bar2 = createBar(2);
  const bar3 = createBar(3);

  mobileMenuBar.append(bar1, bar2, bar3);

  const mobileDrawer = document.createElement('div');
  mobileDrawer.id = 'mobile-drawer';
  mobileDrawer.className =
    'hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md flex-col p-4 shadow-lg z-40 md:hidden';

  allLinks.forEach((link) => {
    if (isLoggedIn && link.hideIfLoggedIn) return;
    if (!isLoggedIn && link.requiresLogin && !link.alwaysShow) return;

    const mobileLink = document.createElement('a');
    mobileLink.href = link.path;
    mobileLink.className =
      'text-sm font-semibold text-navy py-2 border-gray-50';
    mobileLink.textContent = link.name;

    mobileLink.addEventListener('click', (event) => {
      event.preventDefault();
      window.history.pushState({}, '', link.path);
      mobileDrawer.classList.replace('flex', 'hidden');
      router();
    });
    mobileDrawer.appendChild(mobileLink);
  });

  mobileMenuBar.addEventListener('click', () => {
    const isHidden = mobileDrawer.classList.contains('hidden');
    if (isHidden) {
      mobileDrawer.classList.replace('hidden', 'flex');
      mobileMenuBar.setAttribute('aria-expanded', 'true');
      mobileMenuBar.classList.add('is-open');
      const firstLink = mobileDrawer.querySelector('a');
      firstLink?.focus({ preventScroll: true });
    } else {
      mobileDrawer.classList.replace('flex', 'hidden');
      mobileMenuBar.setAttribute('aria-expanded', 'false');
      mobileMenuBar.classList.remove('is-open');
    }
  });

  navigation.append(
    brand,
    linkContainer,
    authSection,
    mobileMenuBar,
    mobileDrawer,
  );
  return navigation;
}
