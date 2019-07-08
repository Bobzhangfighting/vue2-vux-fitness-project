<template>
    <div style="padding:5px">
        <group >
            <div v-for="(item,index) in resObject" :key="index" class="border-bottom" ref="input">
                <x-input v-model="inputValue[index]" :dataId="item.id" v-if="item.type==='text' || item.type==='upload'" :title="item.name" type="text"  text-align="right" placeholder="请输入" :show-clear=false  >
                </x-input>
                 <x-input v-model="inputValue[index]" :dataId="item.id" v-if="item.type==='integer'" :title="item.name" type="tel"  text-align="right" placeholder="请输入数字" :show-clear=false  >
                </x-input>
                <Datetime :dataId="item.id"  v-model="inputValue[index]" v-else-if="item.type==='date'" :title="item.name" value="67" :min-year=2019 :max-year=2050 placeholder="请选择时间"></Datetime>
                <x-textarea :dataId="item.id" v-model="inputValue[index]"  v-else-if="item.type==='multi-line-text'" :title="item.name"  placeholder="请输入备注"></x-textarea>
                <checklist :dataId="item.id" v-model="inputValue[index]" v-else-if="item.type==='radio-buttons'" :title="item.name" :value="value5" :options="item.options" label-position="left" @on-change="whichOne"></checklist>
                <radio :dataId="item.id" v-model="inputValue[index]"  v-else-if="item.type==='boolean'"  :options="options"></radio>
                <!-- v-else-if="item.type==='department'"-->
                <PopupRadio v-model="inputValue[index]" v-else-if="item.type==='dropdown'" :title="item.name" :options="item.options"></PopupRadio> 
                <cell title="组织部门" v-else-if="item.type==='department'" :value="cellText" :arrow-direction="showarrow" @click.native="cellclick" class="border-bottom"></cell>
            </div> 
            <div style="margin-top:20px">
                <x-button text="提交" type="primary" @button-global-height="buttonHeight" @click.native="submit"></x-button>
            </div>
            <!--组织架构树-->
                <div>
                    <x-dialog v-model="show"  @dialog-max-width="dialogmaxwidth" :hide-on-blur=true >
                        <div style="width:100%;height:600px;overflow:auto">
                            <el-row>请点击选择部门</el-row>
                         <el-tree
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="propsTree"
                            :load="loadNode"
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
        </group>
    </div>
</template>
<script>
import {Selector, XSwitch ,XDialog ,CellBox,Cell,Group,Calendar,Datetime,XTextarea,PopupRadio,PopupPicker,Picker,Checklist,XInput,Checker, CheckerItem,Radio,XButton  } from 'vux'
import { setTimeout } from 'timers';
import api from '@/assets/js/api.js'
export default {
    data(){
        return {
            formKey:'',//表单key
            formId:'',//表单id
            flowname:'',//流程名称
            flowId:'',//流程Id
            inputValue:[],//input输入框的值
            selectedList:[],//复选框选中的值
            cellText:'点我选择',
            dialogShow:true,
            showarrow:'up',
            propsTree: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            dialogmaxwidth:'400px',
            show:false,
            buttonHeight:'32px',
            title:'单选',
            options:['aa','bb'],
            value:'',
            valueckeck:[],
            checklist:'',
            resObject:'',
            props: { multiple: true },
            Vvalue:'',
            value: 1,
            value7:'',
            partoptions:[{key:'one',value:'radio1'}],
            value6:[],
            option:[
                {key:'name',value:'篮球'},
                {key:'name1',value:'足球'},
                {key:'name2',value:'游泳'}
                ],
            value5:[],
            value4:'开始时间',
            value3:'',
            value2:['华为'],
            dataList:[{name:'小米',id:1}, {name:'iPhone',id:2}]
        }
    },methods:{
        cellclick(){
            console.log("点击cell");
             this.show=true;
        },
        whichOne(value,label){
            console.log("value=="+value+"label=="+label);
        },
        async submit(){//提交流程表单
            let _this = this;
            console.log(_this.inputValue.length);
            if(_this.cellText==='点我选择' && _this.inputValue.length<1){//如果表单信息未选中，直接跳出
                _this.common.showAlert('温馨提示','请填写表单信息');
                return;
            }
            let inputKey = [];
            for(let i=0;i<_this.inputValue.length;i++){
                inputKey.push(_this.resObject[i].id);
            }
                //请求参数封装
            var params={
                processDefinitionId: _this.flowId,
                name: _this.flowname,
                formId:_this.formId,
                key:_this.formKey,
                inputKey:inputKey,
                inputValue:_this.inputValue
            };
            let result = await api.submitFlowForm(params).then(res=>{
                var responseCode = res.status;
                     if(responseCode === 200){
                           _this.common.showAlert('温馨提示','流程提交成功');
                           setTimeout(function(){
                               _this.$router.push({
                                     path: '/memberHome/flowlaunch',
                               });
                           },500)
                     }else{
                        _this.common.showAlert('系统异常','提交流程失败');
                     }
            });
        },
        async loadFlowForms(flowId){
                let _this = this;
                let params = {};
                params.flowId = flowId;
                let result = await api.getUpFlowForm(params).then(res=>{
                    if(res.data!=null && res.data.fields.length > 0 ){
                            _this.resObject = res.data.fields;
                            _this.formId = res.data.id;
                            _this.formKey = res.data.key;
                        }
                });
        },
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ name: "广州市玄武无线科技股份有限公司",id:"1132c6d8-3eeb-11e8-961c-005056aed64e",parentId:"0",parent_ids:"0"}]);
            }else{
                this.getTreeChild(node, resolve)
            }
        },
        async getTreeChild(node,resolve){//加载组织架构树
            var parent_id = node.data.id;
            let  data1 = [];
            let params = {};
            params.parent_id = parent_id;
            let result = await api.getDepartmentInfo(params).then(res=>{
                     this.data1 = res.data;
                     resolve(this.data1);
            });
        },
        checkedComfirm(){//提交选中的复选框
           console.log(this.$refs.tree.getCheckedNodes());
           this.selectedList = this.$refs.tree.getCheckedNodes();
           if(this.selectedList.length===0){
               this.cellText ='点我选择';
                this.show = false;
               return;
           }
           let str = '';
           for(let i=0;i<this.selectedList.length;i++){
               str+= this.selectedList[i].name+",";
           }
           this.cellText = str.substring(0,str.length-1);
           console.log(this.cellText);
           this.show = false;
        },
        resetChecked(){//清除选中的复选框
            this.$refs.tree.setCheckedKeys([]);
        },
        inputChange(index){
            console.log(index);
        }
    },components:{
        Selector, 
        XSwitch ,
        XDialog ,
        XButton,
        Radio,
        CellBox,
        Cell,
        Group,
        Calendar,
        Datetime,
        XTextarea,
        PopupRadio,
        PopupPicker,
        Picker,
        Checklist,
        XInput,
        Checker, 
        CheckerItem 
    },mounted(){
        this.flowname = this.$route.query.flowname;//查询流程名称
        this.flowId = this.$route.query.flowId;//流程id
        this.loadFlowForms(this.flowId);
        this.$store.commit('UPDATE_PAGE_TITLE',this.flowname);
    },watch:{
        // window.addEventListener('touchmove', func, { passive: false })
    }
}
</script>

<style>
.el-tree-node__label{
    font-size:10px !important;
}
.weui-cells{
    font-size:12px !important;
}
.border-bottom{
    border-bottom: 1px solid #dcdfe6;
}
.defalut-class{
    color:blue;
}   
.selected-class{
    color:red;
}
.crile{
    height:10px;
    width:10px;
    border-radius: 5px;
    border:1px solid blue;
}
.weui-mask{
    opacity: 0.5;
}
.weui-dialog{
    width: 95% !important;
    max-width: 100% !important;
}
</style>
