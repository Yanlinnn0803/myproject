<template>
  <div class="body">
  <div class="container-outer">
    <div class="header">
      <div class="title">我的集點卡</div>
    </div>
    <div>

      <div class="container-outer">
        <div class="scrollbox">
        <div v-if="pointCards && pointCards.length > 0">
          <div v-for="(card, index) in pointCards" :key="index" id="pointcard-container">
            <!--<img src="../assets/stamp.png" class="card">-->
            <img :src="card.image" class="card">
            <div class="content">
              <h3>{{ card.cardname }}</h3>
              <!-- <p>{{ card.storeID }}</p> -->
              <!-- <img :src="card.pointImage" class="p">&ensp; -->
              
          <img src="../assets/p.png" class="p">&ensp;<b class="number">{{ card.point }}</b>
          <p>點數用途多，歡迎多利用</p>

              <!-- <p>{{ card.pointsValidity }}</p> -->
            </div>
          </div>
        </div>
        <div v-else>
          <p>您没有任何卡片。</p>
        </div>
      </div>
    </div>
    </div>
    <FooterComponent />
  </div>
  </div>

</template>

<script>
import FooterComponent from './FooterComponent.vue';
import { db } from '../config/firebaseConfig';

export default {
  components: {
    FooterComponent
  },
  data() {
    return {
      pointCards: [] // 初始化一个空数组来存储点卡数据
    };
  },
  async created() {
    try {
      // 从 localStorage 获取用户信息
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo.phone);

      // 查询 "member" 集合中与用户电话号码匹配的文档
      const memberRef = db.collection('member');
      const userDoc = await memberRef.doc(userInfo.phone).get();
      console.log(userDoc);

      if (userDoc.exists) {
        // 查询 "cards" 子集合中的文档
        const cardsRef = userDoc.ref.collection('cards');
        const cardsQuerySnapshot = await cardsRef.get();
        console.log(cardsQuerySnapshot);

        // 处理卡片数据
        const pointCards = [];
        console.log(pointCards);

        cardsQuerySnapshot.forEach((cardDoc) => {
          const card = cardDoc.data();
          console.log(card);

          pointCards.push({
            cardname: card.cardname,
            //storeID: card.storeID,
            //stampImage: card.stampImage,
            //pointImage: card.pointImage,
            point: card.point,
            image:card.image,
            //pointsValidity: card.pointsValidity
          });
        });

        // 设置 pointCards 数据，用于在模板中显示
        this.pointCards = pointCards;
      } else {
        console.log('未找到对应的用户，拍謝');
      }
    } catch (error) {
      console.error('出现了错误:', error);
    }
  }
};
</script>




<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css";
@import url('../assets/top.css');

/*.container-outer {
  padding-bottom: 100px;
  給footer留足夠空間 
}*/

#pointcard-container {
  margin: 2% 2% 2%;
  background-color: #D6C9B3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;

}

.card {
  width: 120px;
  border-radius: 10px;
}

.content {
  margin-left: 2%;
  width: 50%
}
p{
  font-size: 16px;
  margin: 0%;
  padding: 2%;
}

.p {
  width: 20px;
  font-size: 20px;

}

.number {
  vertical-align: 2px;
  font-weight: bolder;
}

.scrollbox {
    /* 確保元素可以垂直滾動 */
    overflow-y: auto;
    /* 設定固定高度 */
    height: 610px;
    /* 請根據需要調整高度 */
}

.body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #d6c9b3;
}

h3{
  font-size: 18px;
  margin:0%;
  padding:2%;
}
</style>
