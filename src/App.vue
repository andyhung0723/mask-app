<script setup>
import AsideMenu from './components/asideMenu.vue';
</script>

<template>
  <div id="app">
    <!-- aside-menu 左側欄 -->
    <AsideMenu />
    <!-- 地圖區塊 -->
    <div class="mask-map" id="mask-map"></div>
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
