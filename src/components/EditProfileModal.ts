import type { Profile } from '../types/Profile';
import { store } from '../utils/store';
import { updateProfile } from '../api/Profile';
import { showToast } from './Toast';

export function EditProfileModal(
  currentProfile: Profile,
  onSuccess: (updated: Profile) => void,
): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm';

  const modalContainer = document.createElement('div');
  modalContainer.className =
    'bg-white rounded-xl shadow-2xl w-full max-w-md p-6';

  const title = document.createElement('h2');
  title.textContent = 'Edit Profile';
  title.className = 'text-xl font-bold text-navy mb-4';

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const createField = (
    label: string,
    name: string,
    value: string,
    type = 'text',
  ) => {
    const wrapper = document.createElement('div');
    const lbl = document.createElement('label');
    lbl.className = 'block text-sm font-semibold mb-1';
    lbl.textContent = label;

    const input = document.createElement(
      type === 'textarea' ? 'textarea' : 'input',
    ) as HTMLInputElement | HTMLTextAreaElement;
    input.name = name;
    input.className =
      'w-full p-2 border rounded-lg focus:ring-2 focus:ring-navy/20 outline-none';
    input.value = value;
    if (type !== 'textarea' && input instanceof HTMLInputElement) {
      input.type = type;
    }
    if (type === 'textarea') input.classList.add('h-24');

    wrapper.append(lbl, input);
    return { wrapper, input };
  };

  const avatarField = createField(
    'Avatar URL',
    'avatar',
    currentProfile.avatar?.url || '',
    'url',
  );
  const bannerField = createField(
    'Banner URL',
    'banner',
    currentProfile.banner?.url || '',
    'url',
  );
  const bioField = createField(
    'Bio',
    'bio',
    currentProfile.bio || '',
    'textarea',
  );

  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'flex gap-2 mt-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'flex-1 py-2 border rounded-lg hover:bg-gray-50';
  cancelBtn.textContent = 'Cancel';

  cancelBtn.addEventListener('click', () => {
    overlay.remove();
  });

  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className =
    'flex-1 py-2 bg-navy text-white rounded-lg text-sm hover:bg-navy/90 font-bold';
  saveBtn.textContent = 'Save Changes';

  const errorMsg = document.createElement('p');
  errorMsg.className = 'text-red-500 text-sm hidden mt-2 text-center';
  errorMsg.textContent =
    'Failed to update profile. Please check the URLs and try again.';

  btnWrapper.append(cancelBtn, saveBtn);
  form.append(
    avatarField.wrapper,
    bannerField.wrapper,
    bioField.wrapper,
    errorMsg,
    btnWrapper,
  );
  modalContainer.append(title, form);
  overlay.append(modalContainer);

  form.onsubmit = async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const updateProfileData = {
      avatar: {
        url: (avatarField.input as HTMLInputElement).value,
        alt: `${currentProfile.name}'s avatar`,
      },
      banner: {
        url: (bannerField.input as HTMLInputElement).value,
        alt: `${currentProfile.name}'s banner`,
      },
      bio: (bioField.input as HTMLTextAreaElement).value,
    };
    try {
      const response = await updateProfile(
        currentProfile.name,
        updateProfileData,
      );
      if (response?.data) {
        const currentUser = store.getUser();
        if (currentUser) {
          store.updateUser({ ...currentUser, ...response?.data });
        }
        showToast('Profile was successfully updated', 'success');
        onSuccess(response.data);
        overlay.remove();
      }
    } catch (_error) {
      showToast('Update failed. Please try again.', 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
    }
  };
  return overlay;
}
