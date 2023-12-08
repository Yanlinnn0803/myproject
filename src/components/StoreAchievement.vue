<template>
  
    <div id="title">
    <h1>店家管理</h1>
    </div>
    <div id="bgcolor">
    <div id="container">
    <h2>本月已發放點數</h2>
    <table>
        <tr>
            <td><img src="../assets/ShopPoint.png" width="50"></td>
            <td><h2>{{a}}</h2></td>
        </tr>
    </table>
    <hr>
    <h2>本月累積抽成</h2>
    <table>
        <tr>
            <td><img src="../assets/dollar.png" width="50"></td>
            <td><h2>{{a}}</h2></td>
        </tr>
    </table>
    <hr>
    <table class="memset">
        <tr>
            <td><img src="../assets/user.png" width="50"></td>
            <td>更改基本資訊</td>
            <td><a href="/ChangeView"><img class="enter" src="../assets/next.png" width="30"></a></td>
        </tr>
        <!--<tr>
            <td><img src="../assets/rest.png" width="50"></td>
            <td>  <p v-if="good" class="run">營業中</p><p v-else class="rest">休息中</p></td>
            <td><button @click="toggle" class="btt">切換狀態</button></td>
        </tr>-->
        <tr>
            <td><img src="../assets/surprise-box.png" width="50"></td>
            <td>活動申請</td>
            <td><a href="/ActivityView"><img  class="enter" src="../assets/next.png" width="30"></a></td>
        </tr>
        <tr>
            <td><img src="../assets/question.png" width="50"></td>
            <td>問題回饋</td>
            <td><a href="/ProblemReport"><img  class="enter" src="../assets/next.png" width="30"></a></td>
        </tr>
    </table>
</div>
</div>
<FooterIcon />
</template>
<script>
import { ref } from 'vue'
import FooterIcon from '../components/FooterIcon.vue';
import { db } from "../config/firebaseConfig.js";
import firebase from 'firebase/compat/app';
export default {
  name: 'ProductsPage',
  components: {
    FooterIcon
  },
  data(){
    return {
      currentUser: '',
      currentUserLoaded: false, // 新增一個標誌來表示用戶數據是否加載完成
      totalAssignPoints:0,  
      a:"",
    }
  },
  setup() {
    const good = ref(true);

    function toggle() {
      good.value = !good.value;
    }

    return {
      good,
      toggle
    };
  },
  async created() {
    const user = localStorage.getItem('shop');
    if (user) {
      // 將JSON字符串轉換為對象
      this.currentUser = JSON.parse(user);
      this.currentUserLoaded = true;
    }else{
      this.$router.push({path:'/Login'});
      alert("登入後才能使用喔");
    }
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const formattedFirstDayOfMonth = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
    const formattedLastDayOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
    const startTime = firebase.firestore.Timestamp.fromDate(formattedFirstDayOfMonth);
    const endTime = firebase.firestore.Timestamp.fromDate(formattedLastDayOfMonth);

    console.log(formattedFirstDayOfMonth);
    console.log(formattedLastDayOfMonth);
    // 重置totalAssignPoints
    this.totalAssignPoints = 0;

    try {
      const query = await db.collection('PointAssign')
        .where('ShopName', '==', this.currentUser['shopName'])
        .where('currentTime', '>=', startTime)
        .where('currentTime', '<=', endTime) 
        ;

      query.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
                
            const data = doc.data();
            this.totalAssignPoints += data.AssignPoint;
          });
          this.a=this.totalAssignPoints.toFixed(2);
          console.log('Total Assign Points for the month:', this.totalAssignPoints);
        }).catch((error) => {
                    console.error("查詢文件時發生錯誤：", error);
                  });
        

      
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  }
};

</script>



<style>
td{
    padding: 10px;
}
#container {
    background-color: #FAF0E4;
    width: 80%;
    margin: 40% auto 0;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20%;
}
#title{
    background-color: #464E2E;
    color: white;
    width: 100%;
    text-align: center;
    position: absolute;
    top:0;
    left: 0;
  }
.memset{
    text-align: center;

}
.btt{
    border-style: none;
    background-color: #BDBDBD;
    padding: 15px;
    border-radius: 5px;
}
.run{
    color:rgb(22, 207, 145);
    font-weight: bolder;
    font-size: 20px;
}

.rest{
    color: rgb(226, 83, 83);
    font-weight: bolder;
    font-size: 20px;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #d6c9b3;
}

</style>