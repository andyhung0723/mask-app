<script setup>
import { useAreaStore } from '@/stores/area';
import { usePharmacyStore } from '@/stores/pharmacy';
import { onMounted, ref } from 'vue';
import AsideMenu from './components/AsideMenu.vue';
import LightBox from './components/LightBox.vue';
import MaskMap from './components/MaskMap.vue';

const map = ref(null);
const openPopup = (id) => {
  map.value.triggerPopup(id);
};

onMounted(() => {
  const areaStore = useAreaStore();
  const pharmacyStore = usePharmacyStore();

  areaStore.fetchAreaData();
  pharmacyStore.fetchPharmacies();
});
</script>

<template>
  <div id="app">
    <AsideMenu @triggerMakerPopup="openPopup" ref="menu" />
    <MaskMap ref="map" />
    <LightBox />
  </div>
</template>

<style lang="scss" scoped>
#app {
  display: block;
  position: fixed;
  overflow: hidden;
  width: 100%;
  height: 100vh;

  > div {
    float: left;
  }
}

.mask-map {
  position: relative;
  width: 75%;
  height: 100%;
  background-color: #aaa;
  z-index: 10;
  &.full {
    width: 100%;
  }
}
</style>
