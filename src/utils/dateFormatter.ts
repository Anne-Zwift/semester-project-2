export function formatStaticDate(dateString: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Date(dateString).toLocaleDateString(undefined, dateOptions);
}

/**
 * Calculates time remaining util date.
 */

export function getCountdown(endsAt: string) {
  const now = new Date().getTime();
  const end = new Date(endsAt).getTime();
  const diff = end - now;

  if (diff < 0) {
    return { days: '00', hours: '00', minutes: '00', isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    isExpired: false,
  };
}
