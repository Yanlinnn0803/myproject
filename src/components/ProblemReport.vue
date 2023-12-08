<template>
  <div class="back">
    <div id="title">
      <h1>店家問題反饋</h1>      
    </div>
    
    <div class="container">
      <h2>主旨</h2>
      <input type="text" v-model="subject" />
      <h2>問題闡述</h2>
      <textarea v-model="description" ></textarea>
    </div>

    <input type="button" v-on:click.prevent="submitFeedback" value="送出" id="submit">
    <FooterIcon />
  </div>
</template>
  



<script>
import { db } from "../config/firebaseConfig.js";
import FooterIcon from '../components/FooterIcon.vue';
export default {
  components: {
      FooterIcon
    },
  data() {
    return {
      subject: '',
      description: '',
    };
  },
  methods: {
  async submitFeedback() {
    if (!this.subject && !this.description) {
      // 若兩者者都未填，顯示提示並不执行提交
      alert('請填寫主旨和問題闡述');
    } else if (!this.subject) {
      // 未填寫主旨，顯示提示並不執行提交
      alert('請填寫主旨');
    } else if (!this.description) {
      // 未填寫問題闡述，顯示提示並不执行提交
      alert('請填寫問題闡述');
    } else {
      const user = JSON.parse(localStorage.getItem('shop'));
      if (user && user.shopName) {
        try {
          await db.collection("ShopProblem").doc(this.subject).set({
            main: this.subject,
            content: this.description,
            shopName: user.shopName, // 將 ShopName 包括在紀錄中
          });
          // 反饋成功，顯示提示
          console.log('反饋成功');
          alert('問題反饋提交成功！');
        } catch (error) {
          console.error('提交反饋时出錯：', error);
          // 提交反饋時出错，顯示提示
          alert('提交反饋時出錯');
        }
      } else {
        // 用户未登录，显示提示并不执行提交
        alert('用户未登录，请先登录');
      }
    }
  },
},
  created() {
    const user = localStorage.getItem('shop');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.currentUserLoaded = true;
      console.log(user);
    }else{
      this.$router.push({path:'/Login'});
      alert("登入後才能使用喔");
    }
  },
  
};
</script>

<style>
.container {
    margin-top: 40%;
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
h2 {
  font-size: 25px;
  margin-top: 20px;
  margin-left: 5%;
}

input{
  width: 80%;
  padding: 10px;
  border: 1px solid #FAF0E4;
  border-radius: 4px;
  font-size: 17px;
  margin: 5%;
  margin-left: 8%;
}
textarea {
  width: 80%;
  height:300px;
  padding: 10px;
  border: 1px solid #FAF0E4;
  border-radius: 4px;
  font-size: 17px;
  margin: 5%;
  margin-left: 8%;
}
#submit{
    /*position: absolute;
    top: 80%;
    left: 50%;*/
    transform: translate(-50%, -50%);
    border-radius: 20px;
    background-color: #ed8080;
    color: black;
    border-color: lightgray;
    border-style: hidden;
    font-weight: bold;
    font-size: 20px;
    height: 50px;
    width: 100px;
    margin-top:5% ;
    margin-left: 50%;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .back {
  
 
  background-color: #d6c9b3;
}

</style>