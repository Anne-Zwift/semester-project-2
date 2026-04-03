export function SkeletonProfile(): HTMLElement {
  const skeleton = document.createElement('div');
  skeleton.className = 'animate-pulse w-full';

  const banner = document.createElement('div');
  banner.className = 'w-full h-40 bg-gray-300 rounded-lg mb-6';

  const header = document.createElement('div');
  header.className = 'flex flex-col items-center -mt-12 mb-4';

  const avatar = document.createElement('div');
  avatar.className = 'w-24 h-24 rounded-full bg-gray-300 border-4 border-white';

  const name = document.createElement('div');
  name.className = 'h-4 bg-gray-300 rounded w-32 mt-4';

  const email = document.createElement('div');
  email.className = 'h-3 bg-gray-300 rounded w-40 mt-2';

  const credits = document.createElement('div');
  credits.className = 'h-4 bg-gray-300 rounded w-24 mt-3';

  const bio = document.createElement('div');
  bio.className = 'mt-6 space-y-2';

  for (let i = 0; i < 3; i++) {
    const line = document.createElement('div');
    line.className = 'h3 bg-gray-300 rounded w-full';
    bio.appendChild(line);
  }

  header.append(avatar, name, email, credits);
  skeleton.append(banner, header, bio);

  return skeleton;
}
