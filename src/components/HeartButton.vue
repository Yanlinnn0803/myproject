<template>
    <svg class="heart" :class="{ liked: localIsLiked }" @click="toggleLike" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24">
        <path v-if="!isUserLiked"
            d="M20.2,4.3C17.8,2,14.1,2,11.8,4.4L11.1,5.1L10.4,4.4C8.1,2.1,4.4,2.1,2,4.4C-1.3,7.1-1.3,11.5,2,14.2L11.1,23L20.2,14.2C23.5,11.5,23.5,7.1,20.2,4.3L20.2,4.3z"
            :style="{ fill: localIsLiked ? 'red' : 'none' }" stroke="currentColor" stroke-width="2" />
        <path v-else
            d="M20.2,4.3C17.8,2,14.1,2,11.8,4.4L11.1,5.1L10.4,4.4C8.1,2.1,4.4,2.1,2,4.4C-1.3,7.1-1.3,11.5,2,14.2L11.1,23L20.2,14.2C23.5,11.5,23.5,7.1,20.2,4.3L20.2,4.3z"
            :style="{ fill: localIsLiked ? 'red' : 'none' }" />
    </svg>
</template>
  
<script>
import { db } from "../config/firebaseConfig";

export default {
    name: 'HeartButton',
    props: {
        ShopMail: String,
        ShopName: String,
        imageUrl: String,
        isLiked: Boolean    //識別是否已收藏的prop
    },
    data() {
        return {
            localIsLiked: this.isLiked, //   使用本地属性
        };
    },

    computed: {
        heartButtonClass() {
            return {
                'liked': this.localIsLiked, // 如果已收藏，添加 'liked' 类名
            };
        },
    },

    created() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.phone) {
            const phone = userInfo.phone;
            const shopMail = this.ShopMail;

            // 检查用户是否已收藏该商店
            this.checkIfUserLiked(phone, shopMail);
        }
    },



    methods: {

        async checkIfUserLiked(phone, shopMail) {
            const userDocRef = db.collection('member').doc(phone);
            const favStoreRef = userDocRef.collection('FavStore');

            const doc = await favStoreRef.doc(shopMail).get();
            if (doc.exists) {
                this.localIsLiked = true;
            }
        },

        toggleLike() {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            console.log("userInfo:", userInfo);
            if (userInfo && userInfo.phone) {
                //this.liked = !this.liked;
                const phone = userInfo.phone;
                const shopMail = this.ShopMail;
                console.log("phone:", phone);
                console.log("shopMail:", shopMail);

                if (this.localIsLiked) {
                    this.removeFromUserFavorites(userInfo.phone, shopMail);
                    this.$emit("unfavorite", shopMail); // 觸發取消收藏事件
                    // 取消收藏后，设置 isLiked 为 false
                    this.localIsLiked = false;
                    this.$emit("update:isLiked", false); // 更新 isLiked prop
                    this.liked = false;

                    console.log("update isLiked : transparent");

                } else {
                    this.addToUserFavorites(userInfo.phone, shopMail, this.ShopName, this.imageUrl);
                    this.localIsLiked = true;
                    this.$emit("update:isLiked", true); // 更新 isLiked prop
                    this.liked = true;

                    console.log("update isLiked : red");

                }
            } else {

                console.error("User information not found in local storage");
            }
        },

        async addToUserFavorites(phone, shopMail, shopName, imageUrl) {
            const userDocRef = db.collection('member').doc(phone);
            const favStoreRef = userDocRef.collection('FavStore');
            try {
                await favStoreRef.doc(shopMail).set({
                    ShopMail: shopMail,
                    ShopName: shopName,
                    imageUrl: imageUrl
                });
                console.log("Document written with ID: ", shopMail);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        },

        async removeFromUserFavorites(phone, shopMail) {
            const userDocRef = db.collection('member').doc(phone);
            const favStoreRef = userDocRef.collection('FavStore');

            // 直接删除数据库中的文档
            favStoreRef.doc(shopMail).delete()
                .then(() => {
                    console.log("Document removed");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
        }
    },
}
</script>
 
<style scoped>
.heart {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 8px;
    margin-right: 8px;
    width: 35px;
    height: 25px;
}

.heart path {
    fill: none;
    /* 覆盖<path>元素的fill属性 */
}

.liked path {
    fill: red;
    /* 添加.liked类的样式 */
}</style>