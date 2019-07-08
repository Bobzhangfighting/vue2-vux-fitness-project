import Vue from 'vue'
import VueRouter from 'vue-router'
import memberHome from '@/components/memberHome'
import mine from '@/components/member/mine/mine'
import flowlaunch from '@/components/member/flow/flowlaunch'
import completeflow from '@/components/member/mine/completeflow'
import completeflowDetail from '@/components/member/mine/completeflowDetail'
import flowforms from '@/components/member/flow/flowforms'
import approvalList from '@/components/member/flow/approvalList'
import approvalDetail from '@/components/member/flow/approvalDetail'
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    //路由映射map
    routes: [
        { path: '/', redirect: '/memberHome/mine' },
        { path: '*', redirect: '/memberHome/mine' },
	    {
	      path: '/memberHome',
	      name: 'memberHome',
	      component: memberHome,
	      children:[
					{
						path:'/memberHome/flowforms',
						name:'flowforms',
						component:flowforms,
					},
					{
			      path: '/memberHome/flowlaunch',
			      name: 'flowlaunch',
						component: flowlaunch,
					},
					{
			      path: '/memberHome/completeflow',
			      name: 'completeflow',
						component: completeflow,
					},
					{
							path:'/memberHome/completeflowDetail',
							name:'completeflowDetail',
							component: completeflowDetail
						},
			    {
			      path: '/memberHome/mine',
			      name: 'mine',
			      component: mine
				},
				{
				path:'/memberHome/approvalList',
				name:'approvalList',
				component:approvalList
				},
				{
				path:'/memberHome/approvalDetail',
				name:'approvalDetail',
				component:approvalDetail
				},
	      ]
	    },
	     
    ]
});

export default router;