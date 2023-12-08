import { createRouter, createWebHistory } from 'vue-router'
import {createApp, defineComponent} from 'vue';
import Footer from '../components/FooterIcon.vue';

import IndexPage from '../views/IndexPage.vue'
import IndexLogin from '../views/IndexLogin.vue'
import IndexLocation from '../views/IndexLocation.vue'
import StorePage from '../views/StorePage.vue'
import StoreInside from '../views/StoreInside.vue'
import MemberCenter from '../views/MemberCenter.vue'
import MemberFavoritePage from '../views/MemberFavoritePage.vue'
import FriendAdd from '../views/FriendAdd.vue'
import PointRecord from '../views/PointRecord.vue'
import FooterComponent from '../views/FooterComponent.vue'
import CardPage from '../views/CardPage.vue'
import MemberNotify from '../views/MemberNotify.vue'
import MemberQuestion from '../views/MemberQuestion.vue'
import PointPage from '../views/PointPage.vue'
import FriendSendAndListOld from '../views/FriendSendAndListOld.vue'
import LineLogin from '../views/LineLogin.vue'
import StoreCategoryPage from '../views/StoreCategoryPage.vue'
import GoogleMap from '../components/GoogleMap.vue'
import GoogleMap_Index from '../views/GoogleMap_Index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: IndexPage
  },
  {
    path: '/LineLogin',
    name: 'LineLogin',
    component: LineLogin
  },
  {
    path: '/IndexLogin',
    name: 'login',
    component: IndexLogin
  },
  {
    path: '/IndexLocation',
    name: 'location',
    component: IndexLocation
  },
  {
    path: '/footer',
    name: 'footer',
    component: FooterComponent
  },
  {
    path: '/member',
    name: 'member',
    component: MemberCenter
  },
  {
    path: '/friendadd',
    name: 'friendadd',
    component: FriendAdd
  },
  {
    path: '/memfav',
    name: 'memberfav',
    component: MemberFavoritePage
  },
  {
    path: '/pointrecord',
    name: 'pointrecord',
    component: PointRecord
  },
  {
    path: '/store',
    name: 'store',
    component: StorePage
  },
  {
    path: '/storeinside',
    name: 'storeinside',
    component: StoreInside
  },
  {
    path: '/card',
    name: 'CardPage',
    component: CardPage
  },
  {
    path: '/memnotify',
    name: 'mem-notify',
    component: MemberNotify
  },
  {
    path: '/memquestion',
    name: 'memquestion',
    component: MemberQuestion
  },
  {
    path: '/point',
    name: 'point',
    component: PointPage
  },
  {
    path: '/send',
    name: 'frisend',
    component: FriendSendAndListOld
  },
  {
    path: '/send/:id',
    name: 'send',
    component: PointPage // 用于显示发送页面的组件
  },
  {
    path: '/send/:storeName',
    name: 'friendSendstore',
    component: FriendSendAndListOld
  },
  {
    path: '/send/:point',
    name: 'friendSendpoint',
    component: FriendSendAndListOld
  },
  {
    path: '/send/:storeName/:point',
    name: 'friendSendstorepoint',
    component: FriendSendAndListOld
  },
  {
    path: '/storecategorypage/:category',
    name: 'storecategorypage',
    component: StoreCategoryPage
  },
  { 
    path: '/storeinside/:ShopMail',
    name: 'storeinside',
    component: StoreInside
  },
  {
    path: '/map',
    name: 'map',
    component: GoogleMap
  },
  {
    path: '/mapindex',
    name: 'MapIndex',
    component: GoogleMap_Index
  },
  {
    name: 'UsersView2',
    path:"/Login",
    component:() => import('../components/UsersView.vue')
  },
  {
    name: 'RegisterPage',
    path:'/RegisterPage',
    component:() => import('../components/RegisterPage.vue')
  },
  {
    name: 'PointExchange',
    path:'/PointExchange',
    component:() => import('../views/PointExchange.vue'),
  },
  {
    name: 'InputAmount',
    path:'/InputAmount',
    component:() => import('../components/InputAmount.vue'),
  },
  {
    name: 'ActivityView',
    path:'/ActivityView',
    component:() => import('../components/ActivityView.vue'),
  },
  {
    name: 'ProblemReport',
    path:'/ProblemReport',
    component:() => import('../components/ProblemReport.vue'),
  },
  {
    name: 'DistributionRecord',
    path:'/DistributionRecord',
    component:() => import('../components/DistributionRecord.vue'),
  },
  {
    name: 'FooterIcon',
    path:'/FooterIcon',
    component:() => import('../components/FooterIcon.vue')
  },
  {
    name: 'ChangeView',
    path:'/ChangeView',
    component:() => import('../components/ChangeView.vue'),
  },
  {
    name: 'StoreAchievement',
    path:'/StoreAchievement',
    component:() => import('../components/StoreAchievement.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach(() => {
  // 确保 Vue 应用程序已经挂载到 DOM 元素后再执行
  const app = document.getElementById('app');
  if (app) {
    const footer = document.createElement('div');
    const FooterComponent = defineComponent(Footer);
    createApp().component('Footer', FooterComponent).mount(footer);
    app.appendChild(footer);
  }
});


export default router;