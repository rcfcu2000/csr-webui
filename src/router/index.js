// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
// import { Message } from "@arco-design/web-vue";
let base = "/lmr"//线上
// let base = ""//本地

const routes = [{
    path: base + '/',
    redirect: base + '/login',
    meta: {
        title: '登录'
    },
},
{
    path: base + '/login',
    name: 'Login',
    meta: {
        title: '登录'
    },
    component: () => import('../view/login/login.vue')
},
{
    path: base + '/layout',
    name: 'Layout',
    meta: {
        title: '通用问答库'
    },
    component: () => import('../view/layout/index.vue'),
    children: [{
        path: base + '',
        name: 'Index',
        meta: {
            title: '通用问答库'
        },
        component: () => import('../view/knowledgeLibrary/general.vue'),
    }, {
        path: base + '/index',
        name: 'Index',
        meta: {
            title: '通用问答库'
        },
        component: () => import('../view/knowledgeLibrary/general.vue'),
    }, {
        path: base + '/industry',
        name: 'Industry',
        meta: {
            title: '行业问答库'
        },
        component: () => import('../view/knowledgeLibrary/industry.vue'),
    }, {
        path: base + '/diy',
        name: 'Diy',
        meta: {
            title: '自定义问答库'
        },
        component: () => import('../view/knowledgeLibrary/diy.vue'),
    }, {
        path: base + '/shopList',
        name: 'ShopList',
        meta: {
            title: '商品列表'
        },
        component: () => import('../view/shopLibrary/shopList.vue'),
    }, {
        path: base + '/tagManager',
        name: 'TagManagement',
        meta: {
            title: '自定义问答库'
        },
        component: () => import('../view/shopLibrary/tagManager.vue'),
    }, {
        path: base + '/account',
        name: 'Account',
        meta: {
            title: '账号管理'
        },
        component: () => import('../view/system/account.vue'),
    }, {
        path: base + '/role',
        name: 'Role',
        meta: {
            title: '角色管理'
        },
        component: () => import('../view/system/role.vue'),
    }, {
        path: base + '/shopInfo',
        name: 'ShopInfo',
        meta: {
            title: '店铺信息'
        },
        component: () => import('../view/system/shopInfo.vue'),
    }],
}, {
    path: base + '/error',
    name: 'Error',
    meta: {
        title: '账号无角色'
    },
    component: () => import('../view/error/noRole.vue'),
}
]

const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})
// 路由守卫
router.beforeEach((to, from, next) => {
    // if (to.path != '/login') {
    //     if (!sessionStorage.getItem('token')) {
    //         Message.error('登陆已过期，请重新登录')
    //         setTimeout(() => {
    //             router.push('/login')
    //         }, 1000)
    //     }
    // }
    next();
})
export default router
