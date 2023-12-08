<template>
    <div class="backpagebox">
        <div class="header2">
            <BackComponent />
            <div class="title2">
                加入好友
            </div>
        </div>

        <div class="phoneaddbox">
            <div class="addtext">請輸入用戶電話</div>
            <div class="phonenumberbox">
            <input type="text" id="phone" v-model="phone" />
    
            <form @submit.prevent>
                <button class="add-button" @click="validateAndAddFriend">確認</button>
            </form>
    
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                <p v-if="showInputError">您沒有輸入電話號碼</p>
                <p v-if="showFormatError">您輸入的電話號碼不正確</p>
                <p v-if="showNoResult">沒有此用戶</p>
                <button @click="closeerrorModal">關閉</button>
                </div>
            </div>
            </div>
        </div>
    
        <div class="spacebox"></div>
    
        <div class="myselfbox">
            <div class="myselfdatabox">
                <div class="imgbox">
                    <img :src="memberImage" alt="" />
                </div>
        
                <div class="userdata">
                    <div class="username">{{ username }}</div>
                    <div class="userid">{{ userId }}</div>
                </div>
            </div>
    
            <div class="listtitle">好友列表</div>
            <div class="scrollbox">
                <div class="friendlistbox" v-for="friend in friendList" :key="friend.id">
                    <div class="imgbox">
                        <img :src="memberImage" alt="" class="friendimg" />
                    </div>
        
                    <div class="memberdata">
                        <div class="membername">{{ friend.name }}</div>
                            <!-- 假設 friend 有 id 屬性 -->
                        <div class="memberid">{{ friend.id }}</div>
                    </div>
                </div>
            </div>
    
            <div v-if="showSearchResult" class="modal">
                <div class="modal-content">
                    <p>搜尋結果</p>
                    <p>用戶名：{{ memberName }}</p>
                    <p>電話號碼：{{ memberId }}</p>
                    <button @click="addToFriends">
                        確認加入好友
                    </button>
                </div>
            </div>
    
            <FooterComponent />
        </div>
    </div>
</template>
  
<script>
    import BackComponent from '../components/BackComponent.vue';
    import FooterComponent from './FooterComponent.vue';
    import { db } from "../config/firebaseConfig";
    
    export default {
        data() {
            return {
                memberImage: require("../assets/member.png"),
                back: require("../assets/back-l.png"),
                username: " ",
                userId: " ",
                memberName: "王大頭",
                memberId: "QWER-1234",
                addModal: false,
                phone: "",
                showInputError: false,
                showFormatError: false,
                showModal: false,
                showNoResult: false,
                showSearchResult: false, // 添加这个
                friend:"",
                friendList: [],
                memberRef: db.collection("member"),
                userPhone:" ",
            };    
        },
        created() {
                // 在组件创建时尝试从localStorage中获取当前用户数据
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                if (userInfo) {
                this.username = userInfo.name;
                this.userId = userInfo.phone;
                this.userPhone = userInfo.phone;
                this.getFriendsList(this.userPhone); 
                }
                console.log(userInfo)
                
            },

        methods: {
            async getFriendsList(userPhone) {
                // 使用 userPhone 查询当前用户的 friends 子集合
                const friendsCollectionRef = db.collection("member").doc(userPhone).collection("friends");
                console.log(friendsCollectionRef)
                // 获取所有好友文档的快照
                const friendsSnapshot = await friendsCollectionRef.get();
                console.log(friendsSnapshot)
                // 将好友的数据添加到 friendsList 数组
                friendsSnapshot.forEach((friendDoc) => {
                    const friendData = friendDoc.data();
                    console.log(friendData)
                    this.friendList.push({
                        id: friendData.id ,
                        name:friendData.name
                    });
                    
                });
                },

        async validateAndAddFriend() {
            if (this.phone.trim() === "") {
            this.showInputError = true;
            this.showFormatError = false;
            this.showNoResult = false;
            this.showModal = true;
            return;
            }
    
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(this.phone)) {
            this.showInputError = false;
            this.showFormatError = true;
            this.showNoResult = false;
            this.showModal = true;
            return;
            }
    
            try {
            const memberRef = db.collection("member");
            const querySnapshot = await memberRef.where("phone", "==", this.phone).get();
    
            if (querySnapshot.empty) {
                this.showNoResult = true;
                this.showInputError = false;
                this.showFormatError = false;
                this.showModal = true;
            } else {
                const memberData = querySnapshot.docs[0].data();
                this.memberName = memberData.name;
                this.memberId = memberData.phone;

                // 设置一个标志来表示搜索成功
                    this.showSearchResult = true;
                    this.showInputError = false;
                    this.showFormatError = false;
                    this.showNoResult = false;
                this.addFriend(); // 加好友
                
            }
            } catch (error) {
            console.error("查詢資料庫出錯：", error);
            }
        },
    
        addFriend() {
            this.addModal = true;
        },
        
        addToFriends() {
                // 创建一个包含要添加的好友信息的对象
                const friendToAdd = {
                id: this.memberId, // 用户的 ID
                name: this.memberName, // 用户的姓名
                // 其他用户信息
                };
                console.log(friendToAdd)

                // 获取当前用户的电话号码
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const currentUserPhone = userInfo.phone;

                // 获取当前用户的文档引用
                //const currentUserDocRef = memberRef.doc(currentUserPhone);
                const currentUserDocRef = this.memberRef.doc(currentUserPhone);


                // 将好友信息添加到当前用户的 friends 子集合
                currentUserDocRef.collection("friends").add(friendToAdd)
                .then(() => {
                    console.log("已成功添加好友到目前的用户的 friends 子集合");
                    this.showSearchResult = false;
                    //this.$router.go(-1); // 这将返回上一页
                })
                
                .catch(error => {
                    console.error("添加好友时出错：", error);
                });
                location.reload();
            },

        resetErrors() {
            this.showInputError = false;
            this.showFormatError = false;
        },
    
        closeerrorModal() {
            this.showModal = false;
        },
    
        closeModal() {
            console.log("關閉談窗");
            this.addModal = false;
        },
    
        close() {
            this.addModal = false;
        },
    
        goBack() {
            this.$router.go(-1);
        },
        },
    
        components: {
        BackComponent,
        FooterComponent,
        },
    };
</script>

<style scoped>
.backpagebox {
    background-color: #715749;
    border: none;
}
.header2 {
    width: 100%;
    height: 110px;
    background-color: #715749;
}

.title2 {
    padding-top: 60px;
    font-size: 30px;
    font-weight: bold;
    color: white;
    text-align: center;
}


/*.titlebox {
    background-color: #715749;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    display: flex;

}

.title {
    padding-top: 10px;
    width: 90%;
    color: aliceblue;
    font-size: 24px;
    align-items: end;
    display: flex;
    justify-content: center;
    margin-right: 30px;
    padding-bottom: 10px;
    margin-top: 10%;

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
    ;
}

img.backpic {
    width: 30px;
    height: 30px;
    /*max-width: 15px;  最大寬度設定為 300px */
/*height: auto; 自動調整高度以保持比例 */
/*margin-left: 5px;
    margin-right: 5px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 0%;
}*/

img.jump-img {
    width: 55px;
    height: 55px;
    /*max-width: 15px;  最大寬度設定為 300px */
    /*height: auto; 自動調整高度以保持比例 */
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 0%;


}

.phoneaddbox {
    background-color: #d6c9b3;
    margin-bottom: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.addtext {
    font-size: 18px;
    margin-left: 10px;
    margin-top: 10px;
}

.phonenumberbox {
    display: flex;
    flex-direction: row;
    margin: 10px;
}

input#phone {
    width: 75%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    margin-right: 10px;
}

button.add-button {
    padding: 5px 10px;
    border-radius: 15px;
    border: none;
    background-color: red;

    font-size: 22px;
    color: #fff;
    width: 100%;
}

form {
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    /* 水平置中 */
}

.spacebox {
    padding: 10px;
}

.myselfbox {
    font-size: 24px;
    background-color: #d6c9b3;
    border: none;
}

.myselfdatabox {
    display: flex;
    flex-direction: row;
    padding-top: 5px;
    padding-bottom: 0px;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.userdata {
    display: flex;
    flex-direction: column;

    margin-left: 5%;
    margin-right: 5%;


}

.listtitle {
    margin-left: 15px;
    font-size: 24px;
}

.scrollbox {
    /* 確保元素可以垂直滾動 */
    overflow-y: auto;
    /* 設定固定高度 */
    height: 420px;
    /* 請根據需要調整高度 */
}

.friendlistbox {
    display: flex;
    flex-direction: row;
    border: 30px black;
    align-items: center;
    margin: 10px;

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
    font-size: 22px;
    margin-left: 20px;
    margin-right: 10px;
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
    justify-content: center;
    align-items: center;
    font-size: 22px;
    margin-bottom: 10px;
}

button.ok-button {
    padding: 5px 10px;
    border-radius: 15px;
    border: none;
    background-color: red;
    margin: 0 auto;
    font-size: 22px;
    color: #fff;
    width: 20%;
}

.okbutbox {
    display: flex;
    justify-content: center;
    align-items: center;
}

img.closeimg {
    width: 25px;
    height: 25px;
    padding: 5px;
    margin: 0%;
}

button.none-button {
    background-color: white;
    border: none;
    display: flex;
    justify-content: right;
    padding: 0%;
    margin: 0%;
}

.nonebutbox {
    justify-content: right;
    display: flex;
    width: 95%;
}

/*下面都是錯誤號碼的彈跳視窗*/

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    font-size: 20px;
    border-radius: 20px;
}

.modal-content p {
    margin-bottom: 10px;
}

.modal-content button {
    background-color: lightgray;
    color: black;
    border: none;
    padding: 10px 20px;
    text-align: center;
    display: block;
    margin: 10px auto;
}
</style>