<template>
  <div>
    <BackComponent />
    <div class="store-photo-container">
      <img :src="storeinside.imageUrl" alt="Store Photo" class="store-photo" />
      <div class="store-info-container">
        <div class="store-info-left">
          <!--<div class="store-number">{{ storeinside.ShopMail }}</div>-->
          <div class="store-name-in">{{ storeinside.ShopName }}</div>
        </div>
        <div class="store-info-right">
          <div class="user-points">
            總計
            <img src="../assets/point.png" alt="點數icon">{{ userPoints }}
          </div>
        </div>
      </div>
    </div>
    <div class="store-detail">
      <div class="store-status">
        <img src="../assets/clock.png" alt="營業時間icon">{{ storeinside.ShopOpenTime}} : {{ storeinside.ShopCloseTime
        }}
      </div>
      <div class="store-address">
        <img src="../assets/location2.png" alt="地址icon">地址：{{ storeinside.ShopAddress }}
      </div>
    </div>
    <!-- 商店Location API -->
    <div class="location-map">
      <GoogleMap v-if="searchInputValue" :search-input-value="searchInputValue" />
    </div>
    <FooterComponent />
  </div>
</template>
  
<script>
import BackComponent from '../components/BackComponent.vue';
import FooterComponent from './FooterComponent.vue';
import { db } from "../config/firebaseConfig";
import GoogleMap from '../components/GoogleMap.vue';

export default {
  name: 'StoreInside',
  components: {
    BackComponent,
    FooterComponent,
    GoogleMap
  },
  data() {
    return {
      storeinside: {
        ShopMail: '',
        ShopName: '', // 初始化为一个空字符串
        ShopCloseTime: '',
        ShopOpenTime: '',
        ShopAddress: '',
        imageUrl:''
      },
      //photo: require('../assets/steak.jpg'),
      userPoints: '0',
      searchInputValue: ''
    };
  },


  async mounted() {
    const ShopMail = this.$route.params.ShopMail;

    // 异步查询获取 {{ storeinside.ShopName }} 的值
    const shopSnapshot = await db.collection('shops')
      .where('ShopMail', '==', ShopMail)
      .get();

    if (!shopSnapshot.empty) {
      const doc = shopSnapshot.docs[0];
      // 设置 {{ storeinside.ShopName }} 的值
      this.storeinside.ShopName = doc.data().ShopName;

      // 获取 ShopOpenTime、ShopCloseTime 和 ShopAddress
      this.storeinside.ShopOpenTime = doc.data().openingHours;
      this.storeinside.ShopCloseTime = doc.data().closingHours;
      this.storeinside.ShopAddress = doc.data().ShopAddress;
      this.storeinside.imageUrl = doc.data().imageUrl;
      this.searchInputValue = doc.data().ShopAddress;
      // 触发后续查询
      console.log(this.storeinside.ShopOpenTime+this.storeinside.ShopCloseTime);
      console.log(doc.data().openingHours+doc.data().closingHours);
      this.performSubsequentQueries();

    } else {
      console.log("Document not found");
    }
  },

  methods: {
    async performSubsequentQueries() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userPhone = userInfo ? userInfo.phone : null;

      if (userPhone) {
        // 查询 "member" 集合中与用户电话号码匹配的文档
        const userDoc = await db.collection('member').doc(userPhone).get();

        if (userDoc.exists) {
          // 查询 "cards" 子集合中的文档
          const cardsRef = userDoc.ref.collection('cards');
          const cardsQuerySnapshot = await cardsRef.get();

          if (!cardsQuerySnapshot.empty) {
            //const doc = cardsQuerySnapshot.docs[0];
            const cardName = this.storeinside.ShopName; // 使用页面上的 ShopName


            // 在用户的 "cards" 子集合中查找匹配的 cardName
            const cardsSnapshot = await cardsRef.where('cardname', '==', cardName).get();

            if (!cardsSnapshot.empty) {
              const cardDoc = cardsSnapshot.docs[0];
              this.userPoints = cardDoc.data().point;
            }
          }
        }
      }
    },
  },
};
</script>


<style scoped>
.store-photo-container {
  position: relative;
  display: inline-block;
}

.store-photo {
  width: 100vw;
  height: 280px;
}

.store-info-container {
  position: absolute;
  width: 90vw;
  bottom: 10px;
  padding: 10px;
  background-color: #00000080;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: auto 8px;
}

.store-info-left {
  display: flex;
  flex-direction: column;
}

.store-number {
  font-size: 14px;
}

.store-name-in {
  font-size: 24px;
  font-weight: bolder;
}

.user-points {
  font-size: 24px;
  font-weight: bolder;
  align-self: flex-end;
  /*靠右對齊*/
}

.user-points img {
  width: 24px;
  margin: 0 5px;
  margin-top: 8%;
}

.store-detail {
  margin: 15px 25px;
  line-height: 30px;
}

.store-detail img {
  width: 20px;
  margin-right: 20px;

}

.store-status {
  font-size: 16px;
}

.store-address {
  font-size: 16px;
}

.location-map {
  position: absolute;
  top:50%;
  margin: auto;
  width: 100%;
  height: auto;
  /* 使地图占满整个区域 */
}
</style>