export function SkeletonCard(): HTMLElement {
  const card = document.createElement('article');
  card.className =
    'flex flex-col bg-white rounded-xl shadow-md overflow-hidden border-gray-200 animate-pulse';

  const image = document.createElement('div');
  image.className = 'aspect-square w-full bg-gray-200';

  const body = document.createElement('div');
  body.className = 'p-4 flex-col gap-2 flex-grow';

  const line = (width: string, height = 'h-3') => {
    const div = document.createElement('div');
    div.className = `${height} ${width} bg-gray-200 rounded`;
    return div;
  };

  const bidBox = document.createElement('div');
  bidBox.className =
    'mt-6 p-3 bg-orange-50 rounded-lg border border-orange-100 flex flex-col gap-2';
  bidBox.append(line('w-24', 'h-2'), line('w-full', 'h-4'));

  const footer = document.createElement('div');
  footer.className = 'p-4 bg-gray-50 border-t border-gray-100';
  footer.appendChild(line('w-full', 'h-9'));

  body.append(
    line('w-24'),
    line('w-32'),
    line('w-3/4', 'h-4'),
    line('w-full'),
    line('w-full'),
    line('w-2/3'),
    bidBox,
    line('w-20'),
  );
  card.append(image, body, footer);

  return card;
}
