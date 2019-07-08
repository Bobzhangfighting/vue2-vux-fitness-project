<template>
  <div class="memberHome" style="height: 100%;touch-action: none;">
   <view-box ref="viewbox" body-padding-top="46px" body-padding-bottom="50px">
     <div class="vux-demo-header-box" slot="header">
        <x-header :left-options="{backText: ''}" v-show="headShow" class="header">{{pageTitle}}</x-header>
     </div>
     <div v-transfer-dom class="loading-box">
        <loading :show="loading" position="absolute"></loading>
    </div>
        <router-view :childHeight="childHeight"></router-view>
     <tabbar v-show="footerShow">
      <tabbar-item selected link="/memberHome/completeflow?status=completed">
        <img slot="icon" src="../assets/images/icons/news_icon.png">
        <span slot="label">已办流程</span>
      </tabbar-item>
      <tabbar-item link="/memberHome/mine">
        <img  slot="icon" src="../assets/images/icons/mine_icon.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
    </view-box>
  </div>
</template>

<script>
  import { Tabbar,Icon,TabbarItem ,XHeader,Loading,ViewBox} from 'vux'
  import { TransferDomDirective as TransferDom } from 'vux'
  import {mapGetters} from 'vuex'
  export default {
    computed:mapGetters([
      'headShow',
      'loading',
      'footerShow',
      'pageTitle'
    ]),
    data(){
      let data={
        childHeight:(document.body.clientHeight-46-50)
      }
      return data
    },
    watch:{
      // 'screenHeight':function(val){
      //   var oIframe = document.getElementById();
      //   oIframe.style.height = 
      // }
    },
    mounted() {
      // this.childHeight = (document.body.clientHeight -46-50);
      // this.calculationViewPort();
      //  console.log(this.clientHeight);
    },
    methods:{
       calculationViewPort(){
         console.log("屏幕宽"+document.body.clientWidth);
         console.log("屏幕高"+document.body.clientHeight);
        console.log("主体内容高度"+(document.body.clientHeight -46-50));
        
       
       }
    },
    directives: {
        TransferDom
      },
    components: {
      Tabbar,
      TabbarItem,
      XHeader,
      Loading,
      ViewBox,
      Icon
    }
  }
</script>
<style>

.memberHome .vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

.memberHome .weui-tabbar__icon img{
      width: auto;
      height: 90%;
}

 .memberHome .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
    color: #DD5858
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
</style>

