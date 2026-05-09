import type { Listing } from '../types/Listing';
import { showDeleteConfirmation } from './ConfirmModal';
import { createListing, updateListing } from '../api/Listings';
import { showToast } from './Toast';

export function ListingForm(
  existingListing?: Listing,
  onSuccess?: () => void,
): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm';

  const container = document.createElement('div');
  container.className = 'bg-white rounded-xl shadow-2xl w-full max-w-md p-6';

  const title = document.createElement('h2');
  title.textContent = existingListing ? 'Edit Listing' : 'Create Listing';
  title.className = 'text-2xl font-sans font-bold text-navy mb-6 text-center';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const createField = (
    label: string,
    name: string,
    value: string,
    type = 'text',
    isRequired = false,
  ) => {
    const wrapper = document.createElement('div');
    const lbl = document.createElement('label');
    lbl.className = 'block text-sm font-semibold mb-1';
    lbl.textContent = label;

    const input = document.createElement(
      type === 'textarea' ? 'textarea' : 'input',
    ) as HTMLInputElement;
    input.name = name;
    input.required = isRequired;
    input.value = value;
    input.className =
      'w-full p-2 border rounded-lg focus:ring-2 focus:ring-navy/20 outline-none';
    if (type !== 'textarea') {
      input.type = type;
    } else {
      input.classList.add('h-24');
    }

    wrapper.append(lbl, input);
    return { wrapper, input };
  };

  const titleField = createField(
    'Title',
    'title',
    existingListing?.title || '',
    'text',
    true,
  );
  const descriptionField = createField(
    'Description',
    'description',
    existingListing?.description || '',
    'textarea',
    true,
  );

  const deadlineField = createField(
    'End date and Time',
    'endsAt',
    existingListing?.endsAt
      ? new Date(existingListing.endsAt).toISOString().slice(0, 16)
      : '',
    'datetime-local',
    true,
  );

  const tagsField = createField(
    'Tags (comma separated',
    'tags',
    existingListing?.tags?.join(', ') || '',
    'text',
  );

  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'flex flex-col gap-2';
  const mediaLabel = document.createElement('label');
  mediaLabel.className = 'block text-sm font-semi-bold';
  mediaLabel.textContent = 'Media Images (Max 4)';
  mediaContainer.append(mediaLabel);

  const mediaInputs: HTMLInputElement[] = [];
  const addMediaInput = (url = '') => {
    if (mediaInputs.length >= 4) return;
    const { wrapper, input } = createField(
      `Image ${mediaInputs.length + 1} URL`,
      'media',
      url,
      'url',
    );
    mediaInputs.push(input);
    mediaContainer.insertBefore(wrapper, addButton);
    if (mediaInputs.length === 4) addButton.classList.add('hidden');
  };

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'button-action bg-cyan-600/20 border border-navy';
  addButton.textContent = '+ Image';

  addButton.addEventListener('click', () => {
    addMediaInput();
  });

  mediaContainer.append(addButton);

  if (existingListing?.media?.length) {
    existingListing.media.forEach((m) => addMediaInput(m.url));
  } else {
    addMediaInput();
  }

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'flex flex-wrap gap-2 mt-4';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className =
    'button-action bg-cyan/10 font-bold border border-navy';
  submitButton.textContent = existingListing
    ? 'Save Changes'
    : 'Create Listing';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'button-action border border-navy';
  cancelBtn.textContent = 'Cancel';

  cancelBtn.addEventListener('click', () => {
    overlay.remove();
  });

  buttonWrapper.append(cancelBtn, submitButton);

  if (existingListing) {
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className =
      'button-action bg-error/10 text-navy border border-error';
    deleteBtn.textContent = 'Delete Listing';

    deleteBtn.addEventListener('click', () => {
      showDeleteConfirmation(existingListing.id, () => {
        overlay.remove();
        if (onSuccess) onSuccess();
      });
    });

    buttonWrapper.append(deleteBtn);
  }

  form.onsubmit = async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Saving...';

    const media = mediaInputs
      .filter((i) => i.value.trim() !== '')
      .map((i) => ({ url: i.value, alt: titleField.input.value }));

    const tags = tagsField.input.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    const payload = {
      title: titleField.input.value,
      description: descriptionField.input.value,
      endsAt: new Date(deadlineField.input.value).toISOString(),
      media: media,
      tags: tags,
    };

    try {
      let response;
      if (existingListing) {
        response = await updateListing(existingListing.id, payload);
      } else {
        response = await createListing(payload);
      }

      if (response?.data) {
        if (onSuccess) onSuccess();
        overlay.remove();
      }
    } catch (_error) {
      showToast(
        existingListing
          ? 'Failed to save changes. Please try again.'
          : 'Failed to create listing. Please try again.',
        'error',
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  };

  form.append(
    titleField.wrapper,
    descriptionField.wrapper,
    deadlineField.wrapper,
    tagsField.wrapper,
    mediaContainer,
    buttonWrapper,
  );
  container.append(title, form);
  overlay.append(container);

  return overlay;
}
