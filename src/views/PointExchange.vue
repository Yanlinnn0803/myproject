<template>
    <div class="title">
      <div class="titletext">點數發放</div>      
    </div> 
    <div class="down">
      <form @submit.prevent="submitForm">
      <div id="alert">
        <h2>用戶電話
        <br>
        <br>
        <input v-model="userPhone" type="text" required class="phonenum"></h2>
        <p class="error-message" v-if="showErrorMessage">{{ errorMessage }}</p>
      </div>
      
        <input type="submit" value="送出" id="submit" style="display: none;" />
      </form>
      <div class="btnbox">
        <input v-on:click.prevent="submitForm" type="button" value="送出" id="btn" >
      </div>
      
    </div>
    <FooterIcon />
</template>
  
<script>
import { db } from "../config/firebaseConfig.js";
import FooterIcon from '../components/FooterIcon.vue';

  export default {
    name: 'PointPage',
    components:{
      FooterIcon
    },
    data(){
        return {
        userPhone: '',
        showErrorMessage: false, // 控制是否顯示錯誤訊息
        errorMessage: '電話號碼格式不符', // 錯誤訊息內容
      };
    },

    methods: {
      submitForm() {
      // 移除非數字字符
      this.userPhone = this.userPhone.replace(/\D/g, '');
      // 導入 useRouter
      

      // 檢查電話號碼長度
      if (this.userPhone.length !== 10) {
        this.showErrorMessage = true; // 顯示錯誤訊息
      } else {
        this.showErrorMessage = false; // 隱藏錯誤訊息
        this.check();
      }
      },

      async check() {
        try {
          const memberRef = db.collection("member");
          const query = memberRef.where("phone", "==", this.userPhone);

          const memberIDSnapshot = await query.get();
          
          if(!memberIDSnapshot.empty){
            // 存在滿足條件的數據
            memberIDSnapshot.forEach((doc) => {
              const memberId = doc.id; // 取得文件的 ID
              console.log("輸入成功，會員 ID:", memberId);
              this.$router.push({path:'/InputAmount',query:{data:this.userPhone}});
              // 這裡可以處理 memberData 和 memberId
            });
          } 
          else {
            // 不存在滿足條件的數據
            console.log('没有找到此用戶');
            alert("没有找到此用戶")
          }
        } 
        catch (error) {
          console.error('查詢失敗:', error);
        }
      },
      created() {
        const user = localStorage.getItem('shop');
        if (user) {
          this.currentUser = JSON.parse(user);
          this.currentUserLoaded = true;
        }else{
          this.$router.push({path:'/Login'});
          alert("登入後才能使用喔");
      }}
    },
  };

</script>
  
<style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title{
    background-color: #464E2E;
    color: white; 
    width: 100%;
    text-align: center;
    padding-top:0% ;
    margin-top:0% ;
    
  }
  #alert{
    background-color: #FAF0E4;
    width:80%;
    height: 20%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  h2{
    text-align: center;
    font-size: 30px;
  }
  .phonenum {
  width: 200px; 
  height: 30px; 
  padding: 5px; 
  border: 1px solid #ccc; 
  font-size: 20px; 
  letter-spacing: 2px;
  }
  .error-message {
  color: red;
  font-size: 20px;
  text-align: center;
}
  #submit{
    /*margin-left: 40%;
    margin-top:110%;
    transform: translate(-50%, -50%);*/
    border-radius: 20px;
    background-color: #ed8080;
    color: black;
    border-color: lightgray;
    border-style: hidden;
    font-weight: bold;
    font-size: 20px;
    height: 50px;
    width: 100px;
  }
  body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
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
  margin-top:-10% ;
}

#btn{
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin-top: 115%;
  border-radius: 20px;
    background-color: #ed8080;
    color: black;
    border-color: lightgray;
    border-style: hidden;
    font-weight: bold;
    font-size: 20px;
    height: 50px;
    width: 100px;
}
.btnbox{
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
</style>