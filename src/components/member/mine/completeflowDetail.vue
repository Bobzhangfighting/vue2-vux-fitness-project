<template>
    <div class="completeflowdetail">
         <div class="border">
             <div>
                <group>
                    <cell class="cellfontSize" :title="firstObjectList.name" style="font-weight:bold"></cell>
                    <cell class="cellfontSize" :title="userNameTitle" :value="firstObjectList.userName"></cell>
                    <cell v-for="(field,index) in firstObjectList.fields" :key="index" class="cellfontSize" :title="field.name">
                        <div v-if="field.type==='upload'">
                            <a :href= href style="font-size:9px">{{datasubstring(field.value)}}</a>
                        </div>
                        <div v-else>
                            {{field.value}}
                        </div>
                    </cell>
                </group>
            </div>
            <div style="margin-top:10px;padding:15px 5px;background-color:#fff">
                <el-steps :active="ObjectList.length" finish-status="success" direction="vertical" :align-center=true>
                   <el-step :title="item.name"  v-for="(item,index) in ObjectList" :key="index" :id="item.id">
                     <template slot="description" >
                            <el-row>
                                <el-row class="processing_content_detail" style="float:left;width:100%">
                                    <el-col>审批人:<span style="color:#219AFF">{{item.userName}}</span>&nbsp;&nbsp;完成了审批</el-col>
                                    <el-col><i class="el-icon-time"></i>&nbsp;&nbsp;{{getLocalTime(item.started)}}</el-col>
                                </el-row> 
                            </el-row>
                            <el-row class="processing_content" v-for="(field,ck) in item.fields" :key="ck">                    
                                    <el-row :gutter="12" v-if="field.type==='multi-line-text'">
                                        <el-col :span="12"><div style="margin-left:10px">{{field.name}}：</div></el-col>
                                        <el-col>
                                            <el-input type="textarea" disabled autosize placeholder="请输入内容"  maxlength="50" show-word-limit v-model="field.value"></el-input>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="12" v-else>
                                        <el-col :span="12"><div style="margin-left:10px">{{field.name}}：</div></el-col>
                                        <el-col :span="12"><div style="text-align:right;margin-right:10px">{{field.value}}</div></el-col>
                                    </el-row>
                            </el-row>
                     </template>
                    </el-step>                    
                </el-steps>
            </div>   
        </div>  
    </div>
</template>
<script>
import { Cell,Group } from 'vux'
import api from '@/assets/js/api.js'
export default {
    data(){
        return {
           href:'',
           firstObjectList:[], //表单信息
           ObjectList:[],//审批节点
           active:1,
           userNameTitle:'发起人'
        }
    },
    methods:{
        async loadSingleFlowDetail(flowId){
            let self = this;
            let params = {};
            params.processInstanceId = flowId;
            let result = await api.getSingleFlowDetail(params).then(res=>{
                var resObject = res.data;
                console.log(resObject);
                self.firstObjectList = resObject[0];
                for(let i=1;i<resObject.length;i++){
                    self.ObjectList.push(resObject[i]);
                }
            });
        },
        getLocalTime(val) {     
                return this.common.getLocalTime(val);
        },
        datasubstring(val){
          
            return this.common.datasubstring(val);
        }
    },
    mounted(){
        let flowId = this.$route.query.id;//查询流程id
        let status = this.$route.query.status;//查询流程状态
        if(status==='end'){
            this.$store.commit('UPDATE_PAGE_TITLE','已办列表详细')
        }else{
            this.$store.commit('UPDATE_PAGE_TITLE','在办列表详细')
        }
        this.loadSingleFlowDetail(flowId);
    },
    components:{
       Cell,
       Group
    }
}
</script>
<style>
.cellfontSize{
    font-size:12px
}
.border{
    padding: 0px 10px 10px 10px;
}
.completeflowdetail{
 font-size:12px;
}
.el-step__description{
    padding-right: 10% !important;
}
.el-step__main .el-step__title{
    font-size: 12px;
}
.stepComponent{
      background-color:#DFEBFF;
      width: 100%-20px;
      padding: 10px 10px 10px 10px;
      margin: 10px 10px 10px 10px;
  }
  .stepsTitle{
      margin: 10px 0px  10px  10px ;
  }
  .approvalProcess{
      color: #9EADC4;
      font-size: 14px;
      background:#DFEBFF;
      margin-left:20px;
      margin-right:0px;
      margin-top:10px;
  }
  .processing_content{
    background-color: #D9E5F9;
  }
  .processing_content_detail{
     margin-left: 10px;
     margin-top: 3.5px;
     margin-bottom: 3.5px;
	 width:150px;
     display:inline-block;
  }
</style>
