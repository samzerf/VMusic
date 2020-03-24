import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import Toplist from 'components/toplist/toplist'
// import UserCenter from 'components/user-center/user-center'

const Recommend = resolve => {
  import('components/recommend/recommend').then(mod => {
    resolve(mod)
  })
}

const Rank = resolve => {
  import('components/rank/rank').then(mod => {
    resolve(mod)
  })
}

const Search = resolve => {
  import('components/search/search').then(mod => {
    resolve(mod)
  })
}

const Singer = resolve => {
  import('components/singer/singer').then(mod => {
    resolve(mod)
  })
}

const SingerDetail = resolve => {
  import('components/singer-detail/singer-detail').then(mod => {
    resolve(mod)
  })
}

const Disc = resolve => {
  import('components/disc/disc').then(mod => {
    resolve(mod)
  })
}

const Toplist = resolve => {
  import('components/toplist/toplist').then(mod => {
    resolve(mod)
  })
}

const UserCenter = resolve => {
  import('components/user-center/user-center').then(mod => {
    resolve(mod)
  })
}

Vue.use(Router)

export default new Router({
  mode: 'history',
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
