<script>
//import { RouterLink, RouterView } from 'vue-router'

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

</script>

<template>
  <div class="header">
    <BackComponent />
    <div class="title">問題回報</div>
  </div>


  <!--<div id="top">
    <img src="../assets/arrow-left-solid.svg" class="arrow">
    <h1 class="title">回報問題</h1>
  </div>-->
  <div class="content-container">
    <div>
      <h2 style="text-align: center;">常見問題</h2>
      <div class="accordion">
        <div v-for="item in items" :key="item.id" class="accordion-item" @click="toggleAccordion(item.id)">
          <div class="accordion-header">{{ item.question }}</div>
          <div v-if="item.open" class="accordion-content" :ref="item.id">{{ item.answer }}</div>
        </div>
      </div>
    </div>
    <div>

      <div class="contact-form">
        <h2 style="text-align: center;">聯絡我們</h2>
        <div class="form-group">
          <label for="name">您的姓名：</label>
          <input type="text" id="name" v-model="name" required>
        </div>
        <div class="form-group">
          <label for="email">聯絡信箱：</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="message">問題要述：</label>
          <textarea id="message" v-model="message" required></textarea>
        </div>
        <button type="submit" @click="submitForm">送出</button>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script setup>
import BackComponent from '../components/BackComponent.vue';
import FooterComponent from './FooterComponent.vue';
import { db } from "../config/firebaseConfig";
import { ref } from 'vue';
import { nextTick } from 'vue';

const items = ref([
  { id: 1, question: '收到的推送通知不準確或遲到', answer: '請檢查手機應用程式的通知設置，確保已啟用並允許接收推送通知。同時，請檢查網絡連接，並確保手機處於正常的網絡狀態。', open: false },
  { id: 2, question: '怎麼加入好友？', answer: '請在會員中心點選好友列表，並在搜尋欄輸入您朋友的電話號碼，即可完成加入好友。', open: false },
  { id: 3, question: '有客服人員可以詢問嗎？', answer: '當然有！請填寫下方表格，並說明您的需求，集集復集集將會有客服人員為您服務！請注意電子郵件訊息～', open: false },
]);

const name = ref('');
const email = ref('');
const message = ref('');

const toggleAccordion = (itemId) => {
  items.value.forEach(item => {
    if (item.id === itemId) {
      item.open = !item.open;
    } else {
      item.open = false;
    }
  });
  nextTick(() => {
    items.value.forEach(item => {
      const content = this.$refs[item.id];
      item.contentHeight = item.open ? `${content.scrollHeight}px` : '0';
    });
  });
};

const submitForm = async () => {
  if (!name.value || !email.value || !message.value) {
    window.alert("請填寫所有欄位！");
    return;
  }
  try {
    const QuestionRef = db.collection("Question");
    const existingDoc = await QuestionRef.doc().get();
    if (existingDoc.exists) {
      await QuestionRef.doc().set({
        name: name.value,
        email: email.value,
        message: message.value
      }, { merge: true });
    } else {
      await QuestionRef.doc().set({
        name: name.value,
        email: email.value,
        message: message.value
      });
    }
    window.alert("回報成功！謝謝您");
    location.reload();
  } catch (error) {
    window.alert("填寫失敗，請在填一次");
    location.reload();
    console.error("網頁出錯，請重新作業 ", error);
  }
};
</script>
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css";
@import url('../assets/top.css');

.content-container {
  padding-bottom: 100px;
  /* 給footer留足夠空間 */
}

.accordion {
  width: 80%;
  margin: 0 10%;
}

.accordion-item {
  border: 1px solid #ccc;
  margin-bottom: 2px;
}

.accordion-header {
  background-color: #f0f0f0;
  padding: 15px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 20px;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

.accordion-content {
  background-color: #ffffff;
  border-radius: 15px;
  border: 1px solid #cccccc;
  padding: 5%;
  overflow: hidden;
  transition: max-height 0.3s ease;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

.contact-form {
  width: 80%;
  margin: 5% auto;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 20px;
}

.form-group {
  margin-bottom: 20px;
  margin-left: 3%;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group textarea {
  resize: vertical;
  /* 可以垂直調整文本框的大小 */
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  /* 讓按鈕佔據一整行 */
  margin: 0 auto;
  /* 水平置中 */
}

</style>