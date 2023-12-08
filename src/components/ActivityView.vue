<template>
  <div class="container">

<header class="header"><h1>活動申請</h1></header>
<h2>瘋狂點點名</h2>
<table>
 <tr>
     <td>點數數量</td>
     <td><input type="text" v-model="prizeAmount"></td>
 </tr>
 <tr>
     <td>發放名額</td>
     <td><input type="number" v-model="totalWinners"></td>
 </tr>
 
</table>
<button class="submit1" @click="drawLottery">送出</button>
<div class="down">
 <h1>輪播廣告投放</h1>
 <table>
     <tr>
         <td class="AdPhoto">照片上傳</td>
         <td><input type="file" ref="fileInput"></td>
     </tr>
 </table>
 <p><label for="startDate">開始日期：</label>
 <input type="date" id="startDate" name="startDate" ref="startDate"></p>
 <p><label for="endDate">結束日期：</label>
 <input type="date" id="endDate" name="endDate" ref="endDate"></p>
 <button class="submit2" @click="handleUploadImage($event)">送出</button>
</div>
  <FooterIcon />
</div>
</template>


<script>
import FooterIcon from '../components/FooterIcon.vue';

import { db ,firebaseConfig} from "../config/firebaseConfig.js";
import  firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default {
    components: {
      FooterIcon
    },
data() {
 return {
   points: "",
   quota: "",
   date: "",
   maxAdSerialNum: null,
   startDate:"",
   endDate:"",
   currentUser:"",
   prizeAmount: null, // 發放的總點數
   totalWinners: null, // 名額數量
   participants: [],//名單
   lotteryResults: [], // 存儲抽獎結果
   point:null,
   currentTime:'',
   givepoint:null,
   a:0,
 };
},
methods: {
  async getParticipantsFromFirebase() {
      try {
        const snapshot = await db.collection("member").get();
        this.participants = snapshot.docs.map((doc) => {
          return { name: doc.id };
        });
      } catch (error) {
        console.error("取得參與者清單時發生錯誤：", error);
      }
    },
  drawLottery() {
      // 隨機分配點數
      db.collection("shops").doc(this.currentUser['shopName']).get().then((doc) => {
                if (doc.exists) {
                this.givepoint = doc.data().ShopGivePoint;
                console.log(this.givepoint);
                this.a=parseFloat(this.givepoint)+parseFloat(this.prizeAmount);
                console.log(this.a);
                console.log(typeof this.a);
                db.collection('shops').doc(this.currentUser['shopName']).update({
                  ShopGivePoint:parseFloat(this.a).toFixed(2),
                });
                console.log("點數已存入");
                
                } else {
                  this.point = 0;
                  console.error("點數不存在");
                }
            }).catch((error) => {
              console.error("取得卡片時出錯：", error);
              
            });
      
      const now = new Date();
      const nowTimestamp=firebase.firestore.Timestamp.fromDate(now);
      this.lotteryResults = [];
      let points = 0;
      let p=0;
      const participantsCopy = [...this.participants];
      for (let i = 0; i < this.totalWinners; i++) {
        if (participantsCopy.length === 0) {
          break; // 沒有更多的參與者
        }
        p=p+1;
        const randomIndex = Math.floor(Math.random() * participantsCopy.length);
        const winner = participantsCopy.splice(randomIndex, 1)[0];
        if (p === this.totalWinners) {
          // 如果只剩下一個獲勝者，把所有點數給他
          points = Math.floor(this.prizeAmount-this.lotteryResults.reduce((acc, result) => acc + result.points, 0));
        } else {
          // 否則，隨機分配剩餘的點數
          points = Math.floor(Math.random() * (this.prizeAmount - this.lotteryResults.reduce((acc, result) => acc + result.points, 0)));
        }
        if (points!=0){
        this.lotteryResults.push({ name: winner.name, points });
        db.collection("member")
        .doc(winner.name)
        .collection("cards")
        .where("cardname", "==", this.currentUser['shopName'])
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // 字段存在
              db.collection("member").doc(winner.name).collection("cards").doc(this.currentUser['shopName']).get().then((doc) => {
                if (doc.exists) {
                this.point = Math.floor(doc.data().point + points);
                console.log(typeof this.point+this.point);
                db.collection("member").doc(winner.name).collection("cards").doc(this.currentUser['shopName']).update({
                    point: this.point,
                });
                console.log("點數已存入");
                
                } else {
                  this.point = 0;
                  console.error("點數不存在");
                }
            }).catch((error) => {
              console.error("獲取卡片時出錯：", error);
              
            });
          } else {
            // 字段不存在
            let URL="";
            db.collection("shops").doc(this.currentUser['shopName']).get().then((doc) => {
              if (doc.exists) {
                URL=doc.data().imageUrl;
                const carddata={
                  cardname:this.currentUser['shopName'],
                  image:URL,
                  point:points,
                }
                db.collection("member").doc(winner.name).collection("cards").doc(this.currentUser['shopName']).set(carddata);
                console.log("已新建"+this.currentUser['shopName']+"集點卡");
              } else {
                console.error("商家圖片不存在");
              }
            })
            .catch((error) => {
              console.error("獲取卡片時出錯：", error);
            });
            
          }
        })
        .catch((error) => {
          console.error("檢查欄位時發生錯誤：", error);
        });
        try {
            db.collection("PointAssign").add({
              AssignPoint: points,
              ShopName: this.currentUser['shopName'],
              friend: "瘋狂點點名", // 可以根據需要修改
              member: winner.name,
              currentTime: nowTimestamp,
            });
            console.log("發送成功");
            
          } catch (error) {
            console.error("保存抽獎結果時出錯：", error);
            alert('點數發放時出錯')
          }
        
        }else{
          console.log("點數已發放完");
        }
      this.$router.push('/DistributionRecord');
      
      }
      alert('點數發放成功！');
        

    },
 handleUploadImage(event) {
  // 確保事件對象有效
    if (event && event.target) {
      // 執行上傳操作
      this.uploadImage(event);
    } else {
      console.error("事件對象無效");
    }
  },

 uploadImage() {  
    db.collection('CarouselAd')
      .orderBy('AdSerialNum', 'desc')
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // 取得最大的 AdSerialNum 值
          const currentAdSerialNum = doc.data().AdSerialNum;

          // 將字串轉換為整數，並加1
          const maxAdSerialNum = parseInt(currentAdSerialNum, 10) + 1;
          const formattedAdSerialNum = maxAdSerialNum.toString().padStart(5, '0');

          // 更新元件中的數據
          this.maxAdSerialNum = formattedAdSerialNum;

          // 在這裡列印 this.maxAdSerialNum
          console.log(this.maxAdSerialNum);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    const startDate = this.$refs.startDate.value; 
    const endDate = this.$refs.endDate.value;
    this.startDate=startDate;
    this.endDate=endDate;
      if (this.$refs.fileInput.files.length > 0) {
        const file = this.$refs.fileInput.files[0];
        const storageRef = storage.ref();
        const imageRef = storageRef.child("ad/" + file.name);
        imageRef
        .put(file)
        .then((snapshot) => {
          console.log("文件上傳成功！");
          alert("申請成功！");
          // 取得上傳後的文件 URL
          snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              db.collection("CarouselAd")
                .doc(this.maxAdSerialNum)
                .set({
                  AdImage: downloadURL, // 將文件 URL 作為 AdImage 的值
                  AdSerialNum: this.maxAdSerialNum,
                  StarDate:this.startDate,
                  endDate:this.endDate,
                  shopName:this.currentUser['shopName'],
                });
              console.log(this.maxAdSerialNum);
            })
            .catch((error) => {
              console.error("取得文件 URL 失敗：", error);
              alert("上傳失敗");
            });
        })
        .catch((error) => {
          console.error("文件上傳失敗：", error);
          alert("上傳失敗");
        });
      }else {
      console.error("沒有選擇圖片");
      alert("沒有選擇圖片");
      }
  },
},
created(){
    const user = localStorage.getItem('shop');
    if (user) {
      // 將JSON字串轉換為對象
      this.currentUser = JSON.parse(user);
      this.currentUserLoaded = true; // 標誌用戶資料已加載
    }else{
      this.$router.push({path:'/Login'});
      alert("登入後才能使用喔");
    }
    this.getParticipantsFromFirebase();
  },
};

</script>


<style>
.container {
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
height: 100vh;
text-align: center;
height: 100%;
}
.header {
  background-color: #464E2E;
  color: white;
width: 100%;
}

td {
padding: 15px;
}

.AdPhoto + td input[type="file"] {
  width: 200px;
}

.submit1, .submit2 {
border-style: none;
background-color: #ed8080;
font-size: 25px;
border-radius: 5px;
margin: 15px;
height: 50px;
width: 100px;
}

.submit2 {
background-color: #98CAF9;
}

.down {
background-color: #FAF0E4;;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #d6c9b3;
}
</style>

