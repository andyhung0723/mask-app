<script setup>
import { usePharmacyStore } from '@/stores/pharmacy';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const { currOpenedPharmacy, showModal } = storeToRefs(usePharmacyStore());

const servicePeriods = computed(() => {
  let servicePeriods = currOpenedPharmacy.value?.service_periods || '';
  servicePeriods = servicePeriods.replace(/N/g, 'O').replace(/Y/g, 'X');

  return servicePeriods
    ? [servicePeriods.slice(0, 7), servicePeriods.slice(7, 14), servicePeriods.slice(14, 21)]
    : servicePeriods;
});

const close = () => {
  showModal.value = false;
};
</script>
<template>
  <transition name="modal">
    <div
      class="fixed z-[100] inset-0 bg-black/65 flex items-center justify-center"
      v-show="showModal"
    >
      <div class="w-full h-full flex items-center justify-center" @click.self="close">
        <div class="w-[520px] px-8 py-2.5 bg-white rounded shadow-lg transition-all duration-300">
          <div class="text-brand-primary my-5">
            <h1 class="text-[1.6rem] font-bold leading-normal">
              {{ currOpenedPharmacy?.name }}
            </h1>
            <hr />
            <h2 class="font-medium mb-2 leading-relaxed">營業時間</h2>
            <table class="w-full mb-4 border-separate border-spacing-0 rounded">
              <thead>
                <tr>
                  <th class="bg-brand-primary text-white p-1.5 text-center"></th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">ㄧ</th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">二</th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">三</th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">四</th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">五</th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">六</th>
                  <th class="bg-brand-primary text-white p-1.5 text-center">日</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="bg-brand-primary text-white p-1.5 text-center">早上</th>
                  <td
                    class="p-1.5 text-center leading-6"
                    v-for="(service, index) in servicePeriods[0]"
                    :key="index"
                  >
                    {{ service }}
                  </td>
                </tr>
                <tr>
                  <th class="bg-brand-primary text-white p-1.5 text-center">中午</th>
                  <td
                    class="p-1.5 text-center leading-6"
                    v-for="(service, index) in servicePeriods[1]"
                    :key="index"
                  >
                    {{ service }}
                  </td>
                </tr>
                <tr>
                  <th class="bg-brand-primary text-white p-1.5 text-center">晚上</th>
                  <td
                    class="p-1.5 text-center leading-6"
                    v-for="(service, index) in servicePeriods[2]"
                    :key="index"
                  >
                    {{ service }}
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 class="font-medium mb-2 leading-relaxed">地址 {{ currOpenedPharmacy?.address }}</h2>
            <h2 class="font-medium mb-2 leading-relaxed">電話 {{ currOpenedPharmacy?.phone }}</h2>
            <h2 class="font-medium mb-2 leading-relaxed">備註 {{ currOpenedPharmacy?.note }}</h2>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style></style>
