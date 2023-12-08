<template>
    <svg class="heart" :class="{ liked: liked }" @click="toggleLike" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path v-if="!liked"
            d="M20.2,4.3C17.8,2,14.1,2,11.8,4.4L11.1,5.1L10.4,4.4C8.1,2.1,4.4,2.1,2,4.4C-1.3,7.1-1.3,11.5,2,14.2L11.1,23L20.2,14.2C23.5,11.5,23.5,7.1,20.2,4.3L20.2,4.3z"
            fill="none" stroke="currentColor" stroke-width="2" />
        <path v-else
            d="M20.2,4.3C17.8,2,14.1,2,11.8,4.4L11.1,5.1L10.4,4.4C8.1,2.1,4.4,2.1,2,4.4C-1.3,7.1-1.3,11.5,2,14.2L11.1,23L20.2,14.2C23.5,11.5,23.5,7.1,20.2,4.3L20.2,4.3z"
            fill="red" />
    </svg>
</template>
  
<script>
export default {
    name: 'MemfavHeartBt',
    data() {
        return {
            liked: false //初始狀態為未收藏
        };
    },
    methods: {
        toggleLike() {
            this.liked = !this.liked; //已收藏
        }
    }
};
</script>
  
<style scoped>
.heart {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 8px;
    margin-right: 8px;
    width: 35px;
    height: 25px;}

.liked {
    /*點擊後變紅愛心*/
    fill: red;
}
</style>