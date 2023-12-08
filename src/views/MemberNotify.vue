<script setup>
//import { RouterLink, RouterView } from 'vue-router'
</script>

<script>
import BackComponent from '../components/BackComponent.vue';
import FooterComponent from './FooterComponent.vue';
export default {
  name: 'MemberNotify',
  components: {
    BackComponent,
    FooterComponent
  }
}
</script>

<template>
  <div class="header">
    <BackComponent />
    <div class="title">信箱通知</div>
  </div>
  <!--<div id="top">
    <img src="src/assets/arrow-left-solid.svg" class="arrow">
    <h1 class="title">信箱通知</h1>
  </div>-->

  <div class="top-bar">
    <div class="search-bar">
      <input type="text" placeholder="輸入關鍵字搜尋" style="border: 0px; background-color:#D6C9B3;">
      <img src="../assets/loupe.png" class="search-icon">
    </div>
    <img src="../assets/bin.png" class="delete" herf="#">
  </div>

  <div>
    <div class="message">
      <input type="checkbox" style="transform: scale(1.5);">
      <span>&emsp;店家名</span><span>&emsp;訊息標題</span><span>&emsp;時間</span>
    </div>
    <hr>
  </div>
  <FooterComponent />
</template>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css";
@import url('../assets/top.css');

/*#top {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #715749;
  position: relative;
  height: 100px;
}

.title {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  text-align: center;
}

.arrow {
  width: 40px;
  position: absolute;
  top: 40%;
  padding-right: 80%;
}*/

.message {
  display: flex;
  align-items: center;
  margin: 10px 7% 0px;
}

.top-bar {
  display: flex;
  align-items: center;
  margin: 5% 7% 5%;
}

.search-bar {
  display: grid;
  grid-template-columns: auto auto;
  place-items: center;
  height: 40px;
  width: 85%;
  background: #D6C9B3;
}

.search-icon {
  width: 16px;
  margin-right: 5px;
}

.delete {
  margin-left: 20px;
  width: 20px;
}
</style>
