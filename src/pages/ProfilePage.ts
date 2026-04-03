import { fetchProfile } from '../api/Profile';
import { store } from '../utils/store';
import type { Profile } from '../types/Profile';
import { SkeletonProfile } from '../components/SkeletonProfile';

export async function ProfilePage(): Promise<HTMLElement> {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'w-full flex flex-col items-center justify-center py-12';

  const profileCard = document.createElement('div');
  profileCard.className =
    'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100';

  pageContainer.appendChild(profileCard);

  const skeleton = SkeletonProfile();
  profileCard.appendChild(skeleton);

  /*       const user = store.getUser(); */

  let profileData: Profile | null = store.getUser();
  let fetchFailed = false;

  try {
    const response = await fetchProfile();
    if (response?.data) {
      profileData = response.data;
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    fetchFailed = true;
  }

  profileCard.replaceChildren();

  if (!profileData) {
    const errorMsg = document.createElement('p');
    errorMsg.className = 'text-red-500 text-center';
    errorMsg.textContent = 'Failed to load profile. Please try again.';

    if (fetchFailed) {
      const warning = document.createElement('p');
      warning.className = 'text-yellow-600 text-sm text-center mb-2';
      warning.textContent = 'Showing cached profile (offline)';
      profileCard.appendChild(warning);
    }

    profileCard.appendChild(errorMsg);
    return pageContainer;
  }

  const banner = document.createElement('div');
  banner.className =
    'w-full h-40 bg-gradient-to-r from-navy to-navy/50 rounded-lg mb-6';

  const header = document.createElement('div');
  header.className = 'relative w-full -mt-12 mb-4';

  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = 'relative z-10 flex items-center gap-4';

  const userInitials =
    profileData?.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() ||
    profileData?.email?.[0]?.toUpperCase() ||
    '?';

  const avatar = document.createElement('div');
  avatar.className =
    'w-24 h-24 rounded-full bg-navy border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-lg mx-auto';
  avatar.textContent = userInitials;

  const actions = document.createElement('div');
  actions.className = 'flex gap-2';

  const editButton = document.createElement('button');
  editButton.addEventListener('click', () => console.log('Edit Profile'));
  editButton.className = 'button-action';
  editButton.textContent = 'Edit';

  const createListingButton = document.createElement('button');
  createListingButton.addEventListener('click', () =>
    console.log('Create Listing'),
  );
  createListingButton.className = 'button-action';
  createListingButton.textContent = 'Create';

  const name = document.createElement('h3');
  name.className = 'text-lg font-bold font-sans mt-2 text-navy';
  name.textContent = profileData?.name || 'Unknown User';

  const email = document.createElement('p');
  email.className = 'text-sm text-gray-500';
  email.textContent = profileData?.email || 'user@stud.noroff.no';

  const credits = document.createElement('p');
  credits.className =
    'max-w-max text-xs md:text-sm font-semibold font-mono text-navy uppercase bg-gray-200 p-2 rounded-full mt-2';
  credits.textContent = `Credits: ${profileData?.credits ?? 0}`;

  const bio = document.createElement('p');
  bio.className = 'text-sm text-gray-600 mt-4 text-center max-w-md mx-auto';
  bio.textContent = profileData?.bio || 'No bio added yet.';

  actions.append(editButton, createListingButton);
  avatarWrapper.append(avatar, actions);
  header.append(avatarWrapper, name, email, credits);
  profileCard.append(banner, header, bio);

  const tabs = document.createElement('div');
  tabs.className =
    'flex gap-6 mt-8 border-t border-gray-300 pt-4 justify-center';

  const listingsTab = document.createElement('button');
  listingsTab.textContent = 'Listings';
  listingsTab.className =
    'font-bold text-navy hover:text-navy/90 pb-1 border-b-2 border-transparent hover:border-navy transition-all';

  const bidsTab = document.createElement('button');
  bidsTab.textContent = 'Bids';
  bidsTab.className =
    'font-bold text-navy hover:text-navy/90 pb-1 border-b-2 border-transparent hover:border-navy transition-all';

  const winsTab = document.createElement('button');
  winsTab.textContent = 'Wins';
  winsTab.className =
    'font-bold text-navy hover:text-navy/90 pb-1 border-b-2 border-transparent hover:border-navy transition-all';

  tabs.append(listingsTab, bidsTab, winsTab);
  profileCard.appendChild(tabs);

  const tabContent = document.createElement('div');
  tabContent.className = 'mt-6 text-center text-gray-500';
  profileCard.appendChild(tabContent);

  const tabsConfig = [
    { name: 'Listings', element: listingsTab },
    { name: 'Bids', element: bidsTab },
    { name: 'Wins', element: winsTab },
  ];

  function setActiveTab(tab: string) {
    tabContent.textContent = `${tab} content`;

    tabsConfig.forEach(({ element }) =>
      element.classList.remove('border-navy'),
    );
    const active = tabsConfig.find((t) => t.name === tab);
    active?.element.classList.add('border-navy');

    tabContent.textContent = `${tab} content`;
  }

  tabsConfig.forEach(({ name, element }) => {
    element.addEventListener('click', () => setActiveTab(name));
  });

  setActiveTab('Listings');

  return pageContainer;
}
