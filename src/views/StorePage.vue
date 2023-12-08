<template>
    <SearchBar @search="performSearch" />
    <StoreCategory />
    <div class="store-list">
        <StoreItem v-for="store in displayedStores" :key="store.ShopMail" :store="store" :isLiked="isLiked"
            @unfavorite="removeFromUserFavorites" />
    </div>
    <div class="store-list-block"></div>
    <FooterComponent />
</template>

<script>
import SearchBar from '../components/SearchBar.vue';
import StoreCategory from '../components/StoreCategory.vue';
import StoreItem from '../components/StoreItem.vue';
import FooterComponent from './FooterComponent.vue';

import { db } from "../config/firebaseConfig";

export default {
    name: 'StorePage',
    components: {
        SearchBar,
        StoreCategory,
        StoreItem,
        FooterComponent
    },
    data() {
        return {
            stores: [],
            displayedStores: [], // 显示的商店数据，用于搜索结果
            isLiked: false, // 用于表示商店是否已收藏
        };
    },


    created() {
        // 在 created 鉤子中從 Firebase 讀取商店數據
        db.collection('shops')
            .get()
            .then((querySnapshot) => {
                const stores = [];
                querySnapshot.forEach((doc) => {
                    stores.push({
                        ShopMail: doc.data().ShopMail,
                        ShopName: doc.data().ShopName,
                        imageUrl: doc.data().imageUrl,
                    });
                });
                this.stores = stores;   // 將數據填充到 stores 陣列中
                this.displayedStores = stores    //初始顯示所有商店數據
            })
            .catch((error) => {
                console.error("讀取數據時出現錯誤：", error);
            });
    },


    methods: {
        performSearch(searchValue) {
            if (searchValue && searchValue.trim() !== '') {
                searchValue = searchValue.toLowerCase();
                this.displayedStores = this.stores.filter(store => {
                    return (
                        store.ShopName && store.ShopName.toLowerCase().includes(searchValue) ||
                        store.imageUrl && store.imageUrl.toLowerCase().includes(searchValue)
                    );
                });
            } else {
                this.displayedStores = this.stores; // 若搜索值為空，顯示所有商店
            }
        }
    }
}
</script>

<style scoped>
.store-list {
    display: flex;
    flex-wrap: wrap;
}
.store-list-block{
    height: 100px;
}
</style>