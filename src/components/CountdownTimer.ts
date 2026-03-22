import { getCountdown } from '../utils/dateFormatter';

export function CountdownTimer(
  endsAt: string,
  variant: 'card' | 'details' = 'card',
): HTMLElement {
  const container = document.createElement('div');

  if (variant === 'card') {
    container.className =
      'absolute top-2 right-2 bg-orange-100 p-1 rounded shadow-sm flex gap-1 items-center border border-orange-600';
  } else {
    container.className =
      'bg-orange-100 p-2 rounded-xl shadow-sm flex gap-6 items-center border border-orange-600 w-fit';
  }

  const createBox = (label: string) => {
    const box = document.createElement('div');
    box.className = 'flex flex-col items-center leading-none px-1';
    const valSpan = document.createElement('span');
    valSpan.className =
      variant === 'card'
        ? 'text-xs font-bold text-navy font-mono'
        : 'text-2xl font-bold text-navy font-mono';
    const labelSpan = document.createElement('span');
    labelSpan.className =
      variant === 'card'
        ? 'text-[7px] uppercase text-gray-400'
        : 'text-[10px] uppercase text-gray-400';
    labelSpan.textContent = label;
    box.append(valSpan, labelSpan);
    return { box, valSpan };
  };

  const days = createBox('Days');
  const hours = createBox('Hrs');
  const min = createBox('Min');

  const updateTimer = () => {
    const currentTime = getCountdown(endsAt);

    if (currentTime.isExpired) {
      container.replaceChildren();
      const expiredMsg = document.createElement('span');
      expiredMsg.className =
        'text-cyan font-semibold tracking-wider text-center text-[10px] px-2';
      expiredMsg.textContent = '⏱️ Ended';

      if (variant === 'card') {
        container.className =
          'absolute top-2 right-2 bg-cyan-50 border border-cyan rounded px-2 py-1 flex justify-center items-center shadow-sm z-10';
      } else {
        container.className =
          'p-4 bg-cyan-50 border-2 border-dashed border-cyan rounded-xl flex w-full justify-center font-mono';
        expiredMsg.className =
          'text-cyan font-semibold tracking-wider text-center px-4';
        expiredMsg.textContent = '⏱️ This Auction Has Ended';
      }

      container.appendChild(expiredMsg);
      clearInterval(timerId);
      return;
    }

    days.valSpan.textContent = currentTime.days;
    hours.valSpan.textContent = currentTime.hours;
    min.valSpan.textContent = currentTime.minutes;
  };

  container.append(days.box, hours.box, min.box);
  const timerId = setInterval(updateTimer, 60000);
  updateTimer();

  return container;
}
