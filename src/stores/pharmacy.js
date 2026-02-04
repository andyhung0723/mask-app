import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePharmacyStore = defineStore('pharmacy', () => {
  const pharmacyData = ref([]);
  const keyword = ref('');
  const showModal = ref(false);
  const currOpenedId = ref(null);

  const currOpenedPharmacy = computed(() => {
    return pharmacyData.value.find((pharmacy) => pharmacy.id === currOpenedId.value);
  });

  async function fetchPharmacies() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',
      );
      const data = await response.json();

      pharmacyData.value = data.features.map((d) => ({
        ...d.properties,
        latitude: d.geometry.coordinates[1],
        longitude: d.geometry.coordinates[0],
      }));
    } catch (error) {
      console.error('抓取資料失敗', error);
    }
  }

  return {
    pharmacyData,
    keyword,
    currOpenedId,
    currOpenedPharmacy,
    showModal,
    fetchPharmacies,
  };
});
