<template>
    <div class="listbox">
        <div class="title2">選擇轉送對象</div>
        <div class="scrollbox">
            <div class="memberbox" v-for="friend in friends" :key="friend.id" :friend="friend">
                <div class="imgbox">
                    <img :src="memberImage" alt="">
                </div>

                <div class="memberdata">
                    <div class="membername">{{ name }}</div>
                    <div class="memberid">{{ phone }}</div>
                </div>
                <div class="butbox">
                    <button class="send" @click="showPopup">轉贈</button>
                </div>
            </div>

            <div v-if="showModal" class="modal">
                <!-- 第一次觸發的彈跳視窗 -->
                <div class="popup-content">
                    <div class="jump-memberdata">
                        <img :src="memberImage" alt="" class="jump-img">
                        <div class="jump-textbox">
                            <div class="jump-membername">{{ memberName }}</div>
                            <div class="jump-memberid">{{ memberId }}</div>
                        </div>
                    </div>
                    <!-- 點數快捷的按鈕 定義他的點擊動作是做讀值回傳到第二個彈跳視窗 -->
                    <div class="jump-but">
                        <div class="jump-butbox">
                            <div class="jump-butbox-up">
                                <form>
                                    <button class="point-button" @click="selectPoints(50)">50點</button>
                                    <button class="point-button" @click="selectPoints(100)">100點</button>
                                    <button class="point-button" @click="selectPoints(500)">500點</button>
                                </form>
                            </div>
                            <!-- 輸入點數地方 -->
                            <div class="jump-butbox-down">
                                <input type="number" v-model="customPoints" placeholder="輸入點數">
                                <!-- 確認 -->
                                <form @submit.prevent>
                                    <button class="correct-button" @click="confirmPoints">確認</button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- 第二個彈跳視窗 -->
            <div v-if="showSecondModal" class="modal">
                <div class="popup-content">

                    <div>
                        <!-- 視窗裡面内容 -->
                        <div class="second-popup-content">

                            <div class="SecondModal-memberdata">
                                <div class="SecondModal-memberdata-up">
                                    <img :src="memberImage" alt="" class="jump-img">
                                    <div class="SecondModal-textbox">
                                        <div class="SecondModal-membername">{{ memberName }}</div>
                                        <div class="SecondModal-memberid">{{ memberId }}</div>
                                    </div>

                                </div>

                                <div class="SecondModal-memberdata-down">
                                    <div class="message">是否確認轉贈店家 <br>{{ shopName }}

                                        <template v-if="selectedPoints">
                                            {{ selectedPoints }}點數
                                        </template>
                                        <template v-else-if="customPoints">
                                            {{ customPoints }}點數
                                        </template>
                                        <template v-else>
                                            <!-- 默認內容 就是如果沒有輸入或是點擊任何快捷鍵則默認為0點 -->
                                            0 點數
                                        </template>

                                    </div>
                                </div>

                            </div>

                        </div>
                        <form @submit.prevent>
                            <button class="confirm-button" @click="confirmSecondModal">確認</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {


            memberImage: require('@/assets/member.png'),
            memberName: '', // 之後讀資料庫資料
            memberId: '', // 之後讀資料庫資料
            showModal: false, // 設定第一個彈跳視窗的初設值
            showSecondModal: false, // 設定第二個彈跳視窗的初設值
            shopName: '某個店家', // 之後讀資料庫資料
            pointImage: require('@/assets/point.png'),
            selectedPoints: 0, // 快捷鍵所選的點數
            customPoints: '', // 自己輸入的
            selectedPointsClicked: false,


            friends: [],

        };
    },

    created() {
        //從db讀資料 整個職組要包含id跟姓名
        //把獨到的值賦值給下面的函數 含在在做初值跟後續動作判斷 然後呈現

        this.friends = [
            { id: 1, name: '好友1' },
            { id: 2, name: '好友2' },
            { id: 3, name: '好友3' },
            { id: 4, name: '好友4' },
            { id: 5, name: '好友5' },
            { id: 6, name: '好友6' },
            { id: 7, name: '好友7' },
            { id: 8, name: '好友8' },
            { id: 9, name: '好友9' },
            { id: 10, name: '好友10' },
            { id: 11, name: '好友11' },
            { id: 12, name: '好友12' },
            //this.fetchFriends(); // 獲取好友列表的資料

            // ...其他好友数据
        ]
    },


    methods: {

        showPopup() {
            this.showModal = true;
        },
        selectPoints(points) {
            //showSecondModal: false, 
            this.selectedPoints = points;
            this.showSecondModal = true; // 觸發事件
            this.showModal = false;

        },
        confirmPoints() {
            // 確認邏輯
            // 驗證輸入內容 還有跟資料庫的內容比較
            // 通過才進行後續動作的觸發條件
            console.log('選擇的點數:', this.selectedPoints);
            console.log('自行輸入的點數:', this.customPoints);

            // 因為有快捷鍵跟自己輸入兩種輸入資料的方式 因此寫條件式做判斷為何種做法
            if (this.selectedPoints) {  //快捷鍵
                this.shopName = '某個店家'; // 店家名最後讀資料庫內容
                this.selectedPointsClicked = true;
            } else if (this.customPoints) {  //自己輸入
                this.shopName = '某個店家'; // 店家名最後讀資料庫內容
                this.selectedPointsClicked = true;
            }

            console.log('確認第二個的彈跳視窗');
            this.showSecondModal = true; // 改變原第二個彈跳視窗設定的值 即觸發
            // 隐藏
            //this.showModal = false;
        },
        confirmSecondModal() {

            console.log('选择的点数:', this.selectedPoints);
            console.log('自定义输入的点数:', this.customPoints);
            console.log('确认第二个弹跳视窗');
            this.showSecondModal = false; // 回復原初值之設定(關))
            this.showModal = false;
        },
    },
};
</script>

<style scoped>
.scrollbox {
    /* 確保元素可以垂直滾動 */
    overflow-y: auto;
    /* 設定固定高度 */
    height: 530px;
    /* 請根據需要調整高度 */
}

.listbox {
    background-color: #d6c9b3;
}

.title2 {
    font-size: 24px;
    padding: 10px 0px 0px 5px;
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
    width: 50%;
    /*font-size: 22px;*/
    margin-left: 5px;
    margin-right: 5px;
    justify-content: center;
}

.membername {
    font-size: 22px;
    font-weight: bolder;
}

.memberid {
    font-size: 16px;
}

.imgbox {
    width: 20%;
    text-align: center;
}

img {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    padding-bottom: 10px;
    padding-top: 10px;
    ;
}

.butbox {
    width: 30%;
    text-align: center;
    margin: 5px;
    justify-content: center;
    display: flex;
    align-items: center;

}

button.send {
    color: #fff;
    border: none;
    border-radius: 15px;
    background-color: orange;
    width: 80%;
    margin: 0 auto;
    height: 90%;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0px;
    padding-bottom: 0px;

}


.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明的背景色 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background-color: white;
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-left: 10px;
    margin-right: 10px;
    width: 100%;
}

.jump-memberdata {
    display: flex;
    flex-direction: row;
    margin: 10px;
    width: 90%;
}

.jump-img {
    width: 30%;
    max-width: 40px;
    height: auto;
    margin: 5px;
    padding: 5px;
}

.jump-textbox {
    width: 60%;
    display: flex;
    flex-direction: column;
    margin-left: 5px;
}

.jump-membername {
    font-weight: bold;
    margin-top: 10px;
    width: 90%;
    display: flex;
    align-items: left;
    font-size: 22px;
}

.jump-memberid {
    width: 100%;
    display: flex;
    align-items: left;
    font-size: 20px;
}

.jump-but {
    margin: 10px;
    width: 90%;
    display: flex;
    flex-direction: column;
}

.jump-butbox-up {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    margin-bottom: 5px;
}

.jump-butbox-down {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    margin-bottom: 5px;
}

.jump-butbox {
    width: 90%;
    margin-left: 20%;

}

.popup-content .point-button {
    margin-right: 10px;
}

.popup-content input {
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 24px;
    width: 60%;
    margin-top: 5px;
    margin-right: 5px;
}

.popup-content button {
    padding: 10px 15px;
    border-radius: 10px;
    border: none;
    background-color: #d6c9b3;
    margin-left: 5px;
    font-size: 18px;
    margin-top: 5px;
    ;
}

button.correct-button {
    padding: 5px 10px;
    border-radius: 15px;
    border: none;
    background-color: red;
    margin-left: 5px;
    margin-right: 10px;
    font-size: 22px;
    color: #fff;
    width: 100%;
}

.SecondModal-memberdata {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
}

.SecondModal-memberdata-up {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: center;
    font-size: 20px;
    margin-left: 5px;
    margin-right: 5px;
    /*justify-content: center;*/
    align-items: center;
}

.SecondModal-memberdata-down {
    width: 100%;
}

.message {
    text-align: center;
    font-size: 24px;
}

.SecondModal-memberid {
    margin-right: 5px;
    margin-left: 5px;
    display: flex;
}

.SecondModal-membername {
    margin-right: 8px;
    margin-left: 5px;
    display: flex;
}

.SecondModal-textbox {
    display: flex;
    flex-direction: column;
}

button.confirm-button {
    padding: 5px 10px;
    border-radius: 15px;
    border: none;
    background-color: red;
    margin: auto;
    font-size: 22px;
    color: #fff;
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
}

form {
    text-align: center;
    display: flex;
    flex-direction: row;
}

button.point-button {
    width: 45%;
    padding: 5px;
}
</style>
