import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useAreaStore = defineStore('area', () => {
  const areaData = ref([]);
  const currCity = ref('');
  const currDistrict = ref('');

  const cityList = computed(() => {
    const cities = areaData.value.map((item) => item.name);
    return [...new Set(cities)];
  });

  watch(cityList, () => {
    currCity.value = cityList.value.length > 0 ? cityList.value[0] : '';
  });

  const districtList = computed(() => {
    const cityObj = areaData.value.find((item) => item.name === currCity.value);
    return cityObj ? cityObj.districts : [];
  });

  watch(districtList, () => {
    currDistrict.value = districtList.value.length > 0 ? districtList.value[0].name : '';
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
      areaData.value = data;
    } catch (error) {
      console.error('抓取資料失敗:', error);
    }
  }

  return {
    areaData,
    currCity,
    currDistrict,
    currDistrictInfo,
    cityList,
    districtList,
    fetchAreaData,
  };
});
