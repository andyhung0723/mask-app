<script setup>
import { usePharmacyFilter } from '@/composables/usePharmacyFilter';
import { useAreaStore } from '@/stores/area';
import { usePharmacyStore } from '@/stores/pharmacy';
import { storeToRefs } from 'pinia';

const { currCity, currDistrict, cityList, districtList } = storeToRefs(useAreaStore());
const { keyword, currOpenedId, showModal, isLoading } = storeToRefs(usePharmacyStore());

const { filteredPharmacies } = usePharmacyFilter();

const openInfoBox = (id) => {
  showModal.value = true;
  currOpenedId.value = id;
};
</script>
<template>
  <div class="h-full border-r border-gray-400 bg-gray-100 overflow-y-auto">
    <div class="p-4 border-b border-gray-600">
      <label class="relative block mr-8 text-xl leading-8">
        縣市：<select
          v-model="currCity"
          class="mt-1 left-24 text-xl w-auto min-w-[110px] border border-solid border-black rounded-md p-1 bg-white"
        >
          <option v-for="city in cityList" :key="city">{{ city }}</option>
        </select>
      </label>
      <label class="relative block mr-8 text-xl leading-8">
        行政區：<select
          v-model="currDistrict"
          class="mt-1 left-24 text-xl w-auto min-w-[110px] border border-solid border-black rounded-md p-1 bg-white"
        >
          <option v-for="district in districtList" :key="district.id">{{ district.name }}</option>
        </select>
      </label>
    </div>

    <div class="p-4 border-b border-gray-600">
      <label class="relative block mr-8 text-xl leading-8">
        <font-awesome-icon icon="fa-solid fa-search-location" />
        關鍵字搜尋：
        <input
          type="text"
          placeholder="請輸入關鍵字"
          v-model="keyword"
          class="px-2 py-0.5 text-xl leading-8 w-[110%] border border-solid border-black rounded-md"
        />
      </label>
    </div>

    <ul>
      <template v-if="isLoading">
        <li
          class="skeleton relative p-4 border-b bg-white pointer-events-none"
          v-for="i in 8"
          :key="`skeleton-${i}`"
        >
          <h1>
            <div class="w-[65%] skeleton-shimmer before:content-['\00a0']"></div>
          </h1>
          <div class="relative py-0.5">
            <div class="w-[70%] skeleton-shimmer before:content-['\00a0']"></div>
          </div>
          <div class="relative py-0.5">
            <div class="w-[70%] skeleton-shimmer before:content-['\00a0']"></div>
          </div>
          <div class="relative py-0.5">
            <div class="w-[70%] skeleton-shimmer before:content-['\00a0']"></div>
          </div>
          <div class="absolute block w-20 h-20 right-5 top-6 skeleton-shimmer"></div>
        </li>
      </template>
      <template v-else>
        <li
          class="store-info pharmacy-card relative cursor-pointer p-4 border-b bg-white text-[1.1rem] leading-relaxed hover:bg-gray-200"
          v-for="pharmacy in filteredPharmacies"
          :key="pharmacy.id"
          @click="$emit('triggerMakerPopup', pharmacy.id)"
        >
          <h1
            v-highlight="{ text: keyword, color: 'white', backgroundColor: 'green' }"
            class="text-2xl font-medium text-gray-800 mb-1.5"
          >
            {{ pharmacy.name }}
          </h1>

          <div class="relative py-0.5">
            <font-awesome-icon icon="fa-solid fa-head-side-mask" />
            <span class="absolute left-7">大人口罩: {{ pharmacy.mask_adult }}</span>
          </div>

          <div class="relative py-0.5">
            <font-awesome-icon icon="fa-solid fa-baby" />
            <span class="absolute left-7">兒童口罩: {{ pharmacy.mask_child }}</span>
          </div>

          <div class="relative py-0.5">最後更新時間: {{ pharmacy.updated }}</div>

          <button
            class="btn-store-detail absolute block cursor-pointer w-20 h-20 text-center right-5 top-6 text-xs border rounded-md"
            @click="openInfoBox(pharmacy.id)"
          >
            <font-awesome-icon icon="fa-solid fa-info-circle" class="block text-3xl mb-1.5" />
            看詳細資訊
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<style></style>
