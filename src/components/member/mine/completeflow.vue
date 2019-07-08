<template>
    <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
              lock-x ref="scrollerBottom"  height="-46" v-model="status">
    <div>    
        <flexbox v-for="(item,index) in  showDataAllFlowList" :key="index">
            <flexbox-item class="flexboxItem border-b">
               <div>
                    <strong>{{index+1}}</strong>
                    <strong>流程名称：{{item.name}}</strong>
                    <span style="float:right" class="completeStatus"  v-if="item.nextNode==='流程结束'">已完成</span>
                    <span style="float:right" class="completeStatus"  v-else>进行中</span>
                </div>
                <div>
                    <span>流程描述：{{item.processDefinitionDescription}}</span>
                    <x-icon style="float:right;" type="ios-arrow-right" size="20"  @click="clickIcon(item.id,item.nextNode)"></x-icon>
                </div>
               <p>开始时间：{{item.startDate}}</p>
               <p>结束时间：{{item.endDate}}</p>
               <strong>节点状态：{{item.nextNode}}</strong>
            </flexbox-item>
        </flexbox>
        <divider v-show="dividerFlag">我是有底线的</divider>
    </div>
    </scroller>
</template>
<script>
import {ViewBox, Flexbox, FlexboxItem,Scroller,Divider } from 'vux'
import api from '@/assets/js/api.js'
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
        clickIcon(id,stateInco){
            console.info("点击了第"+id+"流程id");
            console.log("state---->"+stateInco);
            let status ='';
            if(stateInco==='流程结束'){
                status = "end";   
            }else{
                status = "running"
            }
            this.$router.push({
                path: '/memberHome/completeflowDetail',
                query:{
                    id:id,
                    status:status
                }
            });
        },
        /**
         * @param isAppend 为true时表示追加数据、分页；为false的时表示不分页
         */
        async loadCompleteFlowDetail(isAppend){//加载已办流程详细
            let self = this;
            var params = {};
            params.state = self.$route.query.status;
            params.pageNo = 0;
            if(isAppend){
                params.pageNo =  self.pageNo;
            }
            params.sort = "created-desc";
            params.pageSize = "3";
            let result = await api.finshedOrunfinshedList(params).then(res=>{
                 var resObject = res.data;
                    if(resObject!=null && resObject.data.length >0){
                        console.log(resObject.total);
                        console.log(resObject.data.length);
                        if(resObject.data.length===resObject.total){//一次加载完成了，没有更多了
                            self.$refs.scrollerBottom.disablePullup();
                            self.dividerFlag = true;
                        }
                        self.dataListSum = resObject.total;
                        self.completeFlowList = resObject.data;
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
            this.loadCompleteFlowDetail(true);//分页数据
            this.$refs.scrollerBottom.donePullup();
            this.dividerFlag = false;
          }
        },
    },
    mounted(){
        let status = this.$route.query.status;//确定进来的是哪种状态主题
        if(status==="running"){//在办
            this.$store.commit('UPDATE_PAGE_TITLE','在办列表');
        }else if(status=="completed"){
            this.$store.commit('UPDATE_PAGE_TITLE','已办列表');
        }
        this.loadCompleteFlowDetail(false);
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