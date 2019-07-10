import HttpRequest from './HttpRequest.js'
let baseUrl = "";//process.env.API_ROOT;
//根据process.env.API_ROOT的值判断当前是什么环境
//命令：npm run build -- test,设置的就是测试环境
let Host = process.env.API_ROOT;
Host = Host ==='prod'?'http://test1.wxchina.com:16032':'http://localhost:8080';
baseUrl = Host;
let url = {
    //获取当前登录的用户
    getCurrentUser:'/activitiPhone/getCurrentUser',
    // 已办流程、代办流程      
    finshedOrunfinshedList: '/activitiPhone/getFinshedFlow', 
    //具体流程走势
    getSingleFlowDetail: '/activitiPhone/getSingleFlowDetail',
    //流程发起
    getUpFlow: '/activitiPhone/getUpFlow',
    //流程发起表单填写
    getUpFlowForm: '/activitiPhone/getUpFlowForm',
    //获取组织架构树
    getDepartmentInfo: '/activitiPhone/getDepartmentInfo',
    //提交表单流程
    submitFlowForm: '/activitiPhone/submitFlowForm',
    //获取审批流程列表
    getApprovalFlowList:'/activitiPhone/getApproval',
    //根据流程id获取详细审批流程
    getApprovalFlowById:'/activitiPhone/getApprovalFlowById',
    //保存审批表单数据
    saveApprovalData: '/activitiPhone/saveApprovalData',   
    //根据表单Id获取节点审批表单id
    getFormIdById: '/activitiPhone/getFormIdById',
    //根据组别id获取该组人员情况
    getPersonByGroupId: '/activitiPhone/getPersonByGroupId',
    //转审
    transferApproval:'/activitiPhone/transferApproval'
}


let  api = {
    getCurrentUser(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getCurrentUser,
            data:datas
        });
    },
    //已办流程、代办流程 
    finshedOrunfinshedList(datas){
        return HttpRequest.getRequest({
            method:'POST',
            url:baseUrl + url.finshedOrunfinshedList,
            // url:'proxy/getMessage',
            data:datas
        });
    },
    //流程发起
    getUpFlow(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getUpFlow,
            data:datas
        });
    },
    //具体流程走势
    getSingleFlowDetail(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getSingleFlowDetail,
            data:datas
        });
    },
    //根据流程id获取详细审批流程
    getApprovalFlowById(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getApprovalFlowById,
            data:datas
        });
    },
    //根据表单Id获取节点审批表单id
    getFormIdById(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getFormIdById,
            data:datas
        });
    },
    //根据组别id获取该组人员情况
    getPersonByGroupId(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getPersonByGroupId,
            data:datas
        });
    },
    //获取组织架构树
    getDepartmentInfo(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getDepartmentInfo,
            data:datas
        });
    },
    //获取审批流程列表
    getApprovalFlowList(datas){
        return HttpRequest.getRequest({
            method:'POST',
            url:baseUrl + url.getApprovalFlowList,
            data:datas
        });
    },
    //流程发起表单填写
    getUpFlowForm(datas){
        return HttpRequest.getRequest({
            method:'GET',
            url:baseUrl + url.getUpFlowForm,
            data:datas
        });
    },
    //提交表单流程
    submitFlowForm(datas){
        return HttpRequest.getRequest({
            method:'POST',
            url:baseUrl + url.submitFlowForm,
            data:datas
        });
    },
    //保存审批表单数据
    saveApprovalData(datas){
        return HttpRequest.getRequest({
            method:'POST',
            url:baseUrl + url.saveApprovalData,
            data:datas
        });
    },
    //转审
    transferApproval(datas){
        return HttpRequest.getRequest({
            method:'POST',
            url:baseUrl + url.transferApproval,
            data:datas
        });
    }
}
export default api;