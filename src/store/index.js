// store/index.js
import { createStore } from 'vuex'

export default createStore({
    state: {
        // 被选中的菜单数组
        selMenu: sessionStorage.getItem('selMenu') ? JSON.parse(sessionStorage.getItem('selMenu')) : {},
        //菜单列表
        menu: sessionStorage.getItem('menu') ? JSON.parse(sessionStorage.getItem('menu')) : [],
    },
    mutations: {
        changeMenu(state, item) {
            state.selMenu = item
        },
        // 插入后台数据返回的菜单值
        pushMenu(state, item) {
            state.menu = item; // 向数组中推入一个新元素  
        }
    },
    actions: {
    },
    modules: {
        // 其他模块
    }
})
