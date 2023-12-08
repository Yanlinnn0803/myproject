<template>
    <div>
        <BackComponent />
        <h1>{{ category }}</h1>
        <div class="store-list">
            <StoreItem v-for="store in filteredStores" :key="store.ShopMail" :store="store" />
        </div>
        <FooterComponent />
    </div>
</template>
  
<script>
import BackComponent from '../components/BackComponent.vue';
import StoreItem from '../components/StoreItem.vue';
import { db } from "../config/firebaseConfig";
import FooterComponent from './FooterComponent.vue';

export default {
    components: {
        BackComponent,
        StoreItem,
        FooterComponent
    },
    data() {
        return {
            categoryStores: [], // 所有商店的data
            category: '', // 分類參數
        };
    },
    computed: {
        filteredStores() {
            // 根據分類參數做商店篩選
            return this.categoryStores.filter((store) => store.category === this.category);
        },
    },
    mounted() {
        this.category = this.$route.params.category; // 獲取分類參數

        db.collection('shops')
            .get()
            .then((querySnapshot) => {
                const stores = [];
                querySnapshot.forEach((doc) => {
                    stores.push({
                        ShopMail: doc.data().ShopMail,
                        ShopName: doc.data().ShopName,
                        imageUrl: doc.data().imageUrl,
                        category: doc.data().category,
                        
                    });

                });
                this.categoryStores = stores;
                console.log('Category Stores:', stores);
            });
    },
}
</script>
  
  

<style>
@import url('../assets/item.css');
.store-list {
    display: flex;
    flex-wrap: wrap;
}

h1{
    padding-top: 10%;
    text-align: center;
}
</style>  