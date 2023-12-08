<template>
    <div class="back-button" @click="goBack">
        <img src="../assets/back-l.png" alt="返回鍵" class="back-icon">
    </div>
</template>
  
<script>
export default {
    name: 'BackComponent',
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
  
<style scoped>
.back-button {
    position: absolute;
    top: 50px;
    /*預留ipone瀏海位置*/
    left: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 999999;
}
</style>