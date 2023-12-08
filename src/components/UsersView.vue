<template>

<div class="bk">
    <header class="hd">
      <img class="img" src="../assets/back.png" width="50" @click="backback">
      <div class="backtext">回集集復集集首頁</div>
    </header>
    <div class="centerbox">
      <div class="titletext">請先登入</div>
        <div class="text">帳號</div>
        <div class="content">
         <input class="box" type="text" v-model="account">
        </div>
        <div class="text">密碼</div>
        <div class="content2">
         <input class="box" type="text" v-model="password">
        </div>

        <!--<p class="forget">忘記密碼</p>-->
    </div>
    <div class="loginbt">
        <button class="bt1" v-on:click.prevent="submitForm">登入</button>
        <button class="bt2" v-on:click.prevent="ToRegister">註冊</button>
    </div>

  
</div>

</template>

<script>
import { db,auth } from "../config/firebaseConfig.js";
 export default {
    name: 'LoginPage',
    components:{
    },
    data(){
        return {
        account: '',
        password:'',
      };
    },
    methods:{
      backback() {
            this.$router.push({ path: '/' });
        },
      submitForm() {
        this.login();
        // 使用 router 進行編程式導航
      },
      ToRegister() {
        this.$router.push('/RegisterPage');
      },
      async login() {
        var shopRef = db.collection("shops");
        var query = shopRef.where("account", "==", this.account);
        var shopIDSnapshot = await query.get();
        auth.signInWithEmailAndPassword(this.account, this.password)
        .then(userCredential => {
          
          
                let shopId;
                let user;
                user = userCredential.user;
                shopIDSnapshot.forEach((doc) => {
                  shopId = doc.id; // 取得文件的 ID
                });
                
                // 在這裡可以使用 shopId 和 user
                const a = {
                  account: this.account,
                  shopName: shopId,
                  
                };
                console.log("shopID:",shopId);
                console.log("a:",a);
                console.log('登入成功', user);
                alert('登入成功');
                if (localStorage.getItem('shop')) {
                  localStorage.removeItem('shop'); // 刪除名為 'user' 的本機儲存數據
                }
                localStorage.setItem('shop', JSON.stringify(a));
                /*const query = db.collection("PointAssign").where("friend","==","瘋狂點點名")
                query.get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      // 使用 .delete() 方法刪除文件
                      doc.ref.delete()
                        .then(() => {
                          console.log("文件已成功刪除");
                        })
                        .catch((error) => {
                          console.error("刪除文件時發生錯誤：", error);
                        });
                    });
                  })
                  .catch((error) => {
                    console.error("查詢文件時發生錯誤：", error);
                  });*/
                this.$router.push('/StoreAchievement')
          }).catch(error => {
          // 登入失敗後的處理
          console.log('登入失敗',error);
          alert('登入失敗')
          this.$router.push('/');
        })
    },
    },
};
</script>

<style>
.backtext{
  font-size: 28px;
  font-weight: 700;
  margin: 5%;
  margin-top:8% ;
  padding-top: 2%;
}
.centerbox{
  background-color: beige;
  border-radius: 10%;
  margin: 5%;
  padding: 2%;
}
.titletext {
    font-size: 40px;
    text-align: center;
    font-weight: 700;
    padding-top:5% ;
    margin-bottom: 5%;
}
.content{
    margin: 5%;
    margin-top: 0%;
    
    text-align: center;
    font-size: 25px;  
}

.content2{
    margin: 5%;
    margin-top: 0%;
    padding-bottom: 5%;
    text-align: center;
    font-size: 25px;  
}
.box{
    width: 250px;
    height: 40px;
    border-style: none;
}
.bk{
    height: 500px;
    width: auto;
    background-color: #d6c9b3;
    position: relative; 
    margin-bottom: 20px;
}
.hd{
    margin-top: 40%;
    background-color: #d6c9b3;
    height: 50px;

}
.text{
    margin-left: 5%;
    font-size: 24px;
    font-weight: 700;
    padding-bottom: 3%;
}
.forget{
    text-align: center;
    
}
.enter{
    text-align: center;
    justify-items: center;
}
.bt1,
.bt2 {
  font-size: 30px;
  font-weight: bolder;
  border-style: none;
  border-radius: 10px;
  margin: 1vw auto; 
  padding: 1vh 2vw;
  
  color: white;
  position: absolute;
  top: 80%;
}
.bt1 {
 
  margin: auto 50% auto auto; 
  background-color: #0066CC;
}
.bt2 {
  margin: auto 5% auto auto ;
  background-color: #FFCCCC;
  color: red;
}
.img{
  float: left;
}
.loginbt{
  margin-left: 29%;
  margin-top: 8%;

}

body {
  
  background-color: #d6c9b3;
}
.loginbt {
  display: flex;
  justify-content: center; 
}
.button.bt1.bt2{
  margin-top:5% ;
}
</style>

