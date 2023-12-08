<template>
    <div id="Bb">
        <div id="lightDiv">
            <div v-show="lightOn"></div>
            <img src="https://static.runoob.com/images/svg/img_lightBulb.svg">
        </div>
        <h1>{{ msg1 }}</h1>
        <button v-on:click="lightOn =! lightOn">開/關</button>
    </div>
</template>


<script>
// eslint-disable-next-line
Vue.component('Bb', {
  name: 'BBbb',
  props: {
    msg1: String
  },
  template: `
    <div>
      <button @click="$emit('button')">Click me</button>
    </div>
  `
});
/* eslint-disable */
const BbApp = Vue.createApp({
  data() {
    return {
      lightOn: false
    };
  }
});
BBbbApp.mount('#BBbb');
</script>

<div id="BBbb"></div>