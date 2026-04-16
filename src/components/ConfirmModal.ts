import { deleteListing } from '../api/Listings';

export function showDeleteConfirmation(
  ListingId: string,
  onDeleted: () => void,
) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4 backdrop-blur-sm';

  const box = document.createElement('div');
  box.className =
    'bg-white p-8 rounded-xl max-w-sm w-full text-center shadow-2xl';

  const title = document.createElement('h3');
  title.className = 'text-xl font-sans font-bold text-navy mb-2';
  title.textContent = 'Delete Listing';

  const text = document.createElement('p');
  text.className = 'text-gray-600 mb-8 text-sm';
  text.textContent =
    'This action cannot be undone. Are you sure you want to remove this auction permanently?';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex gap-3';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'button-action';
  cancelBtn.textContent = 'Keep it';
  cancelBtn.addEventListener('click', () => overlay.remove());

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'button-action';
  confirmBtn.textContent = 'Delete';

  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    try {
      await deleteListing(ListingId);
      overlay.remove();
      onDeleted();
    } catch (error) {
      console.error('Delete failed', error);
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Delete';
    }
  });

  buttonContainer.append(cancelBtn, confirmBtn);
  box.append(title, text, buttonContainer);
  overlay.append(box);
  document.body.append(overlay);
}
