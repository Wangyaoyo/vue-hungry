// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods'
import ratings from 'components/seller/seller'
import seller from 'components/ratings/ratings'

import 'common/stylus/in.styl'
//设置为false以阻止vue在启动时生成生产提示
Vue.config.productionTip = false

//通过Vue.use安装vue-router模块
Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  linkActiveClass:'active',
  routes:[
    { path: '/goods', component: goods},
    { path: '/seller', component: ratings},
    { path: '/ratings',component: seller}
  ]
});

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
/* 注释掉的原因 */
// router.push('/goods')

