<template>
    <div class="header">
        <BackComponent />
        <div class="title">我的最愛</div>
    </div>
    <div class="store-list">
        <MemberFavoriteItem v-for="store in favorites" :key="store.id" :store="store" @remove-favorite="removeFavorite" />
    </div>
    <FooterComponent />
</template>

<script>
import BackComponent from '../components/BackComponent.vue';
import MemberFavoriteItem from '../components/MemberFavoriteItem.vue';
import FooterComponent from './FooterComponent.vue';

import { db } from "../config/firebaseConfig";

export default {
    name: 'MemberFavoritePage',
    components: {
        BackComponent,
        MemberFavoriteItem,
        FooterComponent,
    },

    data() {
        return {
            favorites: []
        };
    },

    mounted() {
        // 获取用户信息从 localStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo && userInfo.phone) {
            // 使用用户信息中的电话号码来获取用户的收藏列表
            const phone = userInfo.phone;
            db.collection('member').doc(phone).collection('FavStore').get()
                .then((querySnapshot) => {
                    const favorites = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        // 构建 store 对象并添加到 favorites 列表
                        const store = {
                            ShopMail: doc.id, // 使用文档的 ID 作为唯一标识
                            name: data.ShopName, // 替换为正确的字段名称
                            imageUrl: data.imageUrl, // 替换为正确的字段名称
                            isLiked: true,  // 預設已收藏
                        };
                        favorites.push(store);
                    });

                    this.favorites = favorites;
                })
                .catch((error) => {
                    console.error("Error getting favorites: ", error);
                });
        } else {
            console.error("User information not found in local storage");
        }
    },

    methods: {
        async removeFavorite(shopMail) {
            const index = this.favorites.findIndex(store => store.ShopMail === shopMail);
            if (index !== -1) {
                this.favorites.splice(index, 1);

                // 在此触发移除项的操作，将 shopMail 传递给父组件以进行进一步处理
                this.$emit('remove-favorite', shopMail);
            }
        },

    }
};
</script>

<style scoped>
@import url('../assets/top.css');

.store-list {
    display: flex;
    flex-wrap: wrap;
}
</style>