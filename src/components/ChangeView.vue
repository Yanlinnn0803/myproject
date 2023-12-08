<template>
    <div id="title">
    <h1>修改基本資料 </h1>
    </div>
    <div id="container">
        <!--<div class="account">
            <p>帳號&nbsp;<span id="mark-input">(同電子信箱)</span></p>
            <input v-model="account" type="text" class="box" @input="ShopMail = account" required>
            <p>密碼</p>
            <input v-model="password" type="text" class="box" required>
        </div>-->
        <p>店家名稱</p>
            <input v-model="ShopName" type="text" class="box" required>
            <p>負責人姓名</p>
            <input v-model="ShopBoss" type="text" class="box" required>
            <!--<p>負責人信箱</p>
            <input v-model="ShopMail" type="text" class="box" required>-->
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
            </tr>
        </table>
        <div class="paper">
            <input type="checkbox" v-model="readInstructions" required>我已閱讀公開說明書
        </div>
        <div class="btregister">
            <button v-on:click.prevent="submitForm" class="btsubmit">確認修改</button>
        </div>   
        <FooterIcon />
    </div>

        
        
</template>
<script>
import FooterIcon from '../components/FooterIcon.vue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { db, firebaseConfig } from "../config/firebaseConfig.js";
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();


  export default {
    components:{
        FooterIcon
    },
    data() {
        return {
            ShopName: '',
            ShopBoss: '',
            ShopBossPhone: '',
            ShopRestPhone: '',
            openingHours: '00:00',
            closingHours: '00:00',
            ShopAddress: '',
            category: '小吃',
            readInstructions: false,
            isRegistered: false,
            currentUser: {},
        };
    },
    methods: {
        async submitForm() {
            if (!this.readInstructions) {
                alert('請勾選公開說明書');
                return;
            }
            //導入 useRouter
            const router = this.$router;
            const fileInput = this.$refs.fileInput;
            
            let oldData;
            let downloadURL;
            const oldDocRef = db.collection("shops").doc(this.currentUser['shopName']);
            const oldDoc = await oldDocRef.get();

                        if (oldDoc.exists) {
                        oldData = oldDoc.data();
                        // 在這裡可以使用 oldData 進行操作，比如比較新數據和舊數據。
                    }
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const storageRef = storage.ref();
                const imageRef = storageRef.child("ShopPic/" + file.name);
                
                try {
                    // 上傳文件到Firebase Storage
                    const uploadTask = imageRef.put(file);
                    await uploadTask;
                    downloadURL = await imageRef.getDownloadURL();
                } catch (error) {
                console.error("修改失敗：", error);
                alert("修改失敗");
                }
            } else {

                    downloadURL=oldData.imageUrl;  
                }
                    

                        // 更新 Firestore 中的文檔名稱
            await oldDocRef.delete();
            const newDocRef = db.collection("shops").doc(this.ShopName);
                                
                            // 上傳其他資料到Firestore
                                await newDocRef.set({
                                    ShopName: this.ShopName,
                                    ShopBoss: this.ShopBoss,
                                    ShopBossPhone: this.ShopBossPhone,
                                    ShopRestPhone: this.ShopRestPhone,
                                    openingHours:this.openingHours, 
                                    closingHours:this.closingHours ,
                                    ShopAddress: this.ShopAddress,
                                    ShopGivePoint: oldData.ShopGivePoint,
                                    ShopMail:oldData.ShopMail,
                                    category: this.category,
                                    imageUrl: downloadURL, 
                                    account:oldData.account,
                                    // 保留原始數據
                                });

                               

                                console.log('修改成功');
                                router.push('/StoreAchievement');
            } 
    },
    
    async created() {
        const user = localStorage.getItem('shop');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.currentUserLoaded = true;
        }else{
            this.$router.push({path:'/Login'});
            alert("登入後才能使用喔");
        }
        const oldDocRef = db.collection("shops").doc(this.currentUser['shopName']);
        const oldDoc = await oldDocRef.get();
        let oldData;
        if (oldDoc.exists) {
            oldData = oldDoc.data();
            this.ShopName=oldData.ShopName; // 在這裡可以使用 oldData 進行操作，比如比較新數據和舊數據。
            this.ShopBoss=oldData.ShopBoss;
            this.ShopBossPhone=oldData.ShopBossPhone;
            this.ShopRestPhone=oldData.ShopRestPhone;
            this.openingHours=oldData.openingHours;
            this.closingHours=oldData.closingHours;
            this.ShopAddress=oldData.ShopAddress;
            this.category=oldData.category;
        }
    },
};
</script>

<style>
#title{
    background-color: #464E2E;
    color: white;
    width: 100%;
    text-align: center;
    position: absolute;
    top:0;
    left: 0;
  }
  #container {
    background-color: #FAF0E4;
    width: 80%;
    margin: 30% auto 0;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20%;
}
.paper{
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: larger;
    font-weight: bolder;
    
}
td input[type="file"] {
  width: 200px; 
}
.btupload{
    background-color: #ed8080;
    border-style: none;
    border-radius: 5px;
    font-size: 25px;
    margin-right: 20px ;
}
.btclean{
    border-style: none;
    background-color: #BDBDBD;
    font-size: 25px;
    border-radius: 5px;
    margin-right: 10px;
    padding: 15px;
}
.btsubmit{
    border-style: none;
    background-color: #ed8080;
    border-radius: 5px;
    font-size: 25px;
    padding: 15px;
}
.bk{
    height: auto;
    width: auto;
    background-color: #D8D8D8;
    
}
.box{
    width: 250px;
    height: 30px;
    border-style: none;
}
.box1{
    width: 60px;
    height: 30px;
    border-style: none;
}
.cont{
    position: relative;
    left: 20px;
    margin-bottom: 100px;
}
.email{
    font-style:oblique;
}
#mark-input {
  color: red;
  font-weight: bold;
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #d6c9b3;
}
</style>