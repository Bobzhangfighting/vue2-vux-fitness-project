<template>
    <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
              lock-x ref="scrollerBottom"  height="-46" v-model="status">
    <div>    
        <flexbox v-for="(item,index) in  showDataAllFlowList" :key="index">
            <flexbox-item class="flexboxItem border-b">
               <div>
                    <strong>{{index+1}}</strong>
                    <strong>流程名称：{{item.name}}</strong>
                    <span style="float:right" class="completeStatus">待审批</span>
                </div>
                <div>
                    <span>流程描述：{{item.processDefinitionName}}</span>
                    <x-icon style="float:right;" type="ios-arrow-right" size="20"  @click="clickIconApproval(item.processInstanceId,item.name,item.id)"></x-icon>
                </div>
               <p>开始时间：{{item.createDate}}</p>
               <p>结束时间：{{item.endDate}}</p>
            </flexbox-item>
        </flexbox>
        <divider v-show="dividerFlag">我是有底线的</divider>
    </div>
    </scroller>
</template>
<script>
import api from '@/assets/js/api.js'
import {ViewBox, Flexbox, FlexboxItem,Scroller,Divider } from 'vux'
const pulldownDefaultConfig = {
    content: '下拉刷新',
    height: 40,
    autoRefresh: false,
    downContent: '下拉刷新',
    upContent: '释放后刷新',
    loadingContent: '正在刷新...',
    clsPrefix: 'xs-plugin-pulldown-'
}
const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  }
export default {
     data(){
         return{
            status:{
                 pulldownStatus : 'default',
                 pullupStatus : 'default'
            },
            pageNo:0,//分页第几页，默认0开始，表示第一页
            dividerFlag:false,
            dataListSum:0,//总数据条数
            completeFlowList:[],//每页数据
            showDataAllFlowList:[],//所有分页追加的数据数组
            pullupDefaultConfig: pullupDefaultConfig,
            pulldownDefaultConfig: pulldownDefaultConfig
         }
    },
    methods: {
        clickIconApproval(processInstanceId,name,id){
            console.info("点击了第"+id+"流程id");
            console.info("name-------->"+name);
            let status ='';
            this.$router.push({
                path: '/memberHome/approvalDetail',
                query:{
                    processInstanceId:processInstanceId,
                    flowname:name,
                    id:id
                }
            });
        },
        /**
         * @param isAppend 为true时表示追加数据、分页；为false的时表示不分页
         */
        async loadApprovalFlowList(isAppend){//加载审批流程
            let self = this;
            let params = {};
            params.pageNo = 0;
            if(isAppend){
                params.pageNo =  self.pageNo;
            }
            params.pageSize = 3;
            let result = await api.getApprovalFlowList(params).then(res=>{
                var resObject = res.data;
                console.log(resObject.list.length);
                if(resObject!=null && resObject.list.length >0){
                    console.log(resObject.count);
                    console.log(resObject.list.length);
                    if(resObject.list.length===resObject.count){//一次加载完成了，没有更多了
                        self.$refs.scrollerBottom.disablePullup();
                        self.dividerFlag = true;
                    }
                    self.dataListSum = resObject.count;
                    self.completeFlowList = resObject.list;
                    self.showDataAllFlowList = self.showDataAllFlowList.concat(self.completeFlowList);
                }else{//暂无数据
                    self.$refs.scrollerBottom.disablePullup();
                    self.dividerFlag = true;
                }
            });
        },
        loadMore(){
            console.log("加载更多。。。。"+this.dataListSum);
          if (this.showDataAllFlowList.length >= this.dataListSum) {//数据已经加载完了，禁止加载数据
            this.$refs.scrollerBottom.disablePullup();
            this.dividerFlag = true;
          }else{//继续加载分页
            this.pageNo = this.pageNo + 1;
            this.loadApprovalFlowList(true);//分页数据
            this.$refs.scrollerBottom.donePullup();
            this.dividerFlag = false;
          }
        },
    },
    mounted(){
        this.$store.commit('UPDATE_PAGE_TITLE','待审批列表');
        this.loadApprovalFlowList(false);
        this.$nextTick(() => {
            this.$refs.scrollerBottom.reset({top: 0})
        });
    },
    components:{
    ViewBox, 
    Flexbox,
    FlexboxItem,
    Scroller,
    Divider
    }
}
</script>
<style lang="">
    .flexboxItem{
        font-size:12px;
        padding:15px;
    }
    .border-b{
        border-bottom:1px solid #b2b2b2;
    }
    .vux-x-icon{
        fill:#09BB07
    }
    .completeStatus{
        color:#09BB07
    }
</style>