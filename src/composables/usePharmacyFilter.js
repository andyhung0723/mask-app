import { useAreaStore } from '@/stores/area';
import { usePharmacyStore } from '@/stores/pharmacy';
import { computed } from 'vue';

export function usePharmacyFilter() {
  const areaStore = useAreaStore();
  const pharmacyStore = usePharmacyStore();

  const filteredPharmacies = computed(() => {
    const { currCity, currDistrict } = areaStore;
    const { pharmacyData, keyword } = pharmacyStore;

    return pharmacyData.filter((p) => {
      return p.county === currCity && p.town === currDistrict && p.name.includes(keyword);
    });
  });

  return { filteredPharmacies };
}
