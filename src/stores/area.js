import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAreaStore = defineStore('area', () => {
  const currCity = ref('臺北市');
  const currDistrict = ref('');
  const allData = ref([]);

  const cityList = computed(() => {
    const cities = allData.value.map((item) => item.name);
    return [...new Set(cities)];
  });

  const districtList = computed(() => {
    const cityObj = allData.value.find((item) => item.name === currCity.value);
    return cityObj ? cityObj.districts : [];
  });

  const currDistrictInfo = computed(() => {
    const cityObj = districtList.value.find((item) => item.name === currDistrict.value);
    return cityObj || null;
  });

  async function fetchAreaData() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/kurotanshi/mask-map/master/raw/area-location.json',
      );
      const data = await response.json();
      allData.value = data;
    } catch (error) {
      console.error('抓取資料失敗:', error);
    }
  }

  return {
    currCity,
    currDistrict,
    currDistrictInfo,
    allData,
    cityList,
    districtList,
    fetchAreaData,
  };
});
