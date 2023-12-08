

<template>
  
    <footer class="footer">
      <div class="footer-icons">
        <div class="footer-icon">
          <router-link :to="'/PointExchange'"><img src="../assets/ShopPoint.png" alt="點數" /></router-link>
          <span>點數</span>
        </div>
        <div class="footer-icon">
          <router-link :to="'/StoreAchievement'"><img src="../assets/ShopStore.png" alt="主頁" /></router-link>
          <span>主頁</span>
        </div>
        <div class="footer-icon">
          <router-link :to="'/DistributionRecord'"><img src="../assets/history.png" alt="紀錄" /></router-link>
          <span>紀錄</span>
        </div>
      </div>
    </footer>
  </template>
  
  <style>
  .footer {
    background-color: #FAF0E4;
    color: black;
    padding: 5px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    flex: 1;
  }
  
  .footer-icons {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  
  .footer-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .footer-icon img {
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
  }
  template>footer {
    position: sticky;
    top: 100vh;
}
  </style>