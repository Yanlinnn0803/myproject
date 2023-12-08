<template>
    <div class="search-bar">
        <div class="search-container">
            <button class="back" @click="goBack">
                <img src="../assets/back-l.png" alt="" class="backpic">
            </button>
            <input type="text" v-model="searchTerm" placeholder="搜尋店家" @input="search">
            <button class="searchbut">
                <img src="../assets/search-l.png" alt="放大鏡img" class="searchimg">
            </button>

        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '', // 搜索关键字数据属性
    };
  },
  methods: {
    search() {
      // 触发搜索事件并传递搜索关键字给父组件
      this.$emit("search", this.searchTerm);
    },
    submitSearch() {
      this.search();
    }
  }
}
</script>

<style scoped>
/* 更新的樣式 */
.search-bar {
    display: flex;
    justify-content: center;
    background-color: #715749;
    border: none;
    padding-top: 10%;
}

.search-container {
    display: flex;
    align-items: center;
    /*border: 1px solid #ccc;*/
    border-radius: 5px;
    width: 100%;
    /* 根據需要調整搜索框的寬度 */
}

.search-container input[type="text"] {
    padding: 8px;
    border: none;
    outline: none;
    font-size: 16px;
    border-radius: 10px;
    height: 28px;
    /*margin-left: 10px;*/
    flex: 2;
}

.search-container i {
    padding: 8px;
    background-color: #f1f1f1;
    color: #aaa;
    cursor: pointer;
}

button {
    border: none;
    background-color: transparent;
}

.searchimg {
    width: 30px;
    height: 30px;
}

.backpic {
    margin: 5px auto;
}
</style>