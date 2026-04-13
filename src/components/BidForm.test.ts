import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BidForm } from './BidForm';
import { placeBid } from '../api/Listings';
import { store } from '../utils/store';
import { router } from '../router/router';
import type { Bid, Listing } from '../types/Listing';
import type { ApiResponse } from '../types/Api';

// Mocking dependencies
vi.mock('../api/Listings', () => ({ placeBid: vi.fn() }));
vi.mock('../router/router', () => ({ router: vi.fn() }));
vi.mock('../utils/store', () => ({
  store: {
    getUser: vi.fn(),
    getToken: vi.fn(),
    fetchAndUpdateProfile: vi.fn(),
  },
}));

describe('BidForm Component', () => {
  const mockItem = {
    id: '123',
    endsAt: '2099-01-01T00:00:00Z',
    seller: { name: 'OtherUser' },
    bids: [{ amount: 500 }],
  };

  const mockProfile = {
    name: 'Tester',
    email: 'tester@stud.noroff.no',
    credits: 1000,
    avatar: { url: '', alt: '' },
    banner: { url: '', alt: '' },
  };

  const successResponse: Partial<ApiResponse<Bid>> = {
    data: {
      id: '123',
      amount: 501,
      bidder: mockProfile,
      created: new Date().toISOString(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Group 1: Rendering & Permissions (The Gatekeepers)
   */
  describe('Gatekeeper Logic', () => {
    it('shows a login prompt when the user is not authenticated', () => {
      vi.mocked(store.getToken).mockReturnValue(null);

      const container = BidForm(mockItem as unknown as Listing);

      expect(container.textContent).toContain('You have to be logged in');
      expect(container.querySelector('a[href="/login"]')).toBeTruthy();
    });

    it('shows a warning when the logged-in user is the seller', () => {
      vi.mocked(store.getToken).mockReturnValue('valid-token');
      const sellerProfile = { ...mockProfile, name: 'OtherUser' };
      vi.mocked(store.getUser).mockReturnValue(sellerProfile);

      const container = BidForm(mockItem as unknown as Listing);

      expect(container.textContent).toContain(
        'You cannot bid on your own listing',
      );
    });

    it('shows an error when the auction has ended', () => {
      vi.mocked(store.getToken).mockReturnValue('valid-token');
      vi.mocked(store.getUser).mockReturnValue(mockProfile);
      const expiredItem = { ...mockItem, endsAt: '2020-01-01T00:00:00Z' };

      const container = BidForm(expiredItem as unknown as Listing);

      expect(container.textContent).toContain('This auction has ended');
    });
  });

  /**
   * Group 2: User Actions (The Submission Flow)
   */
  describe('Bidding Actions', () => {
    it('successfully places a bid and refreshes UI on valid input', async () => {
      vi.mocked(store.getToken).mockReturnValue('valid-token');
      vi.mocked(store.getUser).mockReturnValue(mockProfile);
      vi.mocked(placeBid).mockResolvedValue(
        successResponse as ApiResponse<Bid>,
      );

      const container = BidForm(mockItem as unknown as Listing);
      const form = container.querySelector('form');
      const input = container.querySelector('input') as HTMLInputElement;

      // Act
      input.value = '501';
      form?.dispatchEvent(new Event('submit'));

      // Assert
      await vi.waitFor(() => {
        expect(placeBid).toHaveBeenCalledWith('123', 501);
        expect(store.fetchAndUpdateProfile).toHaveBeenCalled();
        expect(router).toHaveBeenCalled();
      });
    });

    it('displays an error message when the API call fails', async () => {
      vi.mocked(store.getToken).mockReturnValue('valid-token');
      vi.mocked(store.getUser).mockReturnValue(mockProfile);
      vi.mocked(placeBid).mockRejectedValue(new Error('Insufficient funds'));

      const container = BidForm(mockItem as unknown as Listing);
      const form = container.querySelector('form');

      form?.dispatchEvent(new Event('submit'));

      await vi.waitFor(() => {
        const errorMsg = container.querySelector('.text-error');
        expect(errorMsg?.textContent).toContain('Insufficient funds');
      });
    });
  });
});
