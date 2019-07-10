<template>
    <div id="approval">
        <!--审批表单-->
            <div>
                <group>
                    <cell class="cellfontSize" :title="firstObjectList.name" style="font-weight:bold"></cell>
                    <cell class="cellfontSize" :title="userNameTitle" :value="firstObjectList.userName"></cell>
                    <cell class="cellfontSize" :title="startedTime" :value="getLocalTime(firstObjectList.started)"></cell>
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
        <!--审批走势-->
        <div style="background-color:#fff;margin-top:10px;" v-show="isFirstPot">
            <group>
                <cell class="cellfontSize fb" title="审批流程走势"></cell>
            </group>
            <div style="padding-left:5px" class=" ">
                <el-steps direction="vertical" :active="ObjectList.length">
                    <el-step :title="item.name" v-for="(item,index) in ObjectList" :key="index">
                        <template slot="description">
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
                                            <el-input type="textarea" disabled autosize   maxlength="50" show-word-limit v-model="field.value"></el-input>
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
        <!--审批结果及意见-->
        <div>
            <group>
                 <cell class="cellfontSize fb" title="审批结果及意见"></cell>
                 <x-textarea title="审批意见" v-model="Textvalue" :autosize=true placeholder="请输入审批意见"></x-textarea>
                 <div style="text-align:center;padding:15px 0px">
                    <x-button :mini=true action-type="button" type="primary" class="button-right" @click.native="agree">同意</x-button>
                    <x-button :mini=true action-type="button" type="warn" class="button-right" @click.native="reset">驳回</x-button>
                    <x-button :mini=true action-type="button" type="default" @click.native="returnAprroval">转审</x-button>
                 </div>
            </group>
        </div>
        <!--调用部门-人组织架构-->
        <div>
            <x-dialog v-model="show"  @dialog-max-width="dialogmaxwidth" :hide-on-blur=true >
                <div style="width:100%;height:600px;overflow:auto">
                    <el-row style="font-size:11px">请点击选择人员</el-row>
                    <el-tree
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="propsTree"
                    :load="loadNode"
                    @node-click="appendChild"
                    lazy
                    show-checkbox
                    >
                    </el-tree>
                    
                    <el-row style="padding:20px">
                        <el-button type="primary" size="small" style="margin-right:15%" @click="checkedComfirm">确定</el-button>
                        <el-button type="danger" size="small" style="margin-left:15%" @click="resetChecked">重置</el-button>
                    </el-row>
                </div>
            </x-dialog>
        </div>
    </div>
</template>
<script>
import { Cell,Group,Divider,XTextarea,XButton,Confirm,XDialog   } from 'vux'
import Vue from 'vue'
import { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)
import api from '@/assets/js/api.js'
import { setTimeout } from 'timers';
export default {
    data(){
        return {
              isHavechild:true,//懒加载是否还有子节点
              dialogmaxwidth:'400px',
              formId:'',
              processInstanceId:'',
              id:'',
              Textvalue:'',
              inputKey:[],
              inputValue:[],
              firstObjectList:[], //表单信息
              userNameTitle:'发起人',
              startedTime:'发起时间',
              href:'',
              isFirstPot:true,//是否第一个节点
              ObjectList:[],
              colorreset:'#000',
              show:false,
              propsTree: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
        }
    },methods:{
        async loadApprovalFlowDetail(flowId){
            let self = this;
            let params ={};
            params.flowId = flowId;
            let result = await api.getApprovalFlowById(params).then(res=>{
                    var resObject = res.data;
                    self.firstObjectList = resObject[0];
                    if(resObject.length==1){
                        self.isFirstPot = false;
                    }
                    for(let i=1;i<resObject.length;i++){
                        self.ObjectList.push(resObject[i]);
                    }
            });
        },
        datasubstring(val){
           return this.common.datasubstring(val);
        },
        getLocalTime(val) {     
              return this.common.getLocalTime(val);
        },
        agree(){
            console.log("同意");
            this.comfirm('确定同意吗？','agree');
        },
        reset(){
            console.log("驳回");
            this.comfirm('确定驳回吗？','reset');
        },
        returnAprroval(){
            console.log("转审");
            this.comfirm('确定转审吗？','return');
        },
        comfirm(content,step){//确认弹窗
            this.$vux.confirm.show({
                content:content,
                onCancel : () => {
                    console.log("取消了") 
                },
                onConfirm : () => {
                    if(step==='agree'){
                        this.save('同意');
                    }else if(step==='reset'){
                         this.save('不同意');   
                    }else if(step==='return'){
                        this.show = true;

                    }
                }
            });
        },
       async save(isAgree){//保存审批表单数据
            let self = this;
            self.inputValue.push(isAgree);
            self.inputValue.push(self.Textvalue);
            let params = {};
            params.formId = self.formId;//审批表单id
            params.taskModelId = self.id;
            params.inputKey = self.inputKey;
            params.inputValue = self.inputValue;
            let result = await api.saveApprovalData(params).then(res=>{
                var resObject = res.data;
                    if(resObject.errorCode==0){
                        self.common.showAlert('温馨提示','流程执行成功');
                        setTimeout(function(){
                            self.$router.push({
                                path:'/'
                            });
                        },1000);
                    }else{
                        self.common.showAlert('温馨提示','流程执行失败');
                    }
            });

        },
        async getFormIdById(){
            let self = this;
            let params = {};
            params.id = self.id;
            let result = await api.getFormIdById(params).then(res=>{
                 var resObject = res.data;
                     self.formId = resObject.id;
                     for(let i=0;i<resObject.fields.length;i++){
                            self.inputKey.push(resObject.fields[i].id);
                     }
            });
        },
        async loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ name: "广州市玄武无线科技股份有限公司",id:"1132c6d8-3eeb-11e8-961c-005056aed64e",parentId:"0",parent_ids:"0"}]);
            }else{
               this.getTreeChild(node, resolve);
            }
        },
        async getTreeChild(node,resolve){//加载组织架构树
            let self = this;
            let childrenData = [];
            let params = {};
            params.parent_id =  node.data.id;
            let result = await api.getDepartmentInfo(params).then(res=>{
                  childrenData = res.data;
                    if(childrenData.length==0){//部门加载完毕
                       self.isHavechild = false;
                    }
                        resolve(childrenData);
            });  
        },
        async appendChild(data,node,object){
            let self = this;
            if(self.isHavechild==false){//部门已经加载完毕，加载所在组别的人员数据
                let params = {};
                params.groupId = data.id;
                let result = await api.getPersonByGroupId(params).then(res=>{
                     var result = res.data;
                        if (result && result.length > 0) {
                            self.$nextTick(() => {
                                self.$refs['tree'].updateKeyChildren(data.id,result);
                            })
                        }
                });
            }
        },
        async checkedComfirm(){
            let _this = this;
            //获取当前选中的节点
            let checkPerson = this.$refs['tree'].getCheckedNodes();
            let phone = checkPerson[0].phone;
            console.log(phone);
            let params = {};
            params.taskId = _this.id;
            params.phone = phone;
            let result = await api.transferApproval(params).then(res=>{
                    var resObject = res.data;
                    console.log(resObject);
                    if(resObject==='true'){
                        _this.show = false;
                        setTimeout(function(){
                            _this.$router.push({
                                path:'/'
                            });
                        });
                    }else{
                        _this.show = false;
                        _this.common.showAlert('温馨提示','流程转审失败');
                    }
            });
        },
        resetChecked(){
            console.log("重置");
            this.$refs.tree.setCheckedKeys([]);
        }
    },components:{
        Cell,
        Group,
        Divider,
        XTextarea,
        XButton,
        Confirm,
        XDialog  
    },mounted(){
         let processInstanceId = this.$route.query.processInstanceId;//查询流程id
         this.id = this.$route.query.id;//数据id
         let flowname = this.$route.query.flowname;//查询流程名称
         this.$store.commit('UPDATE_PAGE_TITLE',flowname);
         this.getFormIdById();
         this.loadApprovalFlowDetail(processInstanceId);
    }
}
</script>

<style>
.cellfontSize{
    font-size:12px
}
.fb{
    font-weight: bold;
}
#approval{
    padding: 0px 10px 10px 10px;
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
.button-right{
    margin-right:10px;
}
</style>
