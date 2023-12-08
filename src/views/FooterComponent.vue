<template>
    <footer class="footer">
        <ul class="nav-list">
            <li>
                <router-link to="/store" class="nav-link">
                    <div class="icon">
                        <img src="../assets/store.png" alt="商店icon" id="i1">
                    </div>
                    <span>商店</span>
                </router-link>
            </li>
            <li>
                <router-link to="/card" class="nav-link">
                    <div class="icon">
                        <img src="../assets/card.png" alt="集點卡icon" id="i2">
                    </div>
                    <span>集點卡</span>
                </router-link>
            </li>
            <li>
                <router-link to="/IndexLocation" class="nav-link">
                    <div class="icon">
                        <img src="../assets/location.png" alt="首頁icon" id="i3">
                    </div>
                    <span>首頁</span>
                </router-link>
            </li>
            <li>
                <router-link to="/point" class="nav-link">
                    <div class="icon">
                        <img src="../assets/point.png" alt="點數轉贈icon" id="i4">
                    </div>
                    <span>點數轉贈</span>
                </router-link>
            </li>
            <li>
                <router-link to="/member" class="nav-link">
                    <div class="icon">
                        <img src="../assets/member.png" alt="會員中心icon" id="i5">
                    </div>
                    <span>會員中心</span>
                </router-link>
            </li>
        </ul>
    </footer>
</template>
    
<style scoped>
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #715749;
    /*padding: 10px;*/
    padding-bottom: 10px;
    padding-top: 5px;
    /*新增*/
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100%);
}

.nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-list li {
    display: flex;
    align-items: center;
    margin-right: 35px;
}

.nav-list li:last-child {
    margin-right: 0;
}

.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

#i1,
#i2,
#i3,
#i4,
#i5 {
    width: 40px;

    /*新增*/
    padding-top: 10px;
    padding-bottom: 10px;
}

.nav-link {
    text-decoration: none;
    color: inherit;
    text-align: center;
}

.nav-link:hover {
    text-decoration: none;
    color: inherit;
}

span {
    color: white;
    font-size: 12px;
    white-space: nowrap;
}
</style>  