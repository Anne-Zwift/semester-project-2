import { getMostPopularListings } from '../utils/sortHelpers';
import type { Listing } from '../types/Listing';
import { ListingCard } from './ListingCard';

export function Carousel(allListings: Listing[]): HTMLElement {
  const popularItems = getMostPopularListings(allListings, 6);

  const section = document.createElement('section');
  section.className = 'w-full my-10 px-4 md:px-0 pb-2 relative group';
  section.setAttribute('aria-label', 'popular Auctions');

  const title = document.createElement('h2');
  title.className =
    'text-2xl font-extrabold text-navy mb-6 flex items-center gap-2 animate-pulse';
  title.textContent = 'Trending Auctions';

  section.appendChild(title);

  const track = document.createElement('div');
  track.className =
    'flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-5 mb-2' +
    'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent cursor-grab';

  popularItems.forEach((item) => {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'snap-start shrink-0 w-2xs sm:w-xs md:w-sm';

    const card = ListingCard(item);
    cardContainer.appendChild(card);
    track.appendChild(cardContainer);
  });

  section.appendChild(track);

  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;

    track.style.scrollBehavior = 'auto';
    track.style.scrollSnapType = 'none';
  });

  const stopDragging = () => {
    if (!isDown) return;
    isDown = false;
    track.style.scrollBehavior = 'smooth';
    track.style.scrollSnapType = 'x mandatory';
  };

  track.addEventListener('mouseleave', stopDragging);
  track.addEventListener('mouseup', stopDragging);

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  const prevBtn = document.createElement('button');
  prevBtn.className =
    'absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 ' +
    'w-11 h-11 rounded-full items-center justify-center shadow-md text-navy font-bold ' +
    'hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10';
  prevBtn.textContent = '←';
  prevBtn.setAttribute('aria-label', 'Scroll popular items left');

  const nextBtn = document.createElement('button');
  nextBtn.className =
    'absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 ' +
    'w-11 h-11 rounded-full items-center justify-center shadow-md text-navy font-bold ' +
    'hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10';
  nextBtn.textContent = '→';
  nextBtn.setAttribute('aria-label', 'Scroll popular items right');

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -374, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 374, behavior: 'smooth' });
  });

  section.append(prevBtn, nextBtn);

  return section;
}
