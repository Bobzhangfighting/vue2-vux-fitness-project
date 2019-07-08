<template>
  <div class="app" style="height:100%;">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      

    }
  },created(){
    const root = process.env.API_ROOT;
    console.log("root------>"+root);
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}

</style>
