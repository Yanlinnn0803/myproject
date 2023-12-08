<template>
    <div class="body">
    <div class="box">
        <div class="titletext">歡迎來到</div>
        <div class="title">集集復集集</div>
        <div class="titletext">集點數位平台</div>
        <img :src="logo" alt=" ">

        <div class="indexpagebutton">
            <button type="button" @click="loginClicked">我是使用者</button>

            <button type="submit" @click="storeClick">我是店家</button>
        </div>

    </div>
</div>
   
</template>

<script>
import { useRouter } from 'vue-router';
//import { db } from "../config/firebaseConfig";
export default {
    name: 'HomeView',
    setup() {
        const router = useRouter();
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let Loginlink = window.location.href;
        if (Loginlink.includes('state=login')){//判斷是否登入line
            router.push('/IndexLogin');//有的話直接到填寫資料頁面        
        }
        const loginClicked = () => {
            if (userInfo){
                router.push('/IndexLocation');
                window.alert('好久不見，歡迎登入');
            }else{
                router.push('/LineLogin');
            }
        };
        const storeClick =  () => {
            router.push('/Login');
        };
        return {
            loginClicked,
            storeClick
        };
    },
    data() {
        return {
            imgName: 'logo.png',
            logo: require('@/assets/logo.png'),
        }
    },
}
</script>

<style scoped>
.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0;
    /* 移除 padding */
}

.titletext {
    color: #715749;
    text-align: center;
    /*margin-top: 5px;
    margin-bottom: 5px;*/
    font-size: 24px;
    font-weight: 700;
}

.title {
    color: #715749;
    text-align: center;
    font-size: 36px;
    font-weight: 900;
    /*margin-top: 5px;*/
}

img {
    width: 100%;
    max-width: 300px;
    /* 最大寬度設定為 300px */
    height: auto;
    /* 自動調整高度以保持比例 */
    padding-bottom: 20px;
    padding-top: 20px;
    margin: 0 auto;
}

.indexpagebutton {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

button {
    width: 70vw;
    /* 設定按鈕寬度為畫面寬度的 70% */
    background-color: #715749;
    color: #fff;
    border-radius: 10px;
    text-align: center;
    margin: 0 auto;
    /* 水平置中 */
    border: none;
    padding: 10px 20px;
    margin-bottom: 10px;
    font-size: 20px;
}

a.but-link {
    width: 60vw;
    /* 設定按鈕寬度為畫面寬度的 70% */
    background-color: #715749;
    color: #fff;
    border-radius: 10px;
    text-align: center;
    margin-left: 20px;
    margin-right: 20px;
    border: none;
    padding: 10px 10px;
    margin-bottom: 10px;
}

@media (max-width: 600px) {
    .box {
        width: 100%;

    }

    .input-group {
        flex-direction: column;
        align-items: stretch;
    }

    .input-group label {
        margin-bottom: 10px;
    }
}

.body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #d6c9b3;
}
</style>