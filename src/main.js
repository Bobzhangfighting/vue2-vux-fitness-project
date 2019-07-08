// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from'./router/memberRouter.js'      //---------自定义的路由文件
import Base from './assets/js/common.js'         //---------自定义的公共函数和公共请求方法
import stores from './store/store'                //---------自定义的全局变量
import './assets/css/base.css'                    //---------引入的全局公共css
import 'element-ui/lib/theme-chalk/index.css'
import { AlertPlugin, ToastPlugin } from 'vux'
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin, {position: 'top'})
FastClick.attach(document.body)
Vue.use(ElementUI);
Vue.config.productionTip = false
//注册全局函数和全局常量
Vue.prototype.common= Base.common;  //-----注册到vue的全局，方便各个组件和页面js调用公共函数
Vue.use(VueRouter)

var globalVm=new Vue({
	router,            //-----router文件
    el: '#app',
    store:stores,          //-----全局变量
    template: '<App/>',
    components: { App }
})
