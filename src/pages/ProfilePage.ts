import {
  fetchProfile,
  fetchProfileListings,
  fetchProfileBids,
  fetchProfileWins,
} from '../api/Profile';
import { store } from '../utils/store';
import type { Profile } from '../types/Profile';
import { SkeletonProfile } from '../components/SkeletonProfile';
import type { Listing, UserBid } from '../types/Listing';
import type { ApiResponse } from '../types/Api';
import { EditProfileModal } from '../components/EditProfileModal';
import { ListingForm } from '../components/ListingForm';
import { router } from '../router/router';
import { showDeleteConfirmation } from '../components/ConfirmModal';
import { showToast } from '../components/Toast';

export async function ProfilePage(): Promise<HTMLElement> {
  const pageContainer = document.createElement('div');
  pageContainer.className =
    'w-full flex flex-col items-center justify-center py-12';

  const profileCard = document.createElement('div');
  profileCard.className =
    'w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100';

  pageContainer.appendChild(profileCard);

  const skeleton = SkeletonProfile();
  profileCard.appendChild(skeleton);

  fetchAndRender();

  return pageContainer;

  async function fetchAndRender() {
    const user = store.getUser();

    let profileData: Profile | null = user;
    let fetchFailed = false;

    try {
      if (user?.name) {
        const response = await fetchProfile(user.name);
        if (response?.data) {
          profileData = response.data;
          store.updateUser(response.data);
        }
      }
    } catch (_error) {
      showToast('Failed to fetch profile. Please try again.', 'error');
      fetchFailed = true;
    }

    profileCard.replaceChildren();

    if (!profileData) {
      const errorMsg = document.createElement('p');
      errorMsg.className = 'text-red-500 text-center';
      errorMsg.textContent = 'Failed to load profile. Please try again.';

      if (fetchFailed) {
        const warning = document.createElement('p');
        warning.className = 'text-yellow-600 text-sm text-center mb-2';
        warning.textContent = 'Showing cached profile (offline)';
        profileCard.appendChild(warning);
      }

      profileCard.appendChild(errorMsg);
      return pageContainer;
    }

    const banner = document.createElement('div');
    banner.className =
      'w-full h-40 bg-gradient-to-r from-navy to-navy/50 rounded-lg mb-6';

    if (profileData?.banner?.url) {
      const img = document.createElement('img');
      img.src = profileData.banner.url;
      img.alt = profileData.banner.alt || `${profileData.name}'s banner`;
      img.className = 'w-full h-full rounded-lg object-cover';
      banner.appendChild(img);
    } else {
      banner.classList.add('bg-gradient-to-r', 'from-navy', 'to-navy/50');
    }

    const header = document.createElement('div');
    header.className = 'relative w-full -mt-12 mb-4';

    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'relative z-10 flex items-center gap-4';

    const userInitials =
      profileData?.name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase() ||
      profileData?.email?.[0]?.toUpperCase() ||
      '?';

    const avatar = document.createElement('div');
    avatar.className =
      'w-24 h-24 rounded-full bg-navy border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-lg mx-auto';

    if (profileData?.avatar?.url) {
      const img = document.createElement('img');
      img.src = profileData.avatar.url;
      img.alt = profileData.avatar.alt || `${profileData.name}'s avatar`;
      img.className = 'w-full h-full rounded-full object-cover';
      avatar.appendChild(img);
    } else {
      avatar.textContent = userInitials;
    }

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';

    const editButton = document.createElement('button');
    editButton.className = 'button-action';
    editButton.textContent = 'Edit';

    editButton.addEventListener('click', () => {
      const modal = EditProfileModal(profileData!, (_updatedData) => {
        setTimeout(() => window.location.reload(), 1500);
      });
      document.body.appendChild(modal);
    });

    const createListingButton = document.createElement('button');
    createListingButton.className = 'button-action';
    createListingButton.textContent = 'Create';

    createListingButton.addEventListener('click', () => {
      const modal = ListingForm(undefined, () => {
        router();
      });
      document.body.append(modal);
    });

    const name = document.createElement('h3');
    name.className = 'text-lg font-bold font-sans mt-2 text-navy';
    name.textContent = profileData?.name || 'Unknown User';

    const email = document.createElement('p');
    email.className = 'text-sm text-gray-500';
    email.textContent = profileData?.email || 'user@stud.noroff.no';

    const credits = document.createElement('p');
    credits.className =
      'max-w-max text-xs md:text-sm font-semibold font-mono text-navy uppercase bg-gray-200 p-2 rounded-full mt-2';
    if (profileData?.name === store.getUser()?.name) {
      credits.textContent = `Credits: ${profileData?.credits ?? 0}`;
    } else {
      credits.style.display = 'none';
    }
    const bio = document.createElement('p');
    bio.className = 'text-sm text-gray-600 mt-4 text-center max-w-md mx-auto';
    bio.textContent = profileData?.bio || 'No bio added yet.';

    actions.append(editButton, createListingButton);
    avatarWrapper.append(avatar, actions);
    header.append(avatarWrapper, name, email, credits);
    profileCard.append(banner, header, bio);

    const tabs = document.createElement('div');
    tabs.className =
      'flex gap-6 mt-8 border-t border-gray-300 pt-4 justify-center';

    const listingsTab = document.createElement('button');
    listingsTab.textContent = 'Listings';
    listingsTab.className =
      'font-bold text-navy hover:text-navy/90 pb-1 border-b-2 border-transparent hover:border-navy transition-all';

    const bidsTab = document.createElement('button');
    bidsTab.textContent = 'Bids';
    bidsTab.className =
      'font-bold text-navy hover:text-navy/90 pb-1 border-b-2 border-transparent hover:border-navy transition-all';

    const winsTab = document.createElement('button');
    winsTab.textContent = 'Wins';
    winsTab.className =
      'font-bold text-navy hover:text-navy/90 pb-1 border-b-2 border-transparent hover:border-navy transition-all';

    tabs.append(listingsTab, bidsTab, winsTab);
    profileCard.appendChild(tabs);

    const tabContent = document.createElement('div');
    tabContent.className = 'mt-6 text-center text-gray-500';
    profileCard.appendChild(tabContent);

    const tabsConfig = [
      { name: 'Listings', element: listingsTab },
      { name: 'Bids', element: bidsTab },
      { name: 'Wins', element: winsTab },
    ];

    async function renderTab<T>(
      label: string,
      fetchFn: () => Promise<ApiResponse<T[]> | null>,
      renderItemFn: (_item: T) => HTMLElement,
    ) {
      tabContent.replaceChildren();

      const loading = document.createElement('p');
      loading.className = 'text-gray-400 italic py-4';
      loading.textContent = `Loading ${label}...`;
      tabContent.appendChild(loading);

      try {
        const result = await fetchFn();
        const data = result?.data || [];

        tabContent.replaceChildren();

        if (data.length === 0) {
          const empty = document.createElement('p');
          empty.className = 'py-4 text-gray-400';
          empty.textContent = `No ${label} found.`;
          tabContent.appendChild(empty);
          return;
        }

        data.forEach((item) => {
          const element = renderItemFn(item);
          tabContent.appendChild(element);
        });
      } catch {
        showToast(`Failed to load ${label}.`, 'error');
        tabContent.textContent = `Failed to load ${label}.`;
      }
    }

    function setActiveTab(tab: string) {
      tabsConfig.forEach(({ element }) => {
        element.classList.remove('border-navy', 'text-navy');
        element.classList.add('border-transparent', 'text-gray-400');
      });
      const active = tabsConfig.find((t) => t.name === tab);
      if (active) {
        active?.element.classList.remove('border-transparent', 'text-gray-400');
        active?.element.classList.add('border-navy', 'text-navy');
      }

      if (tab === 'Listings') {
        renderTab<Listing>(
          'listings',
          () => fetchProfileListings(profileData!.name),
          (item) => {
            const container = document.createElement('div');
            container.className =
              'p-4 border rounded-xl mb-2 text-left flex flex-col gap-2 group hover:border-navy transition-all bg-white shadow-sm';

            const topRow = document.createElement('div');
            topRow.className = 'flex justify-between items-center w-full';

            const title = document.createElement('span');
            title.className =
              'font-semibold text-navy truncate cursor-pointer hover:underline';
            title.textContent = `${item.title} ↗`;

            title.addEventListener('click', () => {
              window.history.pushState(
                {},
                '',
                `/listing/index.html?id=${item.id}`,
              );
              router();
            });

            const actionsWrapper = document.createElement('div');
            actionsWrapper.className = 'flex gap-2';

            const editBtn = document.createElement('button');
            editBtn.className = 'button-action';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
              const modal = ListingForm(item, () => setActiveTab('Listings'));
              document.body.append(modal);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'button-action';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
              showDeleteConfirmation(item.id, () => setActiveTab('Listings'));
            });
            actionsWrapper.append(editBtn, deleteBtn);
            topRow.append(title, actionsWrapper);

            const tagsWrapper = document.createElement('div');
            tagsWrapper.className = 'flex flex-wrap gap-1';

            if (item.tags && item.tags.length > 0) {
              item.tags.forEach((tag) => {
                const tagBadge = document.createElement('span');
                tagBadge.className =
                  'text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono';
                tagBadge.textContent = `#${tag}`;
                tagsWrapper.appendChild(tagBadge);
              });
            }
            container.append(topRow, tagsWrapper);
            return container;
          },
        );
      }
      if (tab === 'Bids') {
        renderTab<UserBid>(
          'bids',
          () => fetchProfileBids(profileData!.name),
          (item) => {
            const container = document.createElement('div');
            container.className =
              'p-4 border rounded-xl mb-2 text-left flex justify-between items-center bg-white shadow-sm hover:border-navy transition-all group';

            const infoWrapper = document.createElement('div');
            infoWrapper.className = 'flex flex-col';

            const title = document.createElement('span');
            title.className =
              'font-semibold text-navy cursor-pointer hover:underline';
            title.textContent = `${item.listing?.title || 'Unknown Listing'} ↗`;

            title.addEventListener('click', () => {
              window.history.pushState(
                {},
                '',
                `/listing/index.html?id=${item.listing?.id}`,
              );
              router();
            });

            const date = document.createElement('span');
            date.className = 'text-xs text-gray-400 font-mono';
            date.textContent = new Date(item.created).toLocaleDateString();

            infoWrapper.append(title, date);

            const amount = document.createElement('span');
            amount.className =
              'font-mono text-sm text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full';
            amount.textContent = `${item.amount}credits`;

            container.append(infoWrapper, amount);
            return container;
          },
        );
      }
      if (tab === 'Wins') {
        renderTab<Listing>(
          'wins',
          () => fetchProfileWins(profileData!.name),
          (item) => {
            const container = document.createElement('div');
            container.className =
              'p-4 border border-green-200 rounded-xl mb-2 text-left flex justify-between items-center bg-green-50 shadow-sm hover:border-green-400 transition-all group';

            const infoWrapper = document.createElement('div');
            infoWrapper.className = 'flex flex-col';

            const title = document.createElement('span');
            title.className =
              'font-semibold text-navy cursor-pointer hover:underline';
            title.textContent = `🎉 ${item.title} ↗`;

            title.addEventListener('click', () => {
              window.history.pushState(
                {},
                '',
                `/listing/index.html?id=${item.id}`,
              );
              router();
            });

            const status = document.createElement('span');
            status.className = 'text-xs text-green-700 font-medium italic';
            status.textContent = 'Auction Won';

            infoWrapper.append(title, status);

            const priceWrapper = document.createElement('div');
            priceWrapper.className = 'flex flex-col items-end';

            const amount = document.createElement('span');
            amount.className =
              'font-bold text-green-700 bg-white border border-green-200 px-3 py-1 rounded-full text-sm shadow-sm';
            amount.textContent = `${item.bids?.sort((a, b) => b.amount - a.amount)[0].amount || 0} credits`;

            priceWrapper.append(amount);

            container.append(infoWrapper, priceWrapper);
            return container;
          },
        );
      }
    }

    tabsConfig.forEach(({ name, element }) => {
      element.addEventListener('click', () => setActiveTab(name));
    });

    setActiveTab('Listings');

    return pageContainer;
  }
}
