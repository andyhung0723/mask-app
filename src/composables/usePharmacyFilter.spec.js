import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { mockPharmacyData } from '../__mocks__/pharmacyData';
import { useAreaStore } from '../stores/area';
import { usePharmacyStore } from '../stores/pharmacy';
import { usePharmacyFilter } from './usePharmacyFilter';

describe('usePharmacyFilter', () => {
  let areaStore;
  let pharmacyStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    areaStore = useAreaStore();
    pharmacyStore = usePharmacyStore();
    pharmacyStore.pharmacyData = mockPharmacyData;
  });

  it('should filter by city and district', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '大安區';
    pharmacyStore.keyword = '';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([mockPharmacyData[0]]);
  });

  it('should filter by city, district and keyword', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '大安區';
    pharmacyStore.keyword = '健康';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([mockPharmacyData[0]]);
  });

  it('should return empty when keyword not match', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '大安區';
    pharmacyStore.keyword = '不存在的藥局';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([]);
  });

  it('should return empty when city not match', () => {
    areaStore.currCity = '高雄市';
    areaStore.currDistrict = '大安區';
    pharmacyStore.keyword = '';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([]);
  });

  it('should return empty when district not match', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '中山區';
    pharmacyStore.keyword = '';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([]);
  });

  it('should filter multiple pharmacies in same district', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '信義區';
    pharmacyStore.keyword = '';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([mockPharmacyData[1]]);
  });

  it('should handle empty keyword (show all in district)', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '大安區';
    pharmacyStore.keyword = '';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([mockPharmacyData[0]]);
  });

  it('should handle partial keyword match', () => {
    areaStore.currCity = '台北市';
    areaStore.currDistrict = '信義區';
    pharmacyStore.keyword = '安心';

    const { filteredPharmacies } = usePharmacyFilter();

    expect(filteredPharmacies.value).toEqual([mockPharmacyData[1]]);
  });
});
