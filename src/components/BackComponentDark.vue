<template>
    <div class="back-button" @click="goBack">
        <img src="../assets/back-d.png" alt="返回鍵" class="back-icon">
    </div>
</template>
  
<script>
export default {
    name: 'BackComponentDark',
    props: {
        goBackAction: {
            type: Function,
            required: true,
        },
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>
  
<style>
.back-button {
    position: fixed;
    top: 50px;  /*預留ipone瀏海位置*/
    left: 10px;
    height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 999999;
}
</style>  