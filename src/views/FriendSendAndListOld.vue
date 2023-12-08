<template>
  <div class="container">

    <div class="friend-send-container">
      <SearchBarlee @search="searchFriends" />

      <div class="down">

        <div class="store-title-box">
          <div class="store-title">

            <div class="storename">{{ $route.params.storeName }}</div>
          </div>
        </div>
        <div class="storebox">
          <div class="text">總計</div>
          <div class="imgbox">
            <img :src="pointImage" alt="" class="pointtitlepic">
          </div>
          <div class="point">{{ $route.params.point }}</div>
        </div>
      </div>

    </div>


    <div class="listbox">
      <div class="title2">選擇轉送對象</div>
      <div class="scrollbox">
        <div class="memberbox" v-for="friend in friendList" :key="friend.id">
          <div class="imgbox">
            <img :src="memberImage" alt="" class="friendimg" />
          </div>

          <div class="memberdata">
            <div class="membername">{{ friend.name }}</div>
            <div class="memberid">{{ friend.id }}</div>
          </div>
          <div class="butbox">
            <button class="send" @click="showPopup(friend)">轉贈</button>
          </div>
        </div>

        <div v-if="showModal" class="modal">
          <!-- 第一次觸發的彈跳視窗 -->
          <div class="popup-content">
            <div class="jump-memberdata">
              <img :src="memberImage" alt="" class="jump-img">
              <div class="jump-textbox">
                <div class="jump-membername">{{ memberName }}</div>
                <div class="jump-memberid">{{ memberId }}</div>
              </div>
            </div>
            <!-- 點數快捷的按鈕 定義他的點擊動作是做讀值回傳到第二個彈跳視窗 -->
            <div class="jump-but">
              <div class="jump-butbox">
                <div class="jump-butbox-up">
                  <form>
                    <button class="point-button" @click="selectPoints(10)">10點</button>
                    <button class="point-button" @click="selectPoints(20)">20點</button>
                    <button class="point-button" @click="selectPoints(50)">50點</button>
                  </form>
                </div>
                <!-- 輸入點數地方 -->
                <div class="jump-butbox-down">

                  <!-- 確認 -->
                  <form @submit.prevent="confirmPoints">
                    <input type="number" v-model="customPoints" placeholder="輸入點數">
                    <button class="correct-button" @click="confirmPoints">確認</button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二個彈跳視窗 -->
      <div v-if="showSecondModal" class="modal">
        <div class="popup-content">

          <div>
            <!-- 視窗裡面内容 -->
            <div class="second-popup-content">

              <div class="SecondModal-memberdata">
                <div class="SecondModal-memberdata-up">
                  <img :src="memberImage" alt="" class="jump-img">
                  <div class="SecondModal-textbox">
                    <div class="SecondModal-membername">{{ memberName }}</div>
                    <div class="SecondModal-memberid">{{ memberId }}</div>
                  </div>

                </div>

                <div class="SecondModal-memberdata-down">
                  <div class="message">是否確認轉贈店家 <br>"{{ $route.params.storeName }}"

                    <template v-if="selectedPoints">
                      {{ selectedPoints }}點數
                    </template>
                    <template v-else-if="customPoints">
                      {{ customPoints }}點數
                    </template>
                    <template v-else>
                      <!-- 默認內容 就是如果沒有輸入或是點擊任何快捷鍵則默認為0點 -->
                      0 點數
                    </template>

                  </div>
                </div>

              </div>

            </div>
            <form @submit.prevent>
              <button class="confirm-button" @click="confirmSecondModal">確認</button>
            </form>
            <div v-if="showError" class="error-modal">
              {{ errorMessage }}
              <button @click="closeError">確定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />

  </div>
</template>

<script>
import FooterComponent from './FooterComponent.vue';
import SearchBarlee from '../components/SearchBarlee.vue';
import { mapGetters } from 'vuex';
import { db } from "../config/firebaseConfig";
//import { db as firebaseDb } from "../config/firebaseConfig"; 


export default {
  components: { FooterComponent, SearchBarlee },
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  data() {
    return {
      pointImage: require('@/assets/point.png'),
      storeName: '',
      point: '',
      memberImage: require('@/assets/member.png'),
      memberName: '',
      memberId: '',
      showModal: false,
      showSecondModal: false,
      shopName: '',
      selectedPoints: 0,
      customPoints: "",
      selectedPointsClicked: false,
      friendList: [],
      memberRef: db.collection("member"),
      userPhone: "",
      showError: false,
      errorMessage: '',
      
    };

    
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      this.username = userInfo.name;
      this.userId = userInfo.phone;
      this.userPhone = userInfo.phone;
      this.getFriendsList(this.userPhone);
    }
    this.storeName = this.$route.params.storeName;
    this.point = this.$route.params.point;
  },
  methods: {
    goBack() {
          this.$router.go(-1);
      },
    searchFriends(searchTerm) {
      // 执行搜索逻辑并更新 friendList
      this.friendList = this.friendList.filter(friend => {
        return friend.id.includes(searchTerm) || friend.name.includes(searchTerm);
      });
    },

    // 重命名为 fetchFriendsList
    fetchFriendsList(userPhone) {
      const friendsCollectionRef = db.collection("member").doc(userPhone).collection("friends");
      friendsCollectionRef.get().then((friendsSnapshot) => {
        this.friendList = []; // 清空朋友列表
        friendsSnapshot.forEach((friendDoc) => {
          const friendData = friendDoc.data();
          this.friendList.push({
            id: friendData.id,
            name: friendData.name,
          });
        });
      });
    },

    clearSearch() {
      // 清空搜索关键字并重新获取并显示全部好友列表
      this.searchTerm = ''; // 清空搜索关键字
      this.getFriendsList(this.userPhone); // 重新获取好友列表
    },

    // 监听来自子组件 SearchBarlee 的 clear-search 事件
    watch: {
      clearSearch() {
        this.clearSearch();
      },
    },

    getFriends(userPhone) {
      const friendsCollectionRef = db.collection("member").doc(userPhone).collection("friends");
      friendsCollectionRef.get().then((friendsSnapshot) => {
        this.friendList = []; // 清空朋友列表
        friendsSnapshot.forEach((friendDoc) => {
          const friendData = friendDoc.data();
          this.friendList.push({
            id: friendData.id,
            name: friendData.name,
          });
        });
      });
    },


    async getFriendsList(userPhone) {
      const friendsCollectionRef = db.collection("member").doc(userPhone).collection("friends");
      const friendsSnapshot = await friendsCollectionRef.get();
      friendsSnapshot.forEach((friendDoc) => {
        const friendData = friendDoc.data();
        this.friendList.push({
          id: friendData.id,
          name: friendData.name
        });
      });
    },
    showPopup(friend) {
      this.memberName = friend.name;
      this.memberId = friend.id;
      this.showModal = true;
    },
    selectPoints(points) {
      this.selectedPoints = points;
      //this.customPoints = "";
      this.showSecondModal = true;
      this.showModal = false;
    },
    confirmPoints() {
      this.showSecondModal = true;
      //手動輸入點數的情況下須確認按鈕要引導跳出第二個彈跳視窗供確認及做可行性判別
    },



    confirmSecondModal() {


      // 我這邊要區別跟計算點數的變化
      const storeName = this.$route.params.storeName;
      const newPoints = this.selectedPoints || this.customPoints;

      if (this.$route.params.point < newPoints) {
        alert("您目前沒有足夠的點數可以轉贈喔");
        this.showSecondModal = false;
        return;
      }

      this.$route.params.point -= this.selectedPoints || this.customPoints;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userRef = db.collection("member").doc(userInfo.phone);

      userRef.collection("cards")
        .where("cardname", "==", storeName)
        .get()
        .then((querySnapshot) => {
          const doc = querySnapshot.docs[0];
          const existingPoints = doc.data().point;
          const newPoints = existingPoints - (this.selectedPoints || this.customPoints);
          console.log(newPoints)

          return doc.ref.update({ point: newPoints });
        })
        .then(() => {
          this.selectedPoints = 0;
          this.customPoints = "";
          this.showSecondModal = false;
          this.showModal = false;
        })
        .catch((error) => {
          console.error("過程出現錯誤:", error);
        })

        // Get the imageUrl from the shops collection
        db.collection("shops")
        .where("ShopName", "==", storeName)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const shopDoc = querySnapshot.docs[0];
            const shopData = shopDoc.data();
            const imageUrl = shopData.imageUrl;

            // Continue with updating the card and creating PointAssign records
            this.updateCardAndCreatePointAssign(storeName, newPoints, imageUrl);
            console.log(this.updateCardAndCreatePointAssign)
          } else {
            // Handle the case where the shop with the given name was not found.
          }
        })
        .catch((error) => {
          console.error("Error querying the shop:", error);
        });



      
      const now = new Date();
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
      this.currentTime = now.toLocaleString(undefined, options);
      const pointAssignRef = db.collection("PointAssign");
      // 抓現在是哪個用戶登入
      const currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      // 紀錄被贈者
      pointAssignRef.add({
        member: this.memberId, // 朋友的 ID
        friend: currentUserInfo.name, // 目前的用戶
        AssignPoint: +newPoints, // 新分配的點數
        ShopName: storeName, // 店家
        currentTime: this.currentTime,
        //timestamp: timestamp,
      })
        .then((docRef) => {
          console.log("已記錄到PointAssign集合，文件的ID為：", docRef.id);
        })
        .catch((error) => {
          console.error("過程出現錯誤：", error);
        });

      const pointAssignoutRef = db.collection("PointAssign");
      const nowoutuser = new Date();
      const optionsoutuser = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
      this.currentTime = nowoutuser.toLocaleString(undefined, optionsoutuser);
      // 下面開始要抓登入用戶的朋友
      //先抓當前的登入用戶
      const outUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      // 這個做送出
      pointAssignoutRef.add({
        member: outUserInfo.phone, // 朋友的 ID
        friend: this.memberName, // 登入的用戶
        AssignPoint: -this.selectedPoints || -this.customPoints, // 新分配的點數
        ShopName: storeName, // 店家
        currentTime: this.currentTime,
      })
        .then((docRef) => {
          console.log("已記錄到PointAssign集合，文件的ID為：", docRef.id);
        })
        .catch((error) => {
          console.error("過程出現錯誤：", error);
        });

    },



  }
}
</script>

<style scoped>
.container {
  display: block;
  background-color: #715749;
}

.friend-send-container {
  width: 100%;
  height: 170px;
}

.down {
  background-color: #715749;
  display: flex;
  width: 100%;
  color: aliceblue;
  border: none;
  margin-top: 2%;
}

.store-title {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.store-title-box {
  width: 60%;
  font-size: 28px;
  margin-left: 20px;
}

.storebox {
  display: flex;
  justify-content: left;
}

img.pointtitlepic {
  width: 25px;
  height: 25px;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding-bottom: 0px;
}

.imgbox {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.storebox {
  display: flex;
  flex-direction: row;
  width: 40%;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 5%;
}

.title2 {
  font-size: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #d6c9b3;
  border: hidden;
  padding-left: 10px;
}

.text {
  font-size: 22px;
  margin-left: 5px;
  margin-right: 5px;
}

.point {
  font-size: 22px;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.scrollbox {
  /* 確保元素可以垂直滾動 */
  overflow-y: auto;
  /* 設定固定高度 */
  height: 525px;
  /* 請根據需要調整高度 */
}

.listbox {
  background-color: #d6c9b3;

}

.memberbox {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.memberdata {
  display: flex;
  flex-direction: column;
  width: 50%;
  /*font-size: 22px;*/
  margin-left: 5px;
  margin-right: 5px;
  justify-content: center;
}

.imgbox {
  width: 20%;
  text-align: center;
}

img {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  padding-bottom: 10px;
  padding-top: 10px;
  ;
}

.membername {
  font-size: 18px;
}

.butbox {
  width: 30%;
  text-align: center;
  margin: 5px;
  justify-content: center;
  display: flex;
  align-items: center;

}

button.send {
  color: #fff;
  border: none;
  border-radius: 15px;
  background-color: orange;
  width: 80%;
  margin: 0 auto;
  height: 90%;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  padding-bottom: 0px;

}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明的背景色 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-left: 10px;
  margin-right: 10px;
  width: 100%;
}

.jump-memberdata {
  display: flex;
  flex-direction: row;
  margin: 10px;
  width: 90%;
}

.jump-img {
  width: 30%;
  max-width: 40px;
  height: auto;
  margin: 5px;
  padding: 5px;
}

.jump-textbox {
  width: 60%;
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.jump-membername {
  font-weight: bold;
  margin-top: 10px;
  width: 90%;
  display: flex;
  align-items: left;
  font-size: 22px;
}

.jump-memberid {
  width: 100%;
  display: flex;
  align-items: left;
  font-size: 20px;
  ;
}

.jump-but {
  margin: 10px;
  width: 90%;
  display: flex;
  flex-direction: column;
}

.jump-butbox-up {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  margin-bottom: 5px;
}

.jump-butbox-down {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
}

.jump-butbox {
  width: 90%;
  margin-left: 20%;

}

.popup-content .point-button {
  margin-right: 10px;
}

.popup-content input {
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 24px;
  width: 60%;
  margin-top: 5px;
  margin-right: 5px;
}

.popup-content button {
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  background-color: #d6c9b3;
  margin-left: 5px;
  font-size: 18px;
  margin-top: 5px;
  ;
}

button.correct-button {
  padding: 5px 10px;
  border-radius: 15px;
  border: none;
  background-color: red;
  margin-left: 5px;
  margin-right: 10px;
  font-size: 22px;
  color: #fff;
  width: 40%;
}

.SecondModal-memberdata {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.SecondModal-memberdata-up {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
  font-size: 20px;
  margin-left: 5px;
  margin-right: 5px;
  /*justify-content: center;*/
  align-items: center;
}

.SecondModal-memberdata-down {
  width: 100%;
}

.message {
  text-align: center;
  font-size: 24px;
}

.SecondModal-memberid {
  margin-right: 5px;
  margin-left: 5px;
  display: flex;
}

.SecondModal-membername {
  margin-right: 8px;
  margin-left: 5px;
  display: flex;
}

.SecondModal-textbox {
  display: flex;
  flex-direction: column;
}

button.confirm-button {
  padding: 5px 10px;
  border-radius: 15px;
  border: none;
  background-color: red;
  margin: auto;
  font-size: 22px;
  color: #fff;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  text-align: center;
  display: flex;
  flex-direction: row;
}

button.point-button {
  width: 45%;
  padding: 5px;
}

.storename {
  margin-bottom: 5%;
  margin-top: 10%;
  
}
</style>
