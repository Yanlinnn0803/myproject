<template>
  <div class="line-login">
    <button class="medium_button btn_p08_user_loginType" id="lineLoginBtn" @click="openLineLogin">
      <img src="../assets/btn_login_base.png">
    </button>
  </div>
</template>

<script setup>
// 使用者點擊登入按鈕觸發
  function openLineLogin() {
    // 根據指定的 client_id、redirect_uri、scope 等參數組合出一個 LINE 登入的連結
    let link = `https://access.line.me/oauth2/v2.1/authorize?`;
    link += `response_type=code`;
    link += `&client_id=2000105661`;  // yourClient_id 請設置為實際Channel ID 值
    link += `&redirect_uri=https://gt-db-b8189.web.app/IndexLogin/`; // yourURI 請設置為實際Line developer 設定的重新導向網址
    link += `&state=login`;
    link += `&scope=openid%20profile`;
    // 將頁面重新導向到該連結
    window.location.href = link;
  }
</script>

<style>
  button {
    background-color: transparent;
    border: none;
    outline: none; /* 避免點擊時出現默認的外框 */
  }

  .line-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 設定高度為視窗的100% */
  }
</style>