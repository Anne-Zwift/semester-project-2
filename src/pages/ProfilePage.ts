export async function ProfilePage(): Promise<HTMLElement> {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'w-full flex flex-col items-center justify-center py-12';

  const profileCard = document.createElement('div');
  profileCard.className =
    'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100';

  const banner = document.createElement('div');
  banner.className = 'w-full h-32 bg-gray-200 rounded-lg mb-6';

  const header = document.createElement('div');
  header.className = 'flex flex-col items-center -mt-16 mb-4';

  const avatar = document.createElement('div');
  avatar.className =
    'w-24 h-24 rounded-full bg-navy border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-md';
  avatar.textContent = 'AZ';

  const name = document.createElement('h3');
  name.className = 'text-lg font-bold font-sans mt-2 text-navy';
  name.textContent = 'Username';

  const email = document.createElement('p');
  email.className = 'text-sm text-gray-500';
  email.textContent = 'user@stud.noroff.no';

  const credits = document.createElement('p');
  credits.className =
    'text-sm font-semibold font-mono text-navy uppercase mt-1';
  credits.textContent = 'Credits: 1000';

  const bio = document.createElement('p');
  bio.className = 'text-sm text-gray-600 mt-4 text-center';
  bio.textContent = 'User bio text.';

  header.append(avatar, name, email, credits);
  profileCard.append(banner, header, bio);
  pageContainer.appendChild(profileCard);

  return pageContainer;
}
