import type { ToastType } from '../types/UI';

export function showToast(
  message: string,
  type: ToastType = 'success',
  duration = 3000,
): void {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl font-sans text-sm text-white transition-all duration-300 opacity-0 ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-yellow-500'}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.replace('opacity-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
