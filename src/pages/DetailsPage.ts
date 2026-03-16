/**Renders the main Details Page structure */
// src/pages/DetailsPage.ts
export function DetailsPage() {
  const app = document.querySelector('#content-area');
  if (!app) return;

  app.textContent = '';

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'No ID found';

  const container = document.createElement('div');
  container.className = 'p-6';

  const heading = document.createElement('h1');
  heading.className = 'text-3xl font-bold text-navy';
  heading.textContent = 'Auction Details';

  const info = document.createElement('p');
  info.className = 'mt-2 text-gray-600';
  info.textContent = 'Viewing Listing ID: ';

  const idSpan = document.createElement('span');
  idSpan.className = 'font-mono text-(--color-cyan)';
  idSpan.textContent = id;

  const backLink = document.createElement('a');
  backLink.href = '/';
  backLink.className = 'mt-4 inline-block text-navy hover:underline';
  backLink.textContent = '⬅️ Back to Home';

  info.appendChild(idSpan);
  container.append(heading, info, backLink);
  app.appendChild(container);
}
