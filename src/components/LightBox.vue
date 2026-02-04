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
    <div class="modal-mask" v-show="showModal">
      <div class="modal-wrapper" @click.self="close">
        <div class="modal-container">
          <div class="modal-body">
            <h1 class="store-name">{{ currOpenedPharmacy?.name }}</h1>
            <hr />
            <h2 class="title">營業時間</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>ㄧ</th>
                  <th>二</th>
                  <th>三</th>
                  <th>四</th>
                  <th>五</th>
                  <th>六</th>
                  <th>日</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>早上</th>
                  <td v-for="(service, index) in servicePeriods[0]" :key="index">{{ service }}</td>
                </tr>
                <tr>
                  <th>中午</th>
                  <td v-for="(service, index) in servicePeriods[1]" :key="index">{{ service }}</td>
                </tr>
                <tr>
                  <th>晚上</th>
                  <td v-for="(service, index) in servicePeriods[2]" :key="index">{{ service }}</td>
                </tr>
              </tbody>
            </table>

            <h2 class="title">地址 {{ currOpenedPharmacy?.address }}</h2>
            <h2 class="title">電話 {{ currOpenedPharmacy?.phone }}</h2>
            <h2 class="title">備註 {{ currOpenedPharmacy?.note }}</h2>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 520px;
  margin: 0px auto;
  padding: 10px 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-body {
  color: #42b983;
  margin: 20px 0;
}
</style>
<style>
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1.1);
}
</style>

<style lang="scss" scoped>
.store-name {
  font-size: 1.6rem;
  font-weight: bold;
  line-height: 1.5;
}
.title {
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.7;
}
table {
  border-spacing: 0;
  border-radius: 3px;
  width: 100%;
  margin-bottom: 1rem;
}
th {
  background-color: #42b983;
  color: #fff;
}
td,
th {
  padding: 0.3em;
  text-align: center;
  line-height: 1.5rem;
}
</style>
