export async function ProfilePage(): Promise<HTMLElement> {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'w-full flex flex-col items-center justify-center py-12';

  const profileCard = document.createElement('div');
  profileCard.className =
    'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100';

  const banner = document.createElement('div');
  banner.className =
    'w-full h-40 bg-gradient-to-r from-navy to-navy/50 rounded-lg mb-6';

  const header = document.createElement('div');
  header.className = 'relative w-full -mt-12 mb-4';

  const avatarWrapper = document.createElement('div');
  avatarWrapper.className = 'relative z-10 flex items-center gap-4';

  const avatar = document.createElement('div');
  avatar.className =
    'w-24 h-24 rounded-full bg-navy border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-lg mx-auto';
  avatar.textContent = 'AZ';

  const actions = document.createElement('div');
  actions.className = 'flex gap-2';

  const editButton = document.createElement('button');
  editButton.className = 'button-action';
  editButton.textContent = 'Edit';

  const createListingButton = document.createElement('button');
  createListingButton.className = 'button-action';
  createListingButton.textContent = 'Create';

  const name = document.createElement('h3');
  name.className = 'text-lg font-bold font-sans mt-2 text-navy';
  name.textContent = 'Username';

  const email = document.createElement('p');
  email.className = 'text-sm text-gray-500';
  email.textContent = 'user@stud.noroff.no';

  const credits = document.createElement('p');
  credits.className =
    'max-w-max text-xs md:text-sm font-semibold font-mono text-navy uppercase bg-gray-200 px-2 py-2 rounded-full mt-2';
  credits.textContent = 'Credits: 1000';

  const bio = document.createElement('p');
  bio.className = 'text-sm text-gray-600 mt-4 text-center max-w-md mx-auto';
  bio.textContent = 'User bio text.';

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

  pageContainer.appendChild(profileCard);
  return pageContainer;
}
