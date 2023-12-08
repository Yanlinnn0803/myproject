<template>
    <div class="bc">
        <div class="hd">
            <img src="../assets/back.png" width="50" @click="ToUsersView">
        </div>
        <h2>申請加入 集集復集集 集點平台</h2>
        <p>各位業者您好：請配合填寫以下資訊，以利集集復集集集點平台進行審核，有任何問題歡迎來信，期待與您的合作。
            我們的信箱：pointcollect@gmail.com</p>
        <div class="cont">
            <div class="account">
                <p>帳號&nbsp;<span id="mark-input">(同電子信箱)</span></p>
                <input v-model="account" type="text" class="box" @input="ShopMail = account" required>
                <p>密碼</p>
                <input v-model="password" type="text" class="box" required>
            </div>
            <p>店家名稱</p>
            <input v-model="ShopName" type="text" class="box" required>
            <p>負責人姓名</p>
            <input v-model="ShopBoss" type="text" class="box" required>
            <p>負責人信箱</p>
            <input v-model="ShopMail" type="text" class="box" required>
            <p>負責人連絡電話</p>
            <input v-model="ShopBossPhone" type="text" class="box" required>
            <p>餐廳連絡電話</p>
            <input v-model="ShopRestPhone" type="text" class="box" required>
            <p>營業時間</p>
            <input type="time" v-model="openingHours" class="box" required>
            <p>~</p>
            <input type="time" v-model="closingHours" class="box" required>

        <p>店家位址</p>
        <input v-model="ShopAddress" type="text" class="box" required>
        <p>分類</p>
        <select v-model="category" class="box" required>
            <option value="小吃">小吃</option>
            <option value="飲料">飲料</option>
            <option value="炸物">炸物</option>
            <option value="甜點">甜點</option>
            <option value="美式料理">美式料理</option>
            <option value="日式料理">日式料理</option>
            <option value="泰式料理">泰式料理</option>
            <option value="韓式料理">韓式料理</option>
        </select>

        <p>集點卡圖片</p>
        <table>
            <tr>
                <td><input type="file" ref="fileInput"></td>
                <!--<td><button class="btupload">上傳</button></td>-->
            </tr>
        </table>
        <div class="paper">
            <input type="checkbox"  v-model="readInstructions" required>我已閱讀公開說明書
        </div>
        <div class="btregister">
            <button v-on:click.prevent="submitForm" class="btsubmit">送出</button>
        </div>   

        </div>
    </div>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { db, auth, firebaseConfig } from "../config/firebaseConfig.js";
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export default {
    name: 'RegisterPage',
    components: {},
    data() {
        return {
            ShopName: '',
            ShopBoss: '',
            ShopBossPhone: '',
            ShopMail: '',
            ShopRestPhone: '',
            openingHours: '00:00',
            closingHours: '00:00',
            ShopAddress: '',
            category: '小吃',
            readInstructions: false,
            account: '',
            password: '',
            isRegistered: false
        };
    },
    methods: {
        ToUsersView() {
            this.$router.push({ path: '/' });
        },
        async submitForm() {
            if (!this.readInstructions) {
                alert('請勾選公開說明書');
                return;
            }

            const fileInput = this.$refs.fileInput;

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const storageRef = storage.ref();
                const imageRef = storageRef.child("ShopPic/" + file.name);
                
                try {
                    // 上傳文件到Firebase Storage
                    await imageRef.put(file);
                    
                    // 獲取上傳後的文件的下載URL
                    const downloadURL = await imageRef.getDownloadURL();

                    // 上傳其他資料到Firestore
                    await db.collection("shops").doc(this.ShopName).set({
                        ShopName: this.ShopName,
                        ShopBoss: this.ShopBoss,
                        ShopBossPhone: this.ShopBossPhone,
                        ShopMail: this.ShopMail,
                        ShopRestPhone: this.ShopRestPhone,
                        openingHours:this.openingHours,
                        closingHours:this.closingHours,
                        ShopAddress: this.ShopAddress,
                        ShopGivePoint: 0,
                        account: this.account,
                        category: this.category,
                        imageUrl: downloadURL, // 添加文件下載URL
                    });

                    console.log('輸入成功');
                    const email = this.account;
                    const password = this.password;
                    await auth.createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            // 註冊成功
                            console.log("註冊成功，" + this.ShopName);
                            alert("註冊成功，" + this.ShopName);
                            this.isRegistered = true; // 設置為已註冊成功
                            this.$router.push({ path: '/Login' });
                        })
                        .catch((error) => {
                            // 註冊失敗，處理錯誤
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.error(errorMessage);
                            alert(errorMessage);
                            // 根據錯誤代碼處理錯誤
                            if (errorCode === "auth/weak-password") {
                                console.error("註冊失敗：密碼太弱");
                                alert("註冊失敗：密碼太弱");
                            } else if (errorCode === "auth/email-already-in-use") {
                                console.error("註冊失敗：該電子郵件地址已被使用");
                                alert("註冊失敗：該電子郵件地址已被使用");
                            } else {
                                console.error("註冊失敗，錯誤代碼：" + errorCode);
                                alert("註冊失敗，錯誤代碼：" + errorCode);
                            }
                        });
                } catch (error) {
                    console.error("上傳或註冊失敗：", error);
                    alert("上傳或註冊失敗");
                }
            } else {
                console.error("沒有選擇圖片");
                alert("沒有選擇圖片");
            }
        },
    },
};
</script>

<style>
h2{
    text-align: center; 
}
.paper{
    margin-bottom: 20px;
    font-size: larger;
    font-weight: bolder;
}
.hd{
    background-color: #d6c9b3;
    /*margin-top: -20px;*/
    margin-top:5% ;
    
}
td input[type="file"] {
  width: 250px; 
}
.btupload{
    background-color: #ed8080;
    border-style: none;
    border-radius: 5px;
    font-size: 25px;
    margin-right: 20px ;
}
.btregister {
    text-align: center; 
    display: flex;
    justify-content: center; 
  }

  .btclean {
    border-style: none;
    background-color: #BDBDBD;
    font-size: 20px;
    border-radius: 5px;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 15px;
  }

  .btsubmit {
    border-style: none;
    background-color: #ed8080;
    border-radius: 5px;
    font-size: 20px;
    padding: 15px;
    margin-bottom: 20px;
  }
.bc{
    height: auto;
    width: 100%;
    background-color: #d6c9b3;      
}
.box{
    width: 250px;
    height: 30px;
    border-style: none;
}
.time-selection {
    display: block;
    align-items: center;
    position: relative;
    left: 55%;
    transform: translateX(-50%);
}

.box1 {
    width: 60px;
    height: 30px;
    border-style: none;
    /*margin: 0 10px; */
}
.cont{
    position: relative;
    text-align: center;
}
.email{
    font-style: oblique;
}
#mark-input {
  color: red;
  font-weight: bold;
}
body {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  margin: 0;
  margin-top: 0;
  padding: 0;
  background-color: #d6c9b3;
}

</style>