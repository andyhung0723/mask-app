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
  <div class="aside-menu">
    <div class="wraps">
      <label>
        縣市：<select v-model="currCity">
          <option v-for="city in cityList" :key="city">{{ city }}</option>
        </select>
      </label>
      <label>
        行政區：<select v-model="currDistrict">
          <option v-for="district in districtList" :key="district.id">{{ district.name }}</option>
        </select>
      </label>
    </div>

    <div class="wraps">
      <label>
        <font-awesome-icon icon="fa-solid fa-search-location" />
        關鍵字搜尋：
        <input type="text" placeholder="請輸入關鍵字" v-model="keyword" />
      </label>
    </div>

    <ul class="store-lists">
      <template v-if="isLoading">
        <li class="store-info wraps skeleton" v-for="i in 8" :key="`skeleton-${i}`">
          <h1><div class="skeleton-title skeleton-text skeleton-style"></div></h1>
          <div class="mask-info">
            <div class="skeleton-line skeleton-text skeleton-style"></div>
          </div>
          <div class="mask-info">
            <div class="skeleton-line skeleton-text skeleton-style"></div>
          </div>
          <div class="mask-info">
            <div class="skeleton-line skeleton-text skeleton-style"></div>
          </div>
          <div class="btn-store-detail skeleton-style"></div>
        </li>
      </template>
      <template v-else>
        <li
          class="store-info wraps"
          v-for="pharmacy in filteredPharmacies"
          :key="pharmacy.id"
          @click="$emit('triggerMakerPopup', pharmacy.id)"
        >
          <h1 v-highlight="{ text: keyword, color: 'white', backgroundColor: 'green' }">
            {{ pharmacy.name }}
          </h1>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-head-side-mask" />
            <span>大人口罩: {{ pharmacy.mask_adult }}</span>
          </div>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-baby" />
            <span>兒童口罩: {{ pharmacy.mask_child }}</span>
          </div>

          <div class="mask-info">最後更新時間: {{ pharmacy.updated }}</div>

          <button class="btn-store-detail" @click="openInfoBox(pharmacy.id)">
            <font-awesome-icon icon="fa-solid fa-info-circle" />
            看詳細資訊
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<style>
.aside-menu {
  width: 25%;
  height: 100%;
  border-right: 1px solid #aaa;
  background-color: #f1f1f1;
  overflow-y: scroll;
  label {
    position: relative;
    margin-right: 2em;
    display: block;
    font-size: 1.2rem;
    line-height: 2;
  }
  select {
    position: absolute;
    margin-top: 0.3rem;
    left: 6rem;
    font-size: 1.2rem;
    width: auto;
    min-width: 110px;
  }
  input {
    padding: 2px 8px;
    font-size: 1.2rem;
    line-height: 2;
    width: 110%;
  }
}

.store-info {
  position: relative;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1.8;
  background-color: #fff;
  h1 {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.3em;
  }
  .mask-info {
    position: relative;
    padding: 1px 0;
    > span {
      position: absolute;
      left: 1.8rem;
    }
  }
  &::v-deep .highlight {
    color: #f08d49;
  }
  &:hover {
    background-color: #eee;
  }
  .btn-store-detail {
    position: absolute;
    display: block;
    cursor: pointer;
    width: 80px;
    height: 80px;
    text-align: center;
    right: 1.2rem;
    top: 1.5rem;
    font-size: 0.8rem;
    > i {
      display: block;
      font-size: 2rem;
      margin-bottom: 5px;
    }
  }
}

.popup-name {
  font-size: 1.25rem;
}

.wraps {
  padding: 1em;
  border-bottom: 1px solid #666;
}

.skeleton {
  pointer-events: none;

  .skeleton-text:empty::before {
    content: '\00a0';
    display: inline-block;
  }

  .skeleton-style {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  .skeleton-title {
    width: 65%;
  }

  .skeleton-line {
    width: 70%;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
