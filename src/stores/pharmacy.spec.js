import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockPharmacyData } from '../__mocks__/pharmacyData';
import { usePharmacyStore } from './pharmacy';

describe('usePharmacyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('currOpenedPharmacy computed', () => {
    it('should return undefined when currOpenedId is null', () => {
      const store = usePharmacyStore();
      store.pharmacyData = mockPharmacyData;
      store.currOpenedId = null;

      expect(store.currOpenedPharmacy).toBeUndefined();
    });

    it('should return current opened pharmacy', () => {
      const store = usePharmacyStore();
      store.pharmacyData = mockPharmacyData;
      store.currOpenedId = '1';

      expect(store.currOpenedPharmacy).toEqual(mockPharmacyData[0]);
    });

    it('should return undefined when pharmacy not found', () => {
      const store = usePharmacyStore();
      store.pharmacyData = mockPharmacyData;
      store.currOpenedId = '999';

      expect(store.currOpenedPharmacy).toBeUndefined();
    });
  });

  describe('fetchPharmacies', () => {
    it('should fetch and transform GeoJSON data successfully', async () => {
      const store = usePharmacyStore();

      const mockGeoJSON = {
        features: [
          {
            properties: {
              id: '1',
              name: '健康藥局',
              county: '台北市',
              town: '大安區',
            },
            geometry: {
              coordinates: [121.543, 25.033], // [longitude, latitude]
            },
          },
        ],
      };

      fetch.mockResolvedValueOnce({
        json: async () => mockGeoJSON,
      });

      expect(store.isLoading).toBe(false);

      await store.fetchPharmacies();

      expect(fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
      );
      expect(store.pharmacyData).toEqual([
        {
          id: '1',
          name: '健康藥局',
          county: '台北市',
          town: '大安區',
          latitude: 25.033,
          longitude: 121.543,
        },
      ]);
      expect(store.isLoading).toBe(false);
    });

    it('should handle fetch error and reset loading state', async () => {
      const store = usePharmacyStore();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      fetch.mockRejectedValueOnce(new Error('Network error'));

      await store.fetchPharmacies();

      expect(consoleErrorSpy).toHaveBeenCalledWith('抓取資料失敗', expect.any(Error));
      expect(store.isLoading).toBe(false);
      expect(store.pharmacyData).toEqual([]);

      consoleErrorSpy.mockRestore();
    });

    it('should set isLoading to true during fetch', async () => {
      const store = usePharmacyStore();

      let resolvePromise;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      fetch.mockReturnValueOnce(pendingPromise);

      const fetchPromise = store.fetchPharmacies();

      // Check loading state is true during fetch
      expect(store.isLoading).toBe(true);

      // Resolve the promise
      resolvePromise({ json: async () => ({ features: [] }) });
      await fetchPromise;

      // Check loading state is false after fetch
      expect(store.isLoading).toBe(false);
    });
  });
});
