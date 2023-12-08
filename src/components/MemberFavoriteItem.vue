<template>
    <div class="store-item">
        <router-link :to="'/storeinside/' + store.ShopMail">
            <div class="store-details">
                <div class="store-name">{{ store.name }}</div>
            </div>
            <div class="store-image">
                <img :src="store.imageUrl" alt="Store Image" />
            </div>
            <div class="block" style="height: 10px;"></div>

        </router-link>
        <HeartButton :ShopMail="store.ShopMail" :ShopName="store.name" :isLiked="store.isLiked" />
    </div>
</template>


<script>
import HeartButton from './HeartButton.vue';
import { db } from "../config/firebaseConfig";


export default {
    name: 'MemberFavoriteItem',
    components: {
        HeartButton
    },
    props: {
        store: {
            type: Object,
            required: true,
        },
        imageUrl: { // 新添加的 imageUrl prop
            type: String, // 假设 imageUrl 是字符串类型
            required: true,
        },
    },

    methods: {
        removeFavorite() {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            if (userInfo && userInfo.phone) {
                const phone = userInfo.phone;
                const shopMail = this.store.ShopMail; // 使用商店的ShopMail做識別

                if (shopMail) {
                    //在這處發remove-favorite事件，以通知父組件刪除該項目
                    this.$emit('remove-favorite', shopMail);

                    //再來執行實際刪除項目的邏輯
                    this.removeFromUserFavorites(phone, shopMail);
                } else {
                    console.error("Invalid shopMail: ", shopMail);
                }
            } else {
                console.error("User information not found in local storage");
            }
        },

        removeFromUserFavorites(phone, shopMail) {
            console.log("phone:", phone);
            console.log("shopMail:", shopMail);

            if (!shopMail) {
                console.error("Invalid shopMail: ", shopMail);
                return;
            }

            const userDocRef = db.collection('member').doc(phone);
            const favStoreRef = userDocRef.collection('FavStore');

            // 在 FavStore 集合中找到特定 ShopMail 的文件并删除它们
            favStoreRef.where('ShopMail', '==', shopMail).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref.delete().then(() => {
                            // 文件删除成功后，您可以在此处执行其他操作
                            console.log("Document removed");
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    });
                })
                .catch((error) => {
                    console.error('Error getting documents: ', error);
                });
        },


    }
}
</script>

<style>
@import url('../assets/item.css');
</style>