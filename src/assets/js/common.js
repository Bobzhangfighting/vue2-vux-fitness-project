
import Vue from 'vue'
import { AjaxPlugin,AlertPlugin } from 'vux'
Vue.use(AlertPlugin)
Vue.use(AjaxPlugin)
// 用于全局的公共函数
const common ={
	   // 本地存储
        localSet(obj,key){
            var newObj = obj;
            var str = JSON.stringify(newObj);
            localStorage.setItem(key,str);
        },
        localGet(key){
            var str = localStorage.getItem(key);
            return JSON.parse(str);
        },
        localClear(key){
            localStorage.removeItem(key);
        },

        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },

        getLocalTime(val) {     
            var date = new Date(val);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds(); 
            return  Y+M+D+h+m+s;
        },
        showAlert(title,content){
            this.$vux.alert.show({
                title: title,
                content: content,
                buttonText: '好的',
                hideOnBlur: true,
                maskZIndex: 100
             }); 
        },
        datasubstring(val){
            var index =  val.lastIndexOf(',');
            var str = "https://kite.wxchina.com/file/"+ val.substring(index+1,val.length)
            this.href = str;
            return str;
         }
}


//导出模块
export default {
	common
}


