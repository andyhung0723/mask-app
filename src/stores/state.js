import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStateStore = defineStore('state', () => {
  const showModal = ref(false);

  return {
    showModal,
  };
});
