<template>
    <div class="back">
        <div class="up"></div>
        <div class="down">
            <div class="store-title-box">
                <div class="store-title">
                    <div class="store-id">{{ storeId }}</div>
                    <div class="storename">{{ storeName }}</div>
                </div>
            </div>
                
            <div class="storebox">
                    
                <div class="text">總計</div>
                <div class="imgbox">
                    <img :src="pointImage" alt="">
                </div>
                
                <div class="point"> {{ points }}</div>
            </div>
        </div>
        <!--<div class="title">選擇轉送對象</div>-->
    </div>
</template>

<script>
    export default {
        name: 'FriendSend',
        data() {
        return {
            pointImage: require('@/assets/point.png'),
            storeId: '0000 - 0001',
            storeName: '黑鬍子牛排',
            points: 150,
        };
        },
    };
</script>

<style scoped>
.back{
    display: block;
}
.down{
    background-color:#715749;
    display: flex;
    width: 100%;
    color:aliceblue;
    margin-top: 45px;
}
.store-title{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.store-title-box{
    width: 60%;
    /*font-size: 28px;*/
    margin-left: 10px;
}
.storename{
    font-size: 24px;
    font-weight: bolder;
}
.store-id{
    font-size: 14px;
}
.storebox{
    display: flex;
    justify-content: left; /* 水平居中 */
    
}
img{
    width: 25px;
    height: 25px;
    /*max-width: 15px;  最大寬度設定為 300px */
     /*height: auto; 自動調整高度以保持比例 */
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 2px; 
    margin-bottom: 2px;
    padding-bottom:0px;
}

.imgbox{
    display: flex;
    justify-content: center; /* 水平方向居中 */
    align-items: flex-end;
}
.storebox{
    display: flex;
    flex-direction: row;
    width: 40%;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 2px;
}
.title{
    font-size: 24px;
    margin: 10px;
}
.text{
    font-size: 22px;
    margin-left: 5px;
    margin-right: 5px;
}
.point{
    font-size: 22px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 2px; 
    margin-bottom: 2px;
}

</style>