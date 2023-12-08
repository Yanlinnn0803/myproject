<template>
    <div class="store-item">
        <router-link :to="'/storeinside/' + store.ShopMail">
            <div class="store-details">
                <div class="store-name">{{ store.ShopName }}</div>
            </div>
            <div class="store-image">
                <img :src="store.imageUrl" alt="Store Image" />
            </div>
            <div class="block" style="height: 10px;"></div>

        </router-link>
        <HeartButton :ShopMail="store.ShopMail" :ShopName="store.ShopName" :imageUrl="store.imageUrl"
            @unfavorite="removeFromUserFavorites" />
    </div>
</template>
  
<script>
import HeartButton from './HeartButton.vue';

export default {
    name: 'StoreItem',
    components: {
        HeartButton,
    },
    props: {
        store: {
            type: Object,
            required: true,
            isLiked: Boolean, //從父組件傳遞過來
        },
    },

    methods: {
        handleUnfavorite() {
            this.$emit("unfavorite"); // 触发取消收藏事件
        },
    },

}
</script>
  
<style>
@import url('../assets/item.css');
</style>