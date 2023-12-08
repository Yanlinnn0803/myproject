<template>
    <div class="back">
    <div class="title">
      <div class="titletext">點數發放紀錄</div>
    </div>
    <div class="down">
      <div v-for="record in pointRecords" :key="record.id" class="record">
        <div class="avatar">
          <img :src="record.avatar" alt="頭像" />
        </div>
        <div class="record-display">
        <div class="member-id">{{ record.memberId }}</div>
        <div class="date">{{ record.date }}</div>
        </div>
        <div class="points">
          <span :class="record.points > 0 ? 'increase' : 'decrease'">{{ record.points }}</span>
        </div> 
      </div>
    </div>
      <FooterIcon />
    </div>

  </template>
  
  <script>
  import firebase from 'firebase/compat/app';
  import FooterIcon from '../components/FooterIcon.vue';
  import avatar1 from '../assets/YB.png';
  //import avatar2 from '../assets/AG.png';
  //import avatar3 from '../assets/OG.png';
  //import avatar4 from '../assets/BB.png';
  //import avatar5 from '../assets/AB.png';
  import { db } from "../config/firebaseConfig.js";
  export default {
    components:{
        FooterIcon
    },
    data() {
      return {

        pointRecords: [],
        currentUser: '',
        iteractioncount:0,
      };
    },
    methods:{

    },
    async created() {
    const user = localStorage.getItem('shop');
    if (user) {
    this.currentUser = JSON.parse(user);
    this.currentUserLoaded = true;
    }else{
      this.$router.push({path:''});
    }
    // 建立 Firebase 資料庫查詢，並按時間欄位降序排序
    const itemsRef = db.collection('PointAssign')
      .where('ShopName', '==', this.currentUser['shopName'])
      .orderBy('currentTime', 'desc');
    try {
      // 等待查詢結果
      const snapshot = await itemsRef.get();

      // 清空原始 pointRecords 數組
      this.pointRecords = [];
      this.iteractioncount = 0;

      // 處理查詢結果
      snapshot.forEach((doc) => {
        this.iteractioncount++;
        const record = doc.data();
        if (record.currentTime instanceof firebase.firestore.Timestamp) {
          const date = record.currentTime.toDate();
          const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，需要加 1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}/${month}/${day} ${hours}:${minutes}`;
        };
        const formattedDate = formatDate(date);
        // 將查詢結果新增至 pointRecords 數組
        this.pointRecords.push({
          id: this.iteractioncount, // 文件 ID
          // 其他字段
          avatar: avatar1,
          memberId: record.member,
          date: formattedDate,
          points: record.AssignPoint,
        });
          // 其他處理日期的代碼
        } else {
          //console.log("好友贈點不顯示");
        }
        
      });
    } catch (error) {
      console.error("ERROR：", error);
    }
  
},
  }
</script>
  
<style>
  /*.point-records {
    text-align: center;
  }*/
  .title{
    background-color: #464E2E;
    color: white; 
    width: 100%;
    text-align: center;
    padding-top:0% ;
    margin-top:0% ;
    
  }
  
  .record {
    padding: 10px 0 10px;
    display: flex;
    align-items: center;
        
  }
  .record:not(:last-child) {
    border-bottom: 1px solid #000;
}
  
  .avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .member-id{
    font-size: 20px;
    margin-left: 20px;
    /*position:absolute;*/
  
}
  .date {
    font-size: 15px;
    margin-top: 25px;
    margin-left: 20px;
    color: 	#6C6C6C;
}
  .points {
    font-size: 20px;
    margin-left: auto;
    padding-right: 3% ;
}
  
  .increase {
    color: green;
  }
  
  .decrease {
    color: red;
  }
  .back {

  background-color: #d6c9b3;
}

.titletext{
  margin-top: 0%;
  padding-bottom: 10%;
  margin-bottom: 3%;
  font-size: 32px;
  padding-top:10% ;
  font-weight:700;
}
.down{
  margin-top:5% ;
}
 
  </style>