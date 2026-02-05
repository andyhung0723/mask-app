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
  <div class="fixed inset-0 flex overflow-hidden">
    <AsideMenu @triggerMakerPopup="openPopup" />
    <MaskMap ref="map" class="w-3/4 flex-1 z-10" />
    <LightBox />
  </div>
</template>

<style></style>
