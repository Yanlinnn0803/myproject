<template>
    <div class="backpagebox">

        <div class="header">
            <BackComponent />
            <div class="title">點數紀錄</div>
        </div>

        <div class="scrollbox">
            <div v-for="record in records" :key="record.id" class="recordlistbox">

                <div class="imgbox">
                    <img :src="getImageSource(record)" alt="" class="memberpic">
                </div>

                <div class="memberdata">
                    <!--<h3>{{ record.ShopName }}  {{ record.friend }}</h3>-->
                    <span :style="{ fontSize: '18px', color: 'black',fontWeight:'bolder'}">
                        {{ record.ShopName }}
                        <span v-if="record.friend" :style="{ fontSize: '18px', color: 'black' }">, {{ record.friend }}</span>
                    </span>
                </div>


                <div class="pointbox">
                    <div class="pointpicbox">
                        <img :src="point" alt="" class="pointpic">
                    </div>
                    <div class="count">
                        <span>{{ record.AssignPoint }}</span>
                    </div>
                </div>

            </div>

        </div>

        <FooterComponent />
        

    </div>
</template>

<script>
import BackComponent from '../components/BackComponent.vue';
import FooterComponent from './FooterComponent.vue';
import { db } from "../config/firebaseConfig";

export default {
    components: {
        BackComponent,
        FooterComponent
    },

    data() {
        return {
            memberImage: require('@/assets/member.png'),
            back: require('@/assets/back-l.png'),
            point: require('@/assets/point.png'),
            //memberName: '王大頭', // 之後讀資料庫資料
            //memberId: 'QWER-1234', // 之後讀資料庫資料
            //dbValue: '100', // 初始值為空 到時候讀資料庫
            records: [], // 從資料庫讀取的資料列表
            //userType: '', // 從資料庫讀取的用戶類型，這裡假設是 'user' 或 'store'
        };
    },
    created() {
        // 從資料庫讀取資料並更新 dbValue
        this.fetchDataFromDatabase();
    },
    methods: {

        goBack() {
            this.$router.go(-1);//可以回到router記錄中的上一個頁面
        },


        //const transactionRef = db.collection('PointAssign');
        //const queryRef = transactionRef.where('member', '==', '0922222222');
        async fetchDataFromDatabase() {
            
            const userInfo = JSON.parse(localStorage.getItem("userInfo"))
            console.log(userInfo.phone)
            const pointAssignRef = db.collection('PointAssign');
            const datas = await pointAssignRef.where('member', '==', userInfo.phone).orderBy('currentTime', 'desc').get();
            const dataFromDatabase = [];
            datas.forEach(doc => {
                dataFromDatabase.push(doc.data());
                console.log(doc.id, doc.data(), "<<<<<<<<<<<<<<<<<<<<<<<")
            })

            this.records = dataFromDatabase; // 更新 records

        },
        getImageSource(record) {
            if (record.ShopName && record.friend) {
                // 如果同时存在 ShopName 和 friend，则返回 '@/assets/card.png'
                return require('@/assets/member.png');
            } else {
                // 否则返回 '@/assets/member.png'
                return require('@/assets/card.png');
            }
        },

        

    },
}
</script>

<style scoped>
@import url('../assets/top.css');


.backpagebox {

    border: none;
}

.imgbox {
    margin-top: 10px;
    width: 20%;
}

button.back {
    margin-bottom: 0px;
    margin-left: 5px;
    background-color: #715749;
    border: none;
    width: 10%;
    padding: 0%;
    align-items: end;
    margin-top: 10%;
}

img.backpic {
    width: 30px;
    height: 30px;
    /*max-width: 15px;  最大寬度設定為 300px */
    /*height: auto; 自動調整高度以保持比例 */
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 0%;
}

/* 垂直分隔線 */

.scrollbox {
    /* 確保元素可以垂直滾動 */
    overflow-y: auto;
    /* 設定固定高度 */
    height: 510px;
    /* 請根據需要調整高度 */

    padding-bottom: 100px;
    /* 給footer留足夠空間 */
    margin-left: 20px;
}

.recordlistbox {
    display: flex;
    flex-direction: row;
    border: 30px black;
    align-items: center;

    background-color: #d6c9b3;

}

.memberbox {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
}

.memberdata {
    display: flex;
    flex-direction: column;
    width: 40%;
    /*font-size: 22px;*/
    margin-left: 20px;
    margin-right: 10px;
}

.membername,
.storename {
    font-size: 22px;
    font-weight: bolder;
}

.memberid,
.storeid {
    font-size: 16px;
}

.pointbox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 30%;
}

img.pointpic {
    margin-right: 10px;
    margin-left: 10px;
    width: 25px;
    height: 25px;
}

img.memberpic {
    width: 60px;
    height: 55px;
    justify-content: center;
    align-items: center;
    display: flex;
}

span {
    color: aliceblue;
    font-size: 22px;
}
</style>