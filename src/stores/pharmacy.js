import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAreaStore } from './area';

export const usePharmacyStore = defineStore('pharmacy', () => {
  const allData = ref([]);
  const keyword = ref('');
  const currOpenedId = ref(null);

  const filteredPharmacies = computed(() => {
    const areaStore = useAreaStore();
    return allData.value.filter((pharmacy) => {
      return (
        pharmacy.county === areaStore.currCity &&
        pharmacy.town === areaStore.currDistrict &&
        pharmacy.name.includes(keyword.value)
      );
    });
  });

  const currPharmacy = computed(() => {
    return allData.value.find((pharmacy) => pharmacy.id === currOpenedId.value);
  });

  async function fetchPharmacies() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
      );
      const data = await response.json();

      allData.value = data.features.map((d) => ({
        ...d.properties,
        lat: d.geometry.coordinates[0],
        lng: d.geometry.coordinates[1],
      }));
    } catch (error) {
      console.error('抓取資料失敗', error);
    }
  }

  return {
    allData,
    keyword,
    currOpenedId,
    filteredPharmacies,
    fetchPharmacies,
    currPharmacy,
  };
});
