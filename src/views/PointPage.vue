<template>
  <div>
    <div class="header">
      <div class="title">點數轉贈</div>
    </div>

    <div>
      <div class="scrollbox">
      <div v-if="userCards && userCards.length > 0">
        <div v-for="(userCard, userIndex) in userCards" :key="userIndex" id="point">
          <div class="content">
            
              <h3>{{ userCard.cardname }}</h3>
              <p>持有點數: {{ userCard.point }}</p>
              <!-- 用户的电话号码不需要显示 -->
              <!-- <p>用户的电话号码: {{ userPhone }}</p> -->
            </div>
          
            <!--<router-link :to="{ name: 'friendSendstore', params: { storeName: userCard.cardname } }">
              <button class="gift">轉贈</button>
            </router-link>-->

            <button class="gift" @click="navigateToRoute(userCard.cardname, userCard.point)">轉贈</button>



          </div>
      
        
      </div>

      <div v-else>
        <h3>您尚未擁有店家的集點卡。</h3>
      </div>
    </div>
<FooterComponent />
</div>
</div>

</template>



<script>
import { mapGetters } from 'vuex';
import {db} from '../config/firebaseConfig';
//import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
//import {query,where,collection} from 'firebase/firestore';
import FooterComponent from './FooterComponent.vue';
export default {
  components: {
        FooterComponent
    },
  computed: {
    ...mapGetters(['getUserPhone']), // 用來映射用戶資料 概念同localstorage
  },
  data() {
    return {
      userCards: [],
    };
  },

  async created() {
  // 从 localStorage 获取用户信息
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo.phone);
  
  

  try {
    // 查询 "member" 集合中和目前登入用戶電話號碼相等的文檔
    const memberRef = db.collection('member');
    const userDoc = await memberRef.doc(userInfo.phone).get();
    console.log(userDoc)
    if (userDoc.exists) {
      // 查询 "cards" 子集合中的所有文檔
      const cardsRef = userDoc.ref.collection('cards');
      const cardsQuerySnapshot = await cardsRef.get();
      console.log(cardsQuerySnapshot)
      // 集點卡數據
      const userCards = [];
      console.log(userCards)

      cardsQuerySnapshot.forEach((cardDoc) => {
        const card = cardDoc.data();
        //console.log(card)

        userCards.push({
          cardname:card.cardname,
          point: card.point,
        });
      });

      // 用來確認結果
      this.userCards = userCards;
    } else {
      console.log('未找到對應的用戶，拍謝');
    }
  } catch (error) {
    console.error('出現了錯誤:', error);
  }
},
methods: {
  navigateToRoute(storeName, point) {
  this.$router.push({
    name: 'friendSendstorepoint', // route可能會衝突，我直接給他一個新的路由名字
    params: { storeName, point }
  });
},

},

}
</script>



<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css";
@import url('../assets/top.css');

#point {
  margin: 2% 5% 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
}

.store-icon {
  width: 75px;
  margin-right: 10px;
  margin-left: 10px;
}

.content {
  margin-left: 40px;
  flex-grow: 1;
}

.p {
  width: 20px;
  font-size: 20px;
}

.number {
  vertical-align: 3px;
}

.gift {
  /*margin-right: 20px;
  height: 35px;
  width: 70px;
  border: 0;
  background-color: #D6C9B3;
  color: black;
  border-radius: 30px;*/

  color: #fff;
  border: none;
  border-radius: 15px;
  background-color: orange;
  width: 90px;
  margin: 0 auto;
  height: 45px;
  font-size: 20px;
}

.scrollbox {
    /* 確保元素可以垂直滾動 */
    overflow-y: auto;
     /*設定固定高度 */
    height: 600px;
    /* 請根據需要調整高度 */
}
</style>
