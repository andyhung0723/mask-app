import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mockAreaData } from '../__mocks__/areaData';
import { useAreaStore } from './area';

describe('useAreaStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('cityList computed', () => {
    it('should return empty array when areaData is empty', () => {
      const store = useAreaStore();
      expect(store.cityList).toEqual([]);
    });

    it('should return unique city names', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      expect(store.cityList).toEqual(['台北市', '新北市']);
    });

    it('should remove duplicates if exist', () => {
      const store = useAreaStore();
      store.areaData = [
        { name: '台北市', districts: [] },
        { name: '台北市', districts: [] },
        { name: '新北市', districts: [] },
      ];
      expect(store.cityList).toEqual(['台北市', '新北市']);
    });
  });

  describe('districtList computed', () => {
    it('should return empty array when currCity is not set', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      store.currCity = '';
      expect(store.districtList).toEqual([]);
    });

    it('should return districts of current city', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      store.currCity = '台北市';
      expect(store.districtList).toEqual([
        { id: 1, name: '大安區', latitude: 25.033, longitude: 121.543 },
        { id: 2, name: '信義區', latitude: 25.033, longitude: 121.565 },
      ]);
    });

    it('should return empty array when city not found', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      store.currCity = '不存在的市';
      expect(store.districtList).toEqual([]);
    });
  });

  describe('currDistrictInfo computed', () => {
    it('should return null when currDistrict is not set', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      store.currCity = '台北市';
      store.currDistrict = '';
      expect(store.currDistrictInfo).toBeNull();
    });

    it('should return current district info', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      store.currCity = '台北市';
      store.currDistrict = '大安區';
      expect(store.currDistrictInfo).toEqual({
        id: 1,
        name: '大安區',
        latitude: 25.033,
        longitude: 121.543,
      });
    });

    it('should return null when district not found', () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      store.currCity = '台北市';
      store.currDistrict = '不存在的區';
      expect(store.currDistrictInfo).toBeNull();
    });
  });

  describe('fetchAreaData', () => {
    it('should fetch and set area data successfully', async () => {
      const store = useAreaStore();

      fetch.mockResolvedValueOnce({
        json: async () => mockAreaData,
      });

      await store.fetchAreaData();

      expect(fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json',
      );
      expect(store.areaData).toEqual(mockAreaData);
    });

    it('should handle fetch error', async () => {
      const store = useAreaStore();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      fetch.mockRejectedValueOnce(new Error('Network error'));

      await store.fetchAreaData();

      expect(consoleErrorSpy).toHaveBeenCalledWith('抓取資料失敗:', expect.any(Error));
      expect(store.areaData).toEqual([]);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('watch side effects', () => {
    it('should auto-update currCity when cityList changes', async () => {
      const store = useAreaStore();
      expect(store.currCity).toBe('');

      store.areaData = mockAreaData;
      await nextTick();

      expect(store.currCity).toBe('台北市');
    });

    it('should auto-update currDistrict when districtList changes', async () => {
      const store = useAreaStore();
      store.areaData = mockAreaData;
      await nextTick();

      expect(store.currDistrict).toBe('大安區');

      store.currCity = '新北市';
      await nextTick();

      expect(store.currDistrict).toBe('板橋區');
    });
  });
});
