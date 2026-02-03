<script setup></script>

<template>
  <div id="app">
    <!-- aside-menu 左側欄 -->
    <div class="aside-menu">
      <div class="wraps">
        <label>
          縣市：<select>
            <option>台北市</option>
          </select>
        </label>
        <label>
          行政區：<select>
            <option>北投區</option>
          </select>
        </label>
      </div>

      <div class="wraps">
        <label>
          <font-awesome-icon icon="fa-solid fa-search-location" />
          關鍵字搜尋：
          <input type="text" placeholder="請輸入關鍵字" />
        </label>
      </div>

      <ul class="store-lists">
        <li class="store-info wraps">
          <h1>ＸＸ藥局</h1>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-head-side-mask" />
            <span>大人口罩: 100 個</span>
          </div>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-baby" />
            <span>兒童口罩: 100 個</span>
          </div>

          <div class="mask-info">最後更新時間:</div>

          <button class="btn-store-detail">
            <font-awesome-icon icon="fa-solid fa-info-circle" />
            看詳細資訊
          </button>
        </li>
        <li class="store-info wraps">
          <h1>ＸＸ藥局</h1>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-head-side-mask" />
            <span>大人口罩: 100 個</span>
          </div>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-baby" />
            <span>兒童口罩: 100 個</span>
          </div>

          <div class="mask-info">最後更新時間:</div>

          <button class="btn-store-detail">
            <font-awesome-icon icon="fa-solid fa-info-circle" />
            看詳細資訊
          </button>
        </li>
        <li class="store-info wraps">
          <h1>ＸＸ藥局</h1>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-head-side-mask" />
            <span>大人口罩: 100 個</span>
          </div>

          <div class="mask-info">
            <font-awesome-icon icon="fa-solid fa-baby" />
            <span>兒童口罩: 100 個</span>
          </div>

          <div class="mask-info">最後更新時間:</div>

          <button class="btn-store-detail">
            <font-awesome-icon icon="fa-solid fa-info-circle" />
            看詳細資訊
          </button>
        </li>
      </ul>
    </div>

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
  * {
    box-sizing: border-box;
  }
  > div {
    float: left;
  }
}

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

.wraps {
  padding: 1em;
  border-bottom: 1px solid #666;
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
</style>
