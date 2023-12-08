<template>
  <div class="fullscreen-map">
    <div class="content-layer">
      <CarouselAdvertisement />
    </div>
      <GoogleMap_Index />
  </div>
  <FooterComponent />
</template>


<script>
import CarouselAdvertisement from '../components/CarouselAdvertisement.vue';
import FooterComponent from './FooterComponent.vue';
import GoogleMap_Index from './GoogleMap_Index.vue';

export default {
  name: 'IndexLocation',
  components: {
    CarouselAdvertisement,
    GoogleMap_Index,
    FooterComponent
  },
};
</script>

<style>
.fullscreen-map {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
