<template>
    <div class="member-center">
        <div class="mem-header">
            <div class="avatar">
                <img :src="linePictureValue">
            </div>
            <div class="name">
                <p>{{ memberName }}</p>
            </div>
        </div>
        <div class="member-container">
            <div class="menu">
                <div class="menu-item">
                    <router-link to="/friendadd" class="link">
                        <i class="icon"><img src="../assets/addfriend.png" alt="好友列表"></i>
                        好友列表
                    </router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/memfav" class="link">
                        <i class="icon"><img src="../assets/heart.png" alt="我的最愛"></i>
                        我的最愛
                    </router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/memquestion" class="link">
                        <i class="icon"><img src="../assets/questions.png" alt="問題回報"></i>
                        問題回報
                    </router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/pointrecord" class="link">
                        <i class="icon"><img src="../assets/record.png" alt="點數紀錄"></i>
                        點數紀錄
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <FooterComponent />
</template>

<script>
import pencilIcon from '../assets/pencil.png';
import FooterComponent from './FooterComponent.vue';
import { db } from "../config/firebaseConfig";

export default {
    name: 'MemberCenter',
    components: {
        FooterComponent,
    },
    data() {
        return {
            memberName: '',
            pencilIcon: pencilIcon,
            linePictureValue: '',
        };
    },
    methods: {
        updateName() {
            // 獲取修改後的名字
            const newName = this.memberName;

            // 輸出修改後的名字
            console.log('新的姓名:', newName);

            // 在更新名字時同時調用 getPicture 方法
            this.getPicture();
        },
        async getPicture() {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const memberRef = db.collection('member');
                const userDoc = await memberRef.doc(userInfo.phone).get();

                if (userDoc.exists) {
                    // 使用 data() 方法獲取文檔的數據
                    const userData = userDoc.data();
                    
                    // 確保 linepicture 和 name 存在於文檔中
                    if (userData && userData.linepicture && userData.name) {
                        // 將 Firebase 中的值賦值給組件的數據
                        this.linePictureValue = userData.linepicture;
                        this.memberName = userData.name;

                        console.log('資料從 Firebase 中成功取得:', this.linePictureValue, this.memberName);
                    } else {
                        console.log('文檔中缺少 linepicture 或 name 屬性');
                    }
                } else {
                    console.log('用戶不存在');
                }
            } catch (error) {
                console.error("網頁出錯，請重新作業 ", error);
            }
        },
    },
    mounted() {
        // 在組件掛載時調用 getPicture 方法
        this.getPicture();
    },
};
</script>

<style scoped>
.member-center {
    text-align: center;
}

.mem-header {
    background-color: #f2f2f2;
    padding: 80px 20px 20px 20px;
    margin-bottom: 20px;
    background-color: #7157499c;
}

.avatar img {
    width: 130px;
    height: 130px;
    border: solid 1px white;
    border-radius: 50%;
}

.name {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
.name p {
    font-size: 20px;
    background-color: transparent;
    border: none;
    font-weight: bolder;
}

.center-container {
    display: flex;
    justify-content: center;
}

.menu {
    display: flex;
    flex-wrap: wrap;
}

.menu-item {
    width: calc(33.33% - 20px);
    margin: 10px;
    font-weight: bolder;
}

.menu-item img {
    width: 80px;
}

.link {
    text-decoration: none;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.icon {
    font-size: 25px;
    margin-bottom: 5px;
}
</style>