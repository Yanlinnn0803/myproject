<template>
  <div class="container">
    <SearchBarlee />
    <FriendSend />
    <FriendList />
    <FooterComponent />
  </div>
</template>

<script>
import FriendSend from './FriendSend.vue';
import FriendList from './FriendList.vue';
import FooterComponent from './FooterComponent.vue';
import SearchBarlee from '../components/SearchBarlee.vue';

export default {
  components: {
    FriendSend,
    FriendList,
    SearchBarlee,
    FooterComponent
  },
};
</script>

<style scoped>
.container {
  display: block;
  background-color: #715749;
}
</style>