import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'views/recommend/recommend'
const Rank = () => import(/* webpackChunkName: "rank" */ 'views/rank/rank')
const Search = () => import(/* webpackChunkName: "search" */ 'views/search/search')
const Singer = () => import(/* webpackChunkName: "singer" */ 'views/singer/singer')
const SingerDetail = () => import(/* webpackChunkName: "singer-detail" */ 'views/singer-detail/singer-detail')
const Disc = () => import(/* webpackChunkName: "disc" */ 'views/disc/disc')
const Toplist = () => import(/* webpackChunkName: "toplist" */ 'views/toplist/toplist')
const UserCenter = () => import(/* webpackChunkName: "user-center" */ 'views/user-center/user-center')

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: Recommend
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: Toplist
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
