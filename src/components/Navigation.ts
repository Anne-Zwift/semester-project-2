import { router } from '../router/router';
import { store } from '../utils/store';
import { ListingForm } from './ListingForm';

/**
 * Creates the main navigation bar.
 * Handles responsive layout adjustments, showing primary account info on mobile
 * while moving action triggers (Create, Logout) into the mobile drawer.
 * @returns {HTMLElement} The navigation container element.
 */

export function Navigation(): HTMLElement {
  const navigation = document.createElement('nav');
  navigation.setAttribute('aria-label', 'Main navigation');
  navigation.className =
    'sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-100';

  const innerContainer = document.createElement('div');
  innerContainer.className =
    'max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4';

  const isLoggedIn = Boolean(store.getToken());
  const currentPath = window.location.pathname;

  const handleCreateClick = () => {
    const modal = ListingForm(undefined, () => {
      window.history.pushState({}, '', '/profile');
      router();
    });
    document.body.append(modal);
  };

  const handleLogoutClick = () => {
    store.clear();
    window.history.pushState({}, '', '/');
    router();
  };

  const leftCol = document.createElement('div');
  leftCol.className = 'flex1 flex justify-start';

  const brand = document.createElement('a');
  brand.href = '/';
  brand.setAttribute('aria-label', 'Auction Home');
  brand.className = 'flex items-center cursor-pointer group';

  const logo = document.createElement('img');
  logo.src = '/assets/brand-logo.svg';
  logo.alt = 'Auction Logo Icon';
  logo.className =
    'h-8 w-auto transition-transform duration-300 group-hover:scale-105';
  brand.append(logo);
  brand.addEventListener('click', (event) => {
    event.preventDefault();
    window.history.pushState({}, '', '/');
    router();
  });
  leftCol.appendChild(brand);

  const centerCol = document.createElement('div');
  centerCol.className =
    'hidden md:flex flex-1 justify-center items-center max-w-md mx-auto';

  const linkContainer = document.createElement('div');
  linkContainer.className = 'flex gap-x-8 items-center justify-center';

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

  centerCol.appendChild(linkContainer);

  const rightCol = document.createElement('div');
  rightCol.className = 'flex-1 flex items-center justify-end gap-3 md:gap-4';

  const authSection = document.createElement('div');
  authSection.className = 'flex items-center gap-3 md:gap-4';

  const mobileDrawer = document.createElement('div');
  mobileDrawer.id = 'mobile-drawer';
  mobileDrawer.className =
    'hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md flex-col p-4 shadow-lg z-40 md:hidden gap-3 border-b border-gray-100';

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

  if (isLoggedIn) {
    const createListingBtn = document.createElement('button');
    createListingBtn.textContent = 'Create';
    createListingBtn.className =
      'hidden md:flex px-3 py-1.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy/90 shadow-sm active:scale-95 cursor-pointer md:order-1';

    createListingBtn.addEventListener('click', handleCreateClick);

    const profileWrapper = document.createElement('div');
    profileWrapper.className =
      'flex items-center gap-3 md:border-l md:pl-4 md:ml-2 md:order-3';

    const credits = document.createElement('div');
    credits.setAttribute(
      'aria-label',
      `You have ${store.getCredits()} credits available`,
    );
    credits.className = 'flex flex-col items-end';

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
      'text-[9px] md:text-[10px] uppercase text-gray-600 tracking-normal';
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
      'hidden md:inline-block text-sm text-red-600 hover:text-red-700 font-medium hover:underline cursor-pointer md:order-2';

    logoutButton.addEventListener('click', handleLogoutClick);

    authSection.appendChild(logoutButton);
    authSection.prepend(createListingBtn);
    authSection.prepend(profileWrapper);

    const mobileCreateBtn = document.createElement('button');
    mobileCreateBtn.textContent = 'Create Listing';
    mobileCreateBtn.className =
      'w-full py-2.5 bg-navy text-white text-sm font-bold rounded-lg shadow-sm active:scale-95 mt-2 cursor-pointer';
    mobileCreateBtn.addEventListener('click', () => {
      mobileDrawer.classList.replace('flex', 'hidden');
      mobileMenuBar.setAttribute('area-expanded', 'false');
      mobileMenuBar.classList.remove('is-open');
      handleCreateClick();
    });

    const mobileLogoutBtn = document.createElement('button');
    mobileLogoutBtn.textContent = 'Logout';
    mobileLogoutBtn.className =
      'w-full py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors cursor-pointer mt-2';
    mobileLogoutBtn.addEventListener('click', () => {
      mobileDrawer.classList.replace('flex', 'hidden');
      handleLogoutClick();
    });

    mobileDrawer.appendChild(mobileCreateBtn);
    mobileDrawer.appendChild(mobileLogoutBtn);
  }

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
    mobileDrawer.prepend(mobileLink);
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

  rightCol.append(authSection, mobileMenuBar);

  innerContainer.append(leftCol, centerCol, rightCol);

  navigation.append(innerContainer, mobileDrawer);

  return navigation;
}
