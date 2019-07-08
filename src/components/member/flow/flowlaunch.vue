<template>
    <div style="padding:0px 5px">
    <el-collapse accordion>
        <el-collapse-item v-for="(dic,index) in resObject" :key="index" :name="(index+1)">
            <template slot="title">
            <i class="header-icon el-icon-s-promotion" style="color:blue"></i><span style="font-weight:bold">{{dic.label}}</span>
            </template>
            <ul>
                <li v-for="(item,index) in dic.labelList" :key="index" @click="gotoDetail(item.id,item.name)">
                <el-row :id=item.id>
                    <el-col :span="12"><div class="">{{item.name}}</div></el-col>
                    <el-col :span="12"><div class="text-right"><i class="el-icon-arrow-right"></i></div></el-col>
                    </el-row>
                </li>
            </ul>
        </el-collapse-item>
    </el-collapse>
    </div>
</template>
<script>
import api from '@/assets/js/api.js'
export default {
    data(){
        return {
            resObject:'',
            activeName: '1',
            vshow:false,
            readNum:'12',
            read:'down',
            readUserList:[
                {
                 name:'请假审批单'   
            },
                {
                 name:'电脑补贴审批'   
            },
            ]
        }
    },methods:{
            gotoDetail(id,name){
                console.log("进入下一步:"+id);
                this.$router.push({
                path: '/memberHome/flowforms',
                query:{
                    flowId:id,
                    flowname:name,
                }
                });
            },
            async loadflowlaunch(){//流程发起
                let _this = this;
                let params = {};
                let result = await api.getUpFlow(params).then(res=>{
                    if(res.data!=null && res.data.length > 0 ){
                        _this.resObject = res.data;
                    }
                });
            }
    },mounted(){
        this.loadflowlaunch();
        this.$store.commit('UPDATE_PAGE_TITLE','发起流程列表');
    },
    components:{
       
    }    
}
</script>
<style>
.text-right{
    text-align:right;
}
.el-collapse-item__content{
    padding-bottom:0px !important;
}
.el-row{
    padding: 5px 10px;
}
</style>
