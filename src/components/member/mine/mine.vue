<template>
  <div clas="mine" ref="mine">
    <swiper :list="arr" :show-dots="true" :auto="true" :loop="true"></swiper>
    <div id="mine_main" :style="{height:mainHeight}">
      <grid :clos="2">
            <grid-item link="/memberHome/completeflow?status=completed" :style="griditemHeight">
              <div class="center">
                  <img width="64px" height="64px" src="../../../assets/images/finshedflow.png">    
              </div>
              <p style="text-align:center">已办流程({{completeCount}})</p>
            </grid-item>
            <grid-item link="/memberHome/flowlaunch" :style="griditemHeight">
            <div class="center">
              <img width="64px" height="64px" src="../../../assets/images/flowread.png">
            </div>
              <p style="text-align:center">我的发起({{mineFlowUp}})</p>
            </grid-item>
      </grid>
      <grid :clos="2">
            <grid-item link="/memberHome/approvalList" :style="griditemHeight">
            <div class="center">
              <img width="64px" height="64px" src="../../../assets/images/myfinshflow.png">
            </div>
              <p style="text-align:center">我的审批({{mineFinsh}})</p>
            </grid-item>
            <grid-item link="/memberHome/completeflow?status=running" :style="griditemHeight">
            <div class="center">
              <img width="64px" height="64px" src="../../../assets/images/flowrun.png">
              </div>
              <p style="text-align:center">我的在办({{runningCount}})</p>
            </grid-item>
        </grid>
      </div>
        <!--错误提示弹窗-->
        <toast v-model="showPositionValue" type="text"  is-show-mask :text="toastText" :position="position"></toast>
      </div>
</template>
<script>
  import { Tabbar,Icon,TabbarItem ,XHeader,Loading,ViewBox, Grid, GridItem,Swiper,Divider,Toast  } from 'vux' 
  import api from '@/assets/js/api.js'
  export default {
    props:['childHeight'],
    data(){
      return {
        message:'',
        name:'',
        showPositionValue: false, //是否显示提示
        position: 'middle', //提示信息的位置
        toastText: '接口出错系统异常！', // 提示文本
        flowStatus:true,//已办流程标识
        flag:true,
        completeCount:'0',//已办流程
        mineFlowUp:0,//我的发起
        mineFinsh:'0',//我的已办
        runningCount:'0',//我的在办
        mainHeight:(this.childHeight-180)+'px',
        griditemHeight:{
          height:((this.childHeight-180)/2)+'px'
        },
        arr:[{
            url: 'javascript:',
            img: 'https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=a62e824376d98d1069d40a31113eb807/838ba61ea8d3fd1fc9c7b6853a4e251f94ca5f46.jpg',
            title: '送你一朵fua'
          }, {
            url: 'javascript:',
            img: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=a9e671b9a551f3dedcb2bf64a4eff0ec/4610b912c8fcc3cef70d70409845d688d53f20f7.jpg',
            title: '送你一次旅行',
          },{
            url: 'javascript:',
            img: 'https://ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=92afee66fd36afc3110c39658318eb85/908fa0ec08fa513db777cf78376d55fbb3fbd9b3.jpg',
            title: '送你一次旅行',
          }
          ]
      }
    },
    mounted() {
      this.$store.commit('UPDATE_PAGE_TITLE', '首页');
      this.loadCompletedFlowDetail();
      this.loadRunningFlowDetail();
      this.getFlowUp();
      this.myApplyCheck();
      this.getCurrentUser();
      this.$refs.mine.style.height = this.childHeight+'px';   //设置主体内容的高度
    },
    methods: {
        async loadCompletedFlowDetail(){//已办流程
            let self = this;
            var params = {};
            params.state = "completed";
            params.pageNo = 0;
            params.sort = "created-desc";
            params.pageSize="10";
            let result = await api.finshedOrunfinshedList(params).then(res=>{
                var resObject = res.data;
                if(resObject !=null && resObject.data.length>0){
                  var total = resObject.total;
                  self.completeCount = total;
                  var completeFlowList = resObject.data;
                  self.common.localSet(completeFlowList,"completeFlowList");//存储当前用户已办流程
                }
            });
      },
      async loadRunningFlowDetail(){//在办流程
        let self = this;
        var params = {};
        params.state = "running";
        params.pageNo = 0;
        params.sort = "created-desc";
        params.pageSize="10";
        let result = await api.finshedOrunfinshedList(params).then(res=>{
                var resObject = res.data;
                if(resObject!=null && resObject.data.length >0){
                  var total = resObject.total;
                  self.runningCount = total;
                  var runningFlowList = resObject.data;
                  self.common.localSet(runningFlowList,"runningFlowList");//存储当前用户在办流程
                }else{
                  self.showPositionValue = true;
                }
        });
      },
      //获取当前登录者
      async getCurrentUser(){
        let _self = this;
        let params = {};
        let result = await api.getCurrentUser(params).then(res=>{
            console.log(res.data);
        });
      },
      //我的发起
      async getFlowUp(){
            let _this = this;
            let params ={};
            let result = await api.getUpFlow(params).then(res=>{
                if(res.data!=null && res.data.length > 0 ){
                    var resObject = res.data;
                    for(let i=0;i<resObject.length;i++){//发起流程统计
                      var labelList = resObject[i].labelList;
                      _this.mineFlowUp += labelList.length;
                    }
                  }
            });
      },
      //我的审批
      async myApplyCheck(){
          let _this = this;
          let params = {};
          params.pageNo =0;
          params.pageSize =20;
          let result = await api.getApprovalFlowList(params).then(res=>{
              let resObject = res.data;
              if(resObject!=null && resObject.list.length >0){
                _this.mineFinsh =resObject.list.length;
              }
          });
      }
    },

    components: {
      Tabbar,
      TabbarItem,
      XHeader,
      Loading,
      ViewBox,
      Icon,
      Grid,
      GridItem,
      Swiper,
      Divider,
      Toast  
    }
  }
</script>
<style scoped >
.center{
  text-align:center;
  padding:30px 0;
}
.mine{
  margin-top:46px;
}

</style>
