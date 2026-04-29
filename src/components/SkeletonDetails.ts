export function SkeletonDetails(): HTMLElement {
  const pageWrapper = document.createElement('div');
  pageWrapper.className =
    'max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'flex flex-col gap-4';

  const rightColumn = document.createElement('div');
  rightColumn.className = 'flex flex-col gap-6';

  const line = (width: string, height = 'h-3') => {
    const div = document.createElement('div');
    div.className = `${height} ${width} bg-gray-200 rounded`;
    return div;
  };

  const mainImg = document.createElement('div');
  mainImg.className = 'aspect-video w-full bg-gray-200 rounded-2xl';

  const thumbRow = document.createElement('div');
  thumbRow.className = 'flex gap-2';
  for (let i = 0; i < 4; i++) {
    const thumb = document.createElement('div');
    thumb.className = 'w-20 h-20 bg-gray-200 rounded-lg';
    thumbRow.appendChild(thumb);
  }

  leftColumn.append(mainImg, thumbRow);

  const bidBox = document.createElement('div');
  bidBox.className =
    'p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-4';
  bidBox.append(line('w-48', 'h-4'), line('w-full', 'h-10'));

  const historyBox = document.createElement('div');
  historyBox.className =
    'mt-6 p-3 bg-orange-50 rounded-lg border border-orange-100 flex flex-col gap-2';
  historyBox.append(line('w-24', 'h-2'), line('w-full', 'h-4'));

  rightColumn.append(
    line('w-48', 'h-9'), //back btn
    line('w-3/4', 'h-8'), // title
    line('w-32', 'h-6'), // timer
    line('w-full'), // description
    line('w-full'), // description
    line('w-2/3'), //description
    bidBox,
    historyBox,
  );
  pageWrapper.append(leftColumn, rightColumn);
  return pageWrapper;
}
