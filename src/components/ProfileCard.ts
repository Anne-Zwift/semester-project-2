import type { Profile } from '../types/Profile';

export function ProfileCard(profile: Profile): HTMLElement {
  const card = document.createElement('article');
  card.className =
    'bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden';

  const banner = document.createElement('div');
  banner.className = 'w-full h-24 bg-gradient-to-r from-navy to-navy/50';
  if (profile.banner?.url) {
    const img = document.createElement('img');
    img.src = profile.banner.url;
    img.alt = profile.banner.alt || `${profile.name}'s banner`;
    img.className = 'w-full h-full object-cover';
    banner.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'p-4 flex flex-col items-center text-center gap-2';

  const avatar = document.createElement('div');
  avatar.className =
    'w-16 h-16 rounded-full bg-navy border-4 border-white flex items-center justify-center text-white text-lg font-bold shadow-lg -mt-10';
  if (profile.avatar?.url) {
    const img = document.createElement('img');
    img.src = profile.avatar.url;
    img.alt = profile.avatar.alt || `${profile.name}'s avatar`;
    img.className = 'w-full h-full rounded-full object-cover';
    avatar.appendChild(img);
  } else {
    avatar.textContent = profile.name.slice(0, 2).toLocaleUpperCase();
  }

  const name = document.createElement('h3');
  name.className = 'text-lg font-bold font-sans text-navy';
  name.textContent = profile?.name;

  const bio = document.createElement('p');
  bio.className = 'text-sm text-gray-600 line-clamp-2';
  bio.textContent = profile?.bio || 'No bio added yet.';

  const viewButton = document.createElement('button');
  viewButton.className = 'button-primary w-full mt-2';
  viewButton.textContent = 'View Profile';
  viewButton.addEventListener('click', () => {
    window.history.pushState({}, '', `/search/profile?name=${profile.name}`);
    window.dispatchEvent(new Event('popstate'));
  });
  body.append(avatar, name, bio, viewButton);
  card.append(banner, body);
  return card;
}
