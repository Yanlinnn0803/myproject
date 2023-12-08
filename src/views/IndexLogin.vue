<template>
    <div class="login-container">

        <h2>登入</h2>

        <form>
            <div class="form-group">
                <label for="name">姓名</label>
                <input type="text" id="name" v-model="name">
            </div>
            <div class="form-group">
                <label for="phone">手機</label>
                <input type="text" id="phone" v-model="phone" @input="validatePhone(phone)">
                <!-- 显示错误消息 -->
                <div v-if="!phoneIsValid" class="error-message">{{ 電話格式不對 }}</div>
                <div v-if="!name" class="error-message">{{請輸入姓名}}</div> <!-- 直接检查 name 变量是否为空来显示错误消息 -->
            </div>
            <!--<div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email">
            </div>
            <div class="form-group">
                <label for="birthday">生日</label>
                <input type="date" id="birthday" v-model="birthday">
            </div>-->
            <div class="form-group centered">
                <router-link to="/IndexLocation" class="link">
                    <button type="submit" 
                            v-if="phoneIsValid && name" 
                            v-on:click="validateAndLogin(name, birthday, email, phone)">登入</button>
                </router-link>
            </div>

        </form>

    </div>
</template>

<script>
//import { useRouter } from 'vue-router';
import { db } from "../config/firebaseConfig";
//import { mapActions } from 'vuex'; // 引入 Vuex 的 mapActions

import { ref } from 'vue';
import axios from 'axios';
//import { API_URL } from "@/config";
  
// yourClient_id 請設置為實際Channel ID 值
const client_id = ref('2000105661')
// yourURI 請設置為實際Line developer 設定的重新導向網址
// const redirect_uri = ref('http://localhost:8080/IndexLogin/')
// yourClient_secret 請設置為實際Channel Secret 值
const client_secret = ref('4310f708fafc97a14321aa2d452004c6')
  
export default {
    setup() {
        /*const router = useRouter();
        const pageJump = () => {//pagejump是變數名稱 作業面跳轉用 連結下方js後端判讀跟上方的前端連結
            router.push('/member'); 
        };*/
        (async () => {
        try {
        // 使用 window.location.search 和 urlParams 獲取當前網頁 URL 中的查詢參數
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        /* 
        使用 get 方法從 urlParams 實例中獲取名為 code 的參數的值。(授權碼，通常由用戶在身份驗證流程中獲得)
        如果查詢字串中存在名為 code 的參數，code 變數將被賦值為該參數的值；否則，code 變數將為 null。
        */

        const code = urlParams.get('code');            
        // 使用 require 引入模組的方式引入qs模組
        const qs = require('qs');
            

        /*
        使用 Axios 發送 HTTP POST 請求到指定的 URL
        並指定 'Content-Type': 'application/x-www-form-urlencoded' 標頭以指示伺服器使用 URL 編碼形式解析參數
        grant_type：指定授權類型為 "authorization_code"
        code：授權碼，這個值是從 code 變數中取得的
        redirect_url：指定用戶授權完成後的重定向 URL
        client_id：用於識別應用程式的客戶端 ID
        client_secret：應用程式的客戶端密鑰
        這些參數使用 qs.stringify 函式轉換為 URL 編碼的形式，以符合 "application/x-www-form-urlencoded" 的請求格式
        Content-Type': 'application/x-www-form-urlencoded'：指定請求的內容類型為 URL 編碼形式
        */
        const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify({
            grant_type: 'authorization_code',
            code: code,
        // yourURI 請設置為實際Line developer 設定的重新導向網址
            redirect_uri: 'https://gt-db-b8189.web.app/IndexLogin/',
            client_id: client_id.value,
            client_secret: client_secret.value
        }), {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        });
        
        /*
        從 tokenResponse 的回應資料中取得 access_token 和 id_token。
        這些欄位是從 LINE 登入 API 取得的授權資訊。
        access_token 是用來作為驗證的令牌
        id_token 是使用者的身份令牌。
        */
        const accessToken = tokenResponse.data.access_token;
        const idToken = tokenResponse.data.id_token;
        
        /*
        使用 Axios 發送 HTTP POST 到 https://api.line.me/oauth2/v2.1/verify，驗證 id_token 以獲取包含使用者資訊的回應
        id_token：用於識別使用者的身份令牌
        client_id：用於識別應用程式的客戶端 ID
        使用 qs.stringify 函式轉換為 URL 編碼的形式，以符合 "application/x-www-form-urlencoded" 的請求格式
        Content-Type': 'application/x-www-form-urlencoded'：指定請求的內容類型為 URL 編碼形式。
        'Authorization': 'Bearer ' + accessToken：使用存取令牌進行身份驗證，將存取令牌放在 'Bearer ' 字符串之後。
        */
        const userInfoResponse = await axios.post('https://api.line.me/oauth2/v2.1/verify', qs.stringify({
            id_token: idToken,
            client_id: client_id.value
        }), {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        }
        });
        
        /*
        根據需求，可以在登入後的處理中進行相應的操作，例如驗證用戶資訊、儲存登入狀態等。
        */
        const lineUserId = userInfoResponse.data.sub;
        const lineNickname = userInfoResponse.data.name;
        const lineUserPicture = userInfoResponse.data.picture;
        //const lineAccountTypeID = 1;
        
        /*
        const response = await axios.post(`${API_URL}lineLogin.php`, {
            userId: lineUserId,
            nickname: lineNickname,
            userPicture: lineUserPicture,
            accountTypeID: lineAccountTypeID
        });
        */
            
        localStorage.setItem("userId", lineUserId);
        localStorage.setItem("nickname", lineNickname);
        localStorage.setItem("userPicture", lineUserPicture);
        //window.location.reload();
        
        } catch (error) {
        console.log(error);
        }
        })();
        /*return {
            pageJump,//要執行的變數名稱\
            ...mapActions(['setUserInfo']), // 将 Vuex 的 setUserInfo 映射到当前组件
        };*/
    },  
    //這邊 放會需要做變數狀態指定(寫入/讀取/狀態判斷的變數名稱)
    data() {
        return {
            name: '',
            phone: '',
            //email: '',
            //birthday: '',
            phoneIsValid: false,//設定電話結構的初始狀態 要在後續作登入許可之判定
            //nameIsValid: false, 
            message: '', // 我打api到後台的回傳資料
        };    
    },
    methods: {
    // 電話號碼格式驗證有沒有錯 僅驗證是否全為數字
    validatePhone() {
        const phonePattern = /^[0-9]{10}$/;
        this.phoneIsValid = phonePattern.test(this.phone);
    },
    async validateAndLogin() {        
        this.validatePhone();
        if (!this.phoneIsValid || !this.name) {
            window.alert('请输入有效的电话号码和姓名');
            return;
        }
        
        try {
            const memberRef = db.collection("member");//資料寫入member 這個集合
            const lineUserId = localStorage.getItem("userId");
            const lineNickname = localStorage.getItem("nickname");
            const linePicture = localStorage.getItem("userPicture");
            // 我用電話號碼直接當作每筆資料的id(pk) 所以先確認是否已存在 就是註冊過 資烙允許覆蓋 但不重複建立同id的資料
            const existingDoc = await memberRef.doc(this.phone).get();
            
            if (existingDoc.exists) {
                // 如果是已存在id執行這段
                await memberRef.doc(this.phone).set({
                    //這邊前面加this標籤用意用以指定為要寫入資料庫的欄位，反之沒接但有設定在上方data處的 就是做別的動作而沒有寫入資料庫之需求
                    name: this.name,//資料欄位
                    //birthday: this.birthday,
                    //email: this.email,
                    phone: this.phone,
                    lineid: lineUserId,
                    linenickname: lineNickname,
                    linepicture: linePicture
                }, { merge: true });//合併認可(firebase語法 只查到這個) 
                // 在這裡新增 "friends" 子集合

                // 在這裡新增 "friends" 子集合
                const friendsRef = memberRef.doc(this.phone).collection("friends");
                friendsRef.doc("initialFriend").set({
                // 這裡可以添加初始的好友信息，例如空的好友列表
                });
                
                const cardsRef = memberRef.doc(this.phone).collection("cards");
                cardsRef.doc("initialFriend").set({
                    cardname:"您沒有任何卡片",
                    image: "",
                    point:"尚未開始累積"
                });
                const favRef = memberRef.doc(this.phone).collection("FavStore");
                favRef.doc("initialFriend").set({

                });

                const initialDocRef = friendsRef.doc("initialFriend");
                initialDocRef.delete();
                const initialcardRef = cardsRef.doc("initialFriend");
                initialcardRef.delete();
                const initialfavRef = favRef.doc("initialFriend");
                initialfavRef.delete();

                const name = this.name;
                //const email = this.email;
                const phone = this.phone;
                localStorage.setItem('userInfo',JSON.stringify({name, phone}));
                window.alert('好久不見，歡迎登入');//彈窗告知用戶
                this.message = '已註冊，歡迎登入';//在api連結顯示處顯示連結之返回結果
            } 
            
            else {
                // 如果這個電話號碼(id)還不存在 就建立新的一筆資料
                await memberRef.doc(this.phone).set({
                    name: this.name,
                    //birthday: this.birthday,
                    //email: this.email,
                    phone: this.phone,
                    lineid: lineUserId,
                    linenickname: lineNickname,
                    linepicture: linePicture
                });
                // 在這裡新增 "friends" 子集合
                const friendsRef = memberRef.doc(this.phone).collection("friends");
                friendsRef.doc("initialFriend").set({
                // 這裡可以添加初始的好友信息，例如空的好友列表
                });
                
                const cardsRef = memberRef.doc(this.phone).collection("cards");
                cardsRef.doc("initialFriend").set({
                    cardname:"您沒有任何卡片",
                    image: "",
                    point:"尚未開始累積"
                });
                const favRef = memberRef.doc(this.phone).collection("FavStore");
                favRef.doc("initialFriend").set({

                });

                

                const name = this.name;
                //const email = this.email;
                const phone = this.phone;
                localStorage.setItem('userInfo',JSON.stringify({name, phone}));
                window.alert('歡迎註冊，登入愉快');//彈窗告知用戶
                this.message = '歡迎註冊，登入愉快';//在api連結顯示處顯示連結之返回結果

            }
        } catch (error) {
            console.error("網頁出錯，請重新作業 ", error);//出錯之api警語
        }
    },
    },
};
</script>

<style scoped>
.login-container {
    background-color: #715749;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    border-radius: 5%;
    width: 80%;
    max-width: 400px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.form-group {
    margin-bottom: 25px;

    justify-content: center;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #fff;
}

input[type='text'],
input[type='email'],
input[type='date'] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #d6c9b3;
    width: 40%;
    /* 填滿父容器寬度 */
    margin: 0 auto;
    /* 水平置中 */

}

.centered {
    text-align: center;
}

h2 {
    color: #fff;
    text-align: center;
}

/* RWD 設定 */
@media (max-width: 480px) {
    .login-container {
        width: 90%;
    }
}
</style>