import { createRouter, createWebHistory } from 'vue-router'
import { Message } from "@arco-design/web-vue";

const routes = [{
    path: '/',
    redirect: '/login',
    meta: {
        title: '登录'
    },
},
{
    path: '/login',
    name: 'Login',
    meta: {
        title: '登录'
    },
    component: () => import('../view/login/login.vue')
},
{
    path: '/layout',
    name: 'Layout',
    meta: {
        title: '通用问答库'
    },
    component: () => import('../view/layout/index.vue'),
    children: [{
        path: '',
        name: 'Index',
        meta: {
            title: '通用问答库'
        },
        component: () => import('../view/knowledgeLibrary/general.vue'),
    }, {
        path: '/index',
        name: 'Index',
        meta: {
            title: '通用问答库'
        },
        component: () => import('../view/knowledgeLibrary/general.vue'),
    }, {
        path: '/industry',
        name: 'Industry',
        meta: {
            title: '行业问答库'
        },
        component: () => import('../view/knowledgeLibrary/industry.vue'),
    }, {
        path: '/diy',
        name: 'Diy',
        meta: {
            title: '自定义问答库'
        },
        component: () => import('../view/knowledgeLibrary/diy.vue'),
    }, {
        path: '/shopList',
        name: 'ShopList',
        meta: {
            title: '商品列表'
        },
        component: () => import('../view/shopLibrary/shopList.vue'),
    }, {
        path: '/tagManager',
        name: 'TagManagement',
        meta: {
            title: '自定义问答库'
        },
        component: () => import('../view/shopLibrary/tagManager.vue'),
    }, {
        path: '/account',
        name: 'Account',
        meta: {
            title: '账号管理'
        },
        component: () => import('../view/system/account.vue'),
    }, {
        path: '/role',
        name: 'Role',
        meta: {
            title: '角色管理'
        },
        component: () => import('../view/system/role.vue'),
    }, {
        path: '/shopInfo',
        name: 'ShopInfo',
        meta: {
            title: '店铺信息'
        },
        component: () => import('../view/system/shopInfo.vue'),
    }],
}, {
    path: '/error',
    name: 'Error',
    meta: {
        title: '账号无角色'
    },
    component: () => import('../view/error/noRole.vue'),
}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.path != '/login') {
        if (!sessionStorage.getItem('token')) {
            Message.error('登陆已过期，请重新登录')
            setTimeout(() => {
                router.push('/login')
            }, 1000)
        }
    }
    next();
})
export default router
