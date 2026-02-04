<script setup>
import { useAreaStore } from '@/stores/area';
import { usePharmacyStore } from '@/stores/pharmacy';
import L from 'leaflet';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';

const map = ref(null);
const markers = ref([]);

onMounted(() => {
  map.value = L.map('mask-map').setView([25.033964, 121.564468], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map.value);
});

const { currDistrictInfo } = storeToRefs(useAreaStore());

watch(currDistrictInfo, (value) => {
  if (value) {
    const { latitude, longitude } = value;
    map.value.panTo(new L.LatLng(latitude, longitude));
  }
});

const { filteredPharmacies } = storeToRefs(usePharmacyStore());

watch(filteredPharmacies, (value) => {
  clearMarkers();
  value.forEach((item) => addMarker(item));
});

const addMarker = (pharmacy) => {
  const ICON = {
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  };

  const marker = L.marker([pharmacy.latitude, pharmacy.longitude], { icon: L.icon(ICON) })
    .addTo(map.value)
    .bindPopup(`<h2 class="popup-name">${pharmacy.name}</h2>`);

  marker.id = pharmacy.id;
  marker.latitude = pharmacy.latitude;
  marker.longitude = pharmacy.longitude;

  markers.value.push(marker);
};

const clearMarkers = () => {
  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });
};

const triggerPopup = (id) => {
  const marker = markers.value.find((marker) => marker.id === id);
  if (marker) {
    map.value.flyTo([marker.latitude, marker.longitude], 15);
    marker.openPopup();
  }
};

defineExpose({
  triggerPopup,
});
</script>

<template>
  <div class="mask-map" id="mask-map"></div>
</template>

<style lang="scss"></style>
